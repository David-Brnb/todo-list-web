import { auth } from "@/services/firebase/auth";
import axios, {
  type AxiosError,
  type InternalAxiosRequestConfig,
} from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  // Generous timeout: free-tier hosts (Render/Railway/Fly) cold-start in
  // 30-50s after idle, and a 5s timeout would fail the first request.
  timeout: 30000,
});

// Lazy store import avoids a circular dependency at module-load time.
async function getAuthStore() {
  const { useAuthStore } = await import("@/stores/auth");
  return useAuthStore;
}

// Single-flight refresh: if several requests get 401 at once, they all await the
// same getIdToken(true) call instead of triggering a stampede of refreshes.
let refreshPromise: Promise<string | null> | null = null;
function refreshIdToken(): Promise<string | null> {
  if (!refreshPromise) {
    refreshPromise = (async () => {
      const user = auth.currentUser;
      if (!user) return null;
      const token = await user.getIdToken(true);
      const store = await getAuthStore();
      store.getState().setToken(token);
      return token;
    })().finally(() => {
      refreshPromise = null;
    });
  }
  return refreshPromise;
}

api.interceptors.request.use(async (config) => {
  let token: string | null = null;

  // Prefer a live Firebase token. getIdToken() returns the cached token and
  // transparently refreshes it when it's near expiry, so we rarely send a stale
  // one. Falls back to the persisted token before Firebase rehydrates on launch.
  if (auth.currentUser) {
    try {
      token = await auth.currentUser.getIdToken();
      const store = await getAuthStore();
      if (store.getState().token !== token) {
        store.getState().setToken(token);
      }
    } catch {
      // fall through to the persisted token
    }
  }

  if (!token) {
    try {
      const store = await getAuthStore();
      token = store.getState().token;
    } catch {
      // no store yet — send the request unauthenticated
    }
  }

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as
      | (InternalAxiosRequestConfig & { _retry?: boolean })
      | undefined;

    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      try {
        const token = await refreshIdToken();
        if (token) {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return api(originalRequest);
        }
      } catch {
        // refresh failed — fall through to sign-out below
      }

      // Unrecoverable: no Firebase user or the refresh failed. Clear local auth
      // so the route guards bounce the user back to the login screen instead of
      // leaving them "logged in" with every request silently failing.
      try {
        const store = await getAuthStore();
        store.getState().signOut();
      } catch {
        // ignore — nothing else we can do here
      }
    }

    return Promise.reject(error);
  },
);

export default api;
