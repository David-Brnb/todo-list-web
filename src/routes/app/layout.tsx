import { Navigate, Outlet } from "react-router-dom";
import { Sidebar } from "@/components/sidebar";
import { useAuthStore } from "@/stores/auth";

export default function AppLayout() {
  const user = useAuthStore((s) => s.user);

  // Not signed in → the interceptor or the user landed here without a session.
  if (!user) return <Navigate to="/login" replace />;

  return (
    <div className="min-h-dvh lg:flex">
      <Sidebar />
      {/* Bottom padding on mobile clears the fixed bottom nav. */}
      <div className="flex-1 pb-20 lg:pb-0">
        <Outlet />
      </div>
    </div>
  );
}
