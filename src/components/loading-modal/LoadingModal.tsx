import { Loader2 } from "lucide-react";

/**
 * Blocking, full-screen loading overlay for in-flight operations the user must
 * wait on (submitting a form, deleting). Matches the <ErrorModal> /
 * <DeleteConfirmModal> visual pattern. No dismiss affordance — it's blocking by
 * design, so there's no Escape handler or click-outside.
 */
export function LoadingModal({
  open,
  message = "Loading...",
}: {
  open: boolean;
  message?: string;
}) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      role="alertdialog"
      aria-modal="true"
      aria-busy="true"
      aria-label={message}
    >
      <div className="flex w-full max-w-xs flex-col items-center gap-3 rounded-2xl bg-white p-6 shadow-xl">
        <Loader2 className="h-8 w-8 animate-spin text-stone-900" />
        <p className="text-sm font-medium text-stone-600">{message}</p>
      </div>
    </div>
  );
}
