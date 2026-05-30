import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type Props = {
  color: string;
  selected?: boolean;
  onClick?: () => void;
  children?: ReactNode;
  label?: string;
};

export function ColorSwatch({
  color,
  selected,
  onClick,
  children,
  label,
}: Props) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label ?? `Color ${color}`}
      aria-pressed={selected}
      style={{ backgroundColor: color }}
      className={cn(
        "flex h-14 w-14 items-center justify-center rounded-2xl transition",
        selected
          ? "ring-4 ring-brand-softer ring-offset-2 ring-offset-canvas"
          : "hover:opacity-90",
      )}
    >
      {children}
    </button>
  );
}
