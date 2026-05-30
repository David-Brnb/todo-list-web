import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "@/stores/auth";

export default function AuthLayout() {
  const user = useAuthStore((s) => s.user);

  // Already signed in → bounce to the app.
  if (user) return <Navigate to="/home" replace />;

  return <Outlet />;
}
