import type { UserDTO } from "@/types/users/userDTO";
import { create } from "zustand";
import { persist } from "zustand/middleware";

type AuthState = {
  user: UserDTO | null;
  token: string | null;
  hydrated: boolean;
  signIn: (user: UserDTO, token: string) => void;
  setToken: (token: string) => void;
  signOut: () => void;
  hydrate: () => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      hydrated: false,

      signIn: (user, token) => set({ user, token }),

      // Persist a freshly-minted token (e.g. after the interceptor refreshes it)
      // without touching the cached user, so the localStorage fallback stays current.
      setToken: (token) => set({ token }),

      signOut: () => set({ user: null, token: null }),

      hydrate: () => set({ hydrated: true }),
    }),
    {
      name: "auth",
      // Only persist the data — not the hydrated flag or the actions.
      partialize: (state) => ({ user: state.user, token: state.token }),
      // Flip `hydrated` once persist has restored from localStorage, so the
      // root gate knows the cached session is available.
      onRehydrateStorage: () => (state) => {
        state?.hydrate();
      },
    },
  ),
);
