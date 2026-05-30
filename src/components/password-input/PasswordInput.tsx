import type { ComponentProps } from "react";
import { useState } from "react";
import { cn } from "@/lib/cn";

type Props = Omit<ComponentProps<"input">, "onChange" | "type"> & {
  label?: string;
  containerClassName?: string;
  showToggle?: boolean;
  showCounter?: boolean;
  onChangeText?: (text: string) => void;
};

export function PasswordInput({
  label,
  className,
  containerClassName,
  showToggle = true,
  showCounter = true,
  value,
  onChangeText,
  maxLength,
  ...p
}: Props) {
  const [visible, setVisible] = useState(false);
  const displayCounter = showCounter && typeof maxLength === "number";
  const current = typeof value === "string" ? value : "";

  return (
    <label className={cn("block w-full", containerClassName)}>
      {label ? (
        <span className="mb-1 block px-1 font-inter text-sm font-medium text-ink-secondary">
          {label}
        </span>
      ) : null}
      <div className="relative">
        <input
          type={visible ? "text" : "password"}
          autoComplete="current-password"
          value={value}
          maxLength={maxLength}
          onChange={(e) => onChangeText?.(e.target.value)}
          className={cn(
            "h-14 w-full rounded-xl border border-border bg-surface px-4 font-inter text-base text-ink outline-none transition placeholder:text-ink-muted/60 focus:border-brand focus:ring-2 focus:ring-brand/20",
            showToggle && "pr-16",
            className,
          )}
          {...p}
        />
        {showToggle ? (
          <button
            type="button"
            onClick={() => setVisible((v) => !v)}
            className="absolute inset-y-0 right-3 flex items-center px-2 font-inter text-xs font-semibold uppercase text-brand"
          >
            {visible ? "Hide" : "Show"}
          </button>
        ) : null}
      </div>
      {displayCounter ? (
        <span className="mt-1 block px-1 text-right font-inter text-xs text-ink-muted">
          {current.length}/{maxLength}
        </span>
      ) : null}
    </label>
  );
}
