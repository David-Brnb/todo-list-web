import type { ReactNode } from "react";
import { X } from "lucide-react";

type Props = {
  title: string;
  onClose: () => void;
  children: ReactNode;
};

/**
 * Full-page form shell for the create/edit routes (the web replacement for the
 * RN modal sheets): a title + close button header, then a centered body.
 */
export function FormScreen({ title, onClose, children }: Props) {
  return (
    <div className="min-h-dvh">
      <header className="flex items-center justify-between px-5 py-4 lg:px-8">
        <h1 className="font-manrope text-2xl font-bold text-ink">{title}</h1>
        <button
          type="button"
          aria-label="Close"
          onClick={onClose}
          className="flex h-9 w-9 items-center justify-center rounded-full bg-surface-sunken text-ink-secondary transition hover:opacity-80"
        >
          <X className="h-5 w-5" />
        </button>
      </header>
      <div className="mx-auto w-full max-w-xl px-6 pb-16">{children}</div>
    </div>
  );
}
