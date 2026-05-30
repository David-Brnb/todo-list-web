import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  BrandLogo,
  Button,
  ErrorModal,
  PasswordInput,
  SingleLineInput,
  Title,
} from "@/components";
import { useSignupStore } from "@/stores/signup";

export default function SignupEmailStep() {
  const navigate = useNavigate();
  const setField = useSignupStore((s) => s.setField);

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [errorOpen, setErrorOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  function fail(message: string) {
    setErrorMessage(message);
    setErrorOpen(true);
  }

  function handleContinue(e: React.FormEvent) {
    e.preventDefault();
    const trimmedName = fullName.trim();
    const trimmedEmail = email.trim();

    if (!trimmedName) return fail("Please enter your full name.");
    if (!trimmedEmail) return fail("Please enter your email address.");

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      return fail(
        "The email address is invalid. Make sure it's correctly formatted (e.g. user@domain.com).",
      );
    }

    if (!password) return fail("Please enter your password.");
    if (password.length < 8) {
      return fail(
        "The password must be at least 8 characters. Please check and try again.",
      );
    }
    if (password !== confirmPassword) {
      return fail(
        "The passwords don't match. Please check and try again.",
      );
    }

    setField("full_name", trimmedName);
    setField("email", trimmedEmail);
    setField("password", password);

    navigate("/signup/general-info");
  }

  return (
    <div className="min-h-dvh">
      <header className="px-4 py-4 lg:px-8">
        <BrandLogo />
      </header>

      <main className="flex flex-col items-center px-6 py-6">
        <form onSubmit={handleContinue} className="w-full max-w-md space-y-5">
          <Title>Create Account</Title>

          <SingleLineInput
            label="Full Name"
            value={fullName}
            onChangeText={setFullName}
            placeholder="John Doe"
            autoCapitalize="words"
            maxLength={60}
            showCounter={false}
          />
          <SingleLineInput
            label="Email"
            type="email"
            inputMode="email"
            autoComplete="email"
            value={email}
            onChangeText={setEmail}
            placeholder="you@example.com"
            maxLength={50}
            showCounter={false}
          />
          <PasswordInput
            label="Password"
            value={password}
            onChangeText={setPassword}
            placeholder="••••••••"
            autoComplete="new-password"
            showCounter={false}
          />
          <PasswordInput
            label="Confirm Password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            placeholder="Confirm Password"
            autoComplete="new-password"
            showCounter={false}
          />

          <Button
            text="Continue"
            bgColor="#005BBF"
            textColor="#FFFFFF"
            type="submit"
          />

          <p className="text-center font-inter text-sm text-ink-muted">
            Already have an account?{" "}
            <Link to="/login" className="font-semibold text-brand">
              Log in
            </Link>
          </p>
        </form>
      </main>

      <ErrorModal
        open={errorOpen}
        message={errorMessage}
        onClose={() => setErrorOpen(false)}
      />
    </div>
  );
}
