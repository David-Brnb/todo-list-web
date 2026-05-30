import type { ComponentProps } from "react";
import { cn } from "@/lib/cn";

type Props = Omit<ComponentProps<"input">, "onChange"> & {
  label?: string;
  containerClassName?: string;
  showCounter?: boolean;
  onChangeText?: (text: string) => void;
};

export function SingleLineInput({
  label,
  className,
  containerClassName,
  showCounter = true,
  value,
  onChangeText,
  maxLength,
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
      <input
        value={value}
        maxLength={maxLength}
        onChange={(e) => onChangeText?.(e.target.value)}
        className={cn(
          "h-14 w-full rounded-xl border border-border bg-surface px-4 font-inter text-base text-ink outline-none transition placeholder:text-ink-muted/60 focus:border-brand focus:ring-2 focus:ring-brand/20",
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
