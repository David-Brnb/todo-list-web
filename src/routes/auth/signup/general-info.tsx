import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import {
  BrandLogo,
  Button,
  ErrorModal,
  Label,
  MultilineInput,
  SingleLineInput,
  Title,
} from "@/components";
import { useSignupStore } from "@/stores/signup";

const ROLE_OPTIONS = [
  "Developer",
  "Designer",
  "Product Manager",
  "Student",
  "Teacher",
  "Other",
];

export default function SignupGeneralInfoStep() {
  const navigate = useNavigate();
  const setField = useSignupStore((s) => s.setField);
  const email = useSignupStore((s) => s.email);

  const [role, setRole] = useState("");
  const [customRole, setCustomRole] = useState("");
  const [interest, setInterest] = useState("");
  const [description, setDescription] = useState("");

  const [errorOpen, setErrorOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Hard refresh wipes the in-memory store — restart the flow if step 1 is missing.
  if (!email) return <Navigate to="/signup" replace />;

  function fail(message: string) {
    setErrorMessage(message);
    setErrorOpen(true);
  }

  function handleContinue(e: React.FormEvent) {
    e.preventDefault();
    const selectedRole = role === "Other" ? customRole.trim() : role.trim();
    const trimmedDescription = description.trim();

    if (!selectedRole) return fail("Please select or enter a role.");
    if (!trimmedDescription) {
      return fail("Please enter a description about yourself.");
    }

    setField("rol", selectedRole);
    setField("interests", interest.trim());
    setField("description", trimmedDescription);

    navigate("/signup/confirm");
  }

  return (
    <div className="min-h-dvh">
      <header className="px-4 py-4 lg:px-8">
        <BrandLogo />
      </header>

      <main className="flex flex-col items-center px-6 py-6">
        <form onSubmit={handleContinue} className="w-full max-w-md space-y-5">
          <Title>General Info</Title>

          {/* Role selector — web-native <select>, with a custom field for "Other" */}
          <div className="w-full">
            <Label className="mb-1 block px-1">Role</Label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="h-14 w-full rounded-xl border border-border bg-surface px-4 font-inter text-base text-ink outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20"
            >
              <option value="" disabled>
                Select a role...
              </option>
              {ROLE_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>

            {role === "Other" ? (
              <SingleLineInput
                placeholder="Write your role here"
                value={customRole}
                onChangeText={setCustomRole}
                containerClassName="mt-3"
                showCounter={false}
                maxLength={40}
              />
            ) : null}
          </div>

          <SingleLineInput
            label="Interest (Optional)"
            placeholder="e.g. Coding, Photography, Cooking..."
            value={interest}
            onChangeText={setInterest}
            showCounter={false}
            maxLength={80}
          />

          <MultilineInput
            label="Description"
            value={description}
            onChangeText={setDescription}
            placeholder="Tell us a bit about yourself..."
            maxLength={200}
          />

          <Button
            text="Continue"
            bgColor="#005BBF"
            textColor="#FFFFFF"
            type="submit"
          />
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
