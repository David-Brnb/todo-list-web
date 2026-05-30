import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Avatar, Button, DeleteConfirmModal } from "@/components";
import { logout } from "@/services/firebase/authService";
import { useAuthStore } from "@/stores/auth";

export default function Account() {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const signOut = useAuthStore((s) => s.signOut);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const handleLogout = async () => {
    setConfirmOpen(false);
    try {
      await logout();
    } catch (e) {
      console.error("Error during logout:", e);
    } finally {
      signOut();
      navigate("/login", { replace: true });
    }
  };

  return (
    <div className="min-h-dvh">
      <div className="mx-auto w-full max-w-2xl px-5 pb-24 lg:px-8 lg:pt-8">
        <h1 className="py-4 font-manrope text-3xl font-extrabold tracking-tight text-ink">
          Account
        </h1>

        <div className="flex flex-col items-center pt-4">
          <Avatar uri={user?.firebaseImage} name={user?.fullName} size={96} />
          <h2 className="mt-4 font-manrope text-2xl font-bold text-ink">
            {user?.fullName || "User"}
          </h2>
          <p className="mt-1 font-inter text-sm text-ink-secondary">
            {user?.email}
          </p>
        </div>

        <dl className="mt-8 flex flex-col gap-5">
          <Field label="Role" value={user?.role} />
          <Field label="Interests" value={user?.interest} />
          <Field label="About" value={user?.description} />
        </dl>

        <section className="mt-12 rounded-2xl border border-border-soft bg-surface-alt p-6">
          <h2 className="font-manrope text-xl font-bold text-ink">
            About Scholarly Atelier
          </h2>
          <p className="mt-3 font-inter text-sm leading-6 text-ink-secondary">
            Scholarly Atelier is a focused task manager for organizing your
            study and research work into color-coded lists. Group related tasks,
            track your daily agenda, set priorities and due dates, and search
            across everything in one place.
          </p>
          <dl className="mt-6 flex flex-col gap-5">
            <Field label="Version" value="1.0.0" />
            <Field
              label="Built with"
              value="React, Vite, TypeScript, Tailwind CSS, Firebase"
            />
          </dl>
        </section>

        <div className="mx-auto mt-10 max-w-sm">
          <Button
            text="Log out"
            bgColor="#FFDAD6"
            textColor="#BA1A1A"
            onClick={() => setConfirmOpen(true)}
          />
        </div>
      </div>

      <DeleteConfirmModal
        open={confirmOpen}
        title="Log out?"
        message="Are you sure you want to log out of your account?"
        confirmText="Log out"
        onConfirm={handleLogout}
        onClose={() => setConfirmOpen(false)}
      />
    </div>
  );
}

function Field({ label, value }: { label: string; value?: string }) {
  return (
    <div>
      <dt className="font-inter text-xs font-semibold uppercase tracking-wide text-ink-muted">
        {label}
      </dt>
      <dd className="mt-1 font-inter text-base leading-6 text-ink">
        {value || "—"}
      </dd>
    </div>
  );
}
