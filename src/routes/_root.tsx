import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { Loader2 } from "lucide-react";
import { auth } from "@/services/firebase/auth";

export default function Root() {
  const [authReady, setAuthReady] = useState(false);

  useEffect(() => {
    // Wait for Firebase to restore the persisted session once before rendering
    // protected routes, so the axios interceptor has a live `currentUser` to
    // mint fresh ID tokens. Mirrors the RN root layout's hydrate gate.
    const unsub = onAuthStateChanged(auth, () => setAuthReady(true));
    return unsub;
  }, []);

  if (!authReady) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-canvas">
        <Loader2 className="h-8 w-8 animate-spin text-brand" />
      </div>
    );
  }

  return <Outlet />;
}
