import { useEffect, useRef } from "react";
import { AlertCircle } from "lucide-react";
import { useFocusTrap } from "@/lib/useFocusTrap";

type Props = {
  open: boolean;
  message: string;
  onClose: () => void;
  title?: string;
  /** Optional secondary action (e.g. "Log In" on a duplicate email). */
  actionText?: string;
  onAction?: () => void;
};

/**
 * Blocking error dialog — the web analog of the RN `ErrorModal`. Centered card,
 * ESC and backdrop-click close it, and the primary button gets focus on open.
 */
export function ErrorModal({
  open,
  message,
  onClose,
  title = "Something went wrong",
  actionText,
  onAction,
}: Props) {
  const primaryRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  useFocusTrap(dialogRef, open);

  useEffect(() => {
    if (!open) return;
    primaryRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      onClick={onClose}
      role="presentation"
    >
      <div
        ref={dialogRef}
        role="alertdialog"
        aria-modal="true"
        aria-label={title}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-sm rounded-2xl bg-surface p-6 shadow-xl"
      >
        <div className="flex flex-col items-center text-center">
          <span className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-danger-soft">
            <AlertCircle className="h-7 w-7 text-danger" />
          </span>
          <h2 className="font-manrope text-lg font-bold text-ink">{title}</h2>
          <p className="mt-2 font-inter text-sm text-ink-secondary">{message}</p>
        </div>

        <div className="mt-6 flex flex-col gap-2">
          {actionText && onAction ? (
            <button
              ref={primaryRef}
              type="button"
              onClick={onAction}
              className="h-12 w-full rounded-xl bg-brand font-manrope text-base font-bold text-white transition hover:bg-brand-active"
            >
              {actionText}
            </button>
          ) : null}
          <button
            ref={actionText ? undefined : primaryRef}
            type="button"
            onClick={onClose}
            className={
              actionText
                ? "h-12 w-full rounded-xl bg-surface-muted font-manrope text-base font-semibold text-ink-secondary transition hover:bg-surface-sunken"
                : "h-12 w-full rounded-xl bg-brand font-manrope text-base font-bold text-white transition hover:bg-brand-active"
            }
          >
            {actionText ? "Close" : "Got it"}
          </button>
        </div>
      </div>
    </div>
  );
}
