import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type Props = {
  children: ReactNode;
  className?: string;
};

export function Title({ children, className }: Props) {
  return (
    <h1
      className={cn(
        "font-manrope text-3xl font-extrabold tracking-tight text-ink",
        className,
      )}
    >
      {children}
    </h1>
  );
}

export function Heading({ children, className }: Props) {
  return (
    <h2
      className={cn(
        "font-manrope text-xl font-bold tracking-tight text-ink",
        className,
      )}
    >
      {children}
    </h2>
  );
}

export function Body({ children, className }: Props) {
  return (
    <p className={cn("font-inter text-base text-ink-secondary", className)}>
      {children}
    </p>
  );
}

export function Label({ children, className }: Props) {
  return (
    <span
      className={cn(
        "font-inter text-sm font-medium text-ink-secondary",
        className,
      )}
    >
      {children}
    </span>
  );
}

export function Caption({ children, className }: Props) {
  return (
    <span className={cn("font-inter text-xs text-ink-muted", className)}>
      {children}
    </span>
  );
}
