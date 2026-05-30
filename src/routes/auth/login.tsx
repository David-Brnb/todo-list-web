import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  BrandLogo,
  Button,
  LoadingModal,
  PasswordInput,
  SingleLineInput,
  Title,
} from "@/components";
import { getErrorMessage } from "@/services/axios/errors";
import { getUserById } from "@/services/axios/users/getUserById";
import { auth } from "@/services/firebase/auth";
import { login } from "@/services/firebase/authService";
import { useAuthStore } from "@/stores/auth";

export default function Login() {
  const navigate = useNavigate();
  const signIn = useAuthStore((s) => s.signIn);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function loginAccount(e: FormEvent) {
    e.preventDefault();
    setError("");

    const trimmedEmail = email.trim();

    if (!trimmedEmail) {
      setError("Please enter your email address.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      setError(
        "The email address is invalid. Make sure it's correctly formatted (e.g. user@domain.com).",
      );
      return;
    }

    if (!password) {
      setError("Please enter your password.");
      return;
    }

    if (password.length < 8) {
      setError(
        "The password must be at least 8 characters. Please check and try again.",
      );
      return;
    }

    setLoading(true);
    try {
      const token = await login(trimmedEmail, password);
      const userDTO = await getUserById(auth.currentUser!.uid);
      signIn(userDTO, token);
      navigate("/home", { replace: true });
    } catch (err) {
      setError(
        getErrorMessage(
          err,
          "An unexpected error occurred while trying to log in.",
        ),
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-dvh flex-col lg:flex-row">
      {/* Brand panel — desktop only */}
      <aside
        className="relative hidden flex-col justify-between p-12 text-white lg:flex lg:w-1/2"
        style={{
          backgroundImage:
            "linear-gradient(135deg, #005BBF 0%, #1A73E8 60%, #0088FF 100%)",
        }}
      >
        <BrandLogo color="#FFFFFF" />
        <div className="max-w-md">
          <h2 className="font-manrope text-4xl font-extrabold leading-tight tracking-tight">
            Your day, in order.
          </h2>
          <p className="mt-4 font-inter text-lg text-white/80">
            Organize tasks, lists, and priorities in one place.
          </p>
        </div>
        <span className="font-inter text-sm text-white/60">
          © {new Date().getFullYear()} TaskFlow
        </span>
      </aside>

      {/* Form panel */}
      <main className="flex flex-1 flex-col px-6 py-10 lg:px-16">
        <div className="lg:hidden">
          <BrandLogo />
        </div>

        <div className="flex flex-1 items-center justify-center">
          <form onSubmit={loginAccount} className="w-full max-w-md space-y-5">
            <Title>Login</Title>

            {error ? (
              <p
                role="alert"
                className="rounded-xl bg-danger-soft px-4 py-3 font-inter text-sm text-danger"
              >
                {error}
              </p>
            ) : null}

            <SingleLineInput
              label="Email"
              type="email"
              inputMode="email"
              autoComplete="email"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
              placeholder="you@example.com"
              maxLength={50}
            />

            <PasswordInput
              label="Password"
              value={password}
              onChangeText={setPassword}
              placeholder="••••••••"
              showCounter={false}
            />

            <Button
              text="login"
              bgColor="#005BBF"
              textColor="#FFFFFF"
              type="submit"
              loading={loading}
            />

            <p className="text-center font-inter text-sm text-ink-muted">
              Don't have an account?{" "}
              <Link to="/signup" className="font-semibold text-brand">
                Create account
              </Link>
            </p>
          </form>
        </div>
      </main>

      <LoadingModal open={loading} message="Signing in..." />
    </div>
  );
}
