import type { ComponentProps } from "react";
import { cn } from "@/lib/cn";

type Props = Omit<ComponentProps<"textarea">, "onChange"> & {
  label?: string;
  containerClassName?: string;
  showCounter?: boolean;
  onChangeText?: (text: string) => void;
};

export function MultilineInput({
  label,
  className,
  containerClassName,
  showCounter = true,
  value,
  onChangeText,
  maxLength,
  rows = 4,
  ...p
}: Props) {
  const displayCounter = showCounter && typeof maxLength === "number";
  const current = typeof value === "string" ? value : "";

  return (
    <label className={cn("block w-full", containerClassName)}>
      {label ? (
        <span className="mb-1 block px-1 font-inter text-sm font-medium text-ink-secondary">
          {label}
        </span>
      ) : null}
      <textarea
        value={value}
        maxLength={maxLength}
        rows={rows}
        onChange={(e) => onChangeText?.(e.target.value)}
        className={cn(
          "w-full resize-y rounded-xl border border-border bg-surface p-4 font-inter text-base text-ink outline-none transition placeholder:text-ink-muted/60 focus:border-brand focus:ring-2 focus:ring-brand/20",
          className,
        )}
        {...p}
      />
      {displayCounter ? (
        <span className="mt-1 block px-1 text-right font-inter text-xs text-ink-muted">
          {current.length}/{maxLength}
        </span>
      ) : null}
    </label>
  );
}
