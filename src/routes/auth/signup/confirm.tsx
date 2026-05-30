import { useEffect, useMemo, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { Camera } from "lucide-react";
import { BrandLogo, Button, ErrorModal, LoadingModal, Title } from "@/components";
import { getErrorMessage } from "@/services/axios/errors";
import { createUser } from "@/services/axios/users/createUser";
import { auth } from "@/services/firebase/auth";
import { registerUserWithDetails } from "@/services/firebase/authService";
import { useAuthStore } from "@/stores/auth";
import { useSignupStore } from "@/stores/signup";

export default function SignupConfirmStep() {
  const navigate = useNavigate();
  const signIn = useAuthStore((s) => s.signIn);

  const email = useSignupStore((s) => s.email);
  const password = useSignupStore((s) => s.password);
  const fullName = useSignupStore((s) => s.full_name);
  const role = useSignupStore((s) => s.rol);
  const interest = useSignupStore((s) => s.interests);
  const description = useSignupStore((s) => s.description);

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Derive the preview URL from the selected file. useMemo (not state-in-effect)
  // keeps a stable URL across re-renders; the effect below only handles
  // revocation when the file changes or the component unmounts.
  const previewUrl = useMemo(
    () => (imageFile ? URL.createObjectURL(imageFile) : null),
    [imageFile],
  );

  const [errorOpen, setErrorOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [errorActionText, setErrorActionText] = useState<string | undefined>();
  const [errorAction, setErrorAction] = useState<(() => void) | undefined>();

  // Revoke the object URL when it's replaced or on unmount to avoid leaks.
  useEffect(() => {
    if (!previewUrl) return;
    return () => URL.revokeObjectURL(previewUrl);
  }, [previewUrl]);

  // Hard refresh wipes the in-memory store — restart the flow if step 1 is missing.
  if (!email) return <Navigate to="/signup" replace />;

  const handleCreate = async () => {
    setSubmitting(true);
    try {
      const { token, userPayload } = await registerUserWithDetails(
        {
          email,
          password,
          full_name: fullName,
          rol: role,
          interests: interest,
          description,
        },
        imageFile,
      );

      let userDTO;
      try {
        userDTO = await createUser({
          fullName: userPayload.full_name,
          email: userPayload.email,
          role: userPayload.rol,
          interest: userPayload.interests,
          description: userPayload.description,
          firebaseUuid: userPayload.firebaseUuid,
          firebaseImageUuid: userPayload.firebaseImageUuid,
        });
      } catch (backendErr) {
        // Roll back the Firebase account so the email is free to retry.
        await auth.currentUser?.delete();
        console.error(backendErr);
        throw backendErr;
      }

      signIn(userDTO, token);
      useSignupStore.getState().reset();
      navigate("/home", { replace: true });
    } catch (err) {
      setSubmitting(false);
      const message = getErrorMessage(
        err,
        "An unexpected error occurred while trying to create your account.",
      );
      setErrorMessage(message);

      if (message.includes("already exists")) {
        setErrorActionText("Log In");
        setErrorAction(() => () => {
          setErrorOpen(false);
          navigate("/login", { replace: true });
        });
      } else {
        setErrorActionText(undefined);
        setErrorAction(undefined);
      }

      setErrorOpen(true);
    }
  };

  return (
    <div className="min-h-dvh">
      <header className="px-4 py-4 lg:px-8">
        <BrandLogo />
      </header>

      <main className="flex flex-col items-center px-6 py-6">
        <div className="w-full max-w-md">
          <p className="font-inter text-sm text-ink-muted">Step 3 of 3</p>
          <Title className="mt-1">Review your details</Title>

          {/* Photo picker */}
          <div className="my-6 flex justify-center">
            <label className="group relative h-36 w-36 cursor-pointer overflow-hidden rounded-full border-2 border-dashed border-border bg-surface-muted">
              <input
                type="file"
                accept="image/*"
                className="sr-only"
                onChange={(e) => setImageFile(e.target.files?.[0] ?? null)}
              />
              {previewUrl ? (
                <img
                  src={previewUrl}
                  alt="Vista previa"
                  className="h-full w-full object-cover"
                />
              ) : (
                <span className="flex h-full w-full flex-col items-center justify-center gap-1 text-ink-muted">
                  <Camera className="h-8 w-8" />
                  <span className="font-inter text-xs font-semibold">
                    Add photo
                  </span>
                </span>
              )}
            </label>
          </div>

          {/* Review box */}
          <div className="mb-6 flex flex-col gap-3 rounded-2xl bg-surface-muted p-6">
            <Row label="Name" value={fullName} />
            <Row label="Email" value={email} />
            <Row
              label="Password"
              value={"•".repeat(Math.max(password.length, 4))}
            />
            <Row label="Role" value={role} />
            {interest ? <Row label="Interests" value={interest} /> : null}
            <Row label="Description" value={description} />
          </div>

          <Button
            text="Create account"
            bgColor="#005BBF"
            textColor="#FFFFFF"
            onClick={handleCreate}
            loading={submitting}
          />
        </div>
      </main>

      <ErrorModal
        open={errorOpen}
        message={errorMessage}
        onClose={() => setErrorOpen(false)}
        actionText={errorActionText}
        onAction={errorAction}
      />

      <LoadingModal open={submitting} message="Creating your account..." />
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4">
      <span className="font-inter text-sm text-ink-muted">{label}</span>
      <span className="font-inter text-sm font-medium text-ink">{value}</span>
    </div>
  );
}
