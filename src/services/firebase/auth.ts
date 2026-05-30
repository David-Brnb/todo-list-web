import {
  browserLocalPersistence,
  getAuth,
  initializeAuth,
  type Auth,
} from "firebase/auth";
import { app } from "./firebase";

// Initialize Auth with browserLocalPersistence so the Firebase session — and,
// crucially, the refresh token used to mint new ID tokens — survives full page
// reloads. This is the web analog of the RN app's AsyncStorage persistence.
//
// initializeAuth throws if it runs twice on the same app (e.g. Vite HMR),
// so we fall back to getAuth() when it's already been initialized.
let auth: Auth;
try {
  auth = initializeAuth(app, { persistence: browserLocalPersistence });
} catch {
  auth = getAuth(app);
}

export { auth };
