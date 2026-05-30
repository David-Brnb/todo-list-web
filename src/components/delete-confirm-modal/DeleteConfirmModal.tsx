import { useEffect, useRef } from "react";
import { useFocusTrap } from "@/lib/useFocusTrap";

type Props = {
  open: boolean;
  title?: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onClose: () => void;
};

/**
 * Destructive confirmation dialog — web port of the RN `DeleteConfirmModal`.
 * ESC cancels; the backdrop is inert (destructive dialogs don't dismiss on an
 * accidental outside click).
 */
export function DeleteConfirmModal({
  open,
  title = "Delete task?",
  message = "This action can't be undone. The task will be permanently deleted.",
  confirmText = "Delete",
  cancelText = "Cancel",
  onConfirm,
  onClose,
}: Props) {
  const dialogRef = useRef<HTMLDivElement>(null);
  useFocusTrap(dialogRef, open);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-6"
      role="presentation"
    >
      <div
        ref={dialogRef}
        role="alertdialog"
        aria-modal="true"
        aria-label={title}
        className="w-full max-w-sm rounded-2xl bg-surface p-6 shadow-xl"
      >
        <h2 className="font-manrope text-lg font-bold text-ink">{title}</h2>
        <p className="mt-2 font-inter text-sm text-ink-secondary">{message}</p>
        <div className="mt-5 flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="h-12 flex-1 rounded-xl border border-border-soft font-manrope text-sm font-semibold text-ink-secondary transition hover:bg-surface-muted"
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="h-12 flex-1 rounded-xl bg-danger font-manrope text-sm font-semibold text-white transition hover:opacity-90"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
