import type { ReactNode } from "react";
import { AlertCircle, Inbox, Loader2 } from "lucide-react";

type LoadingProps = {
  message?: string;
  color?: string;
};

export function LoadingState({
  message = "Loading...",
  color = "#005BBF",
}: LoadingProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-20">
      <Loader2 className="h-8 w-8 animate-spin" style={{ color }} />
      <p className="font-inter text-sm text-ink-secondary">{message}</p>
    </div>
  );
}

type EmptyProps = {
  icon?: ReactNode;
  title?: string;
  message?: string;
};

export function EmptyState({
  icon,
  title = "Nothing here yet",
  message = "",
}: EmptyProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 py-20 text-center">
      <span className="flex h-16 w-16 items-center justify-center rounded-full bg-surface-muted text-ink-muted">
        {icon ?? <Inbox className="h-7 w-7" />}
      </span>
      <p className="font-inter text-base font-semibold text-ink">{title}</p>
      {message ? (
        <p className="max-w-xs font-inter text-sm text-ink-secondary">
          {message}
        </p>
      ) : null}
    </div>
  );
}

type ErrorProps = {
  message?: string;
  onRetry?: () => void;
};

export function ErrorState({
  message = "Something went wrong. Please try again.",
  onRetry,
}: ErrorProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-20 text-center">
      <span className="flex h-16 w-16 items-center justify-center rounded-full bg-danger-soft text-danger">
        <AlertCircle className="h-7 w-7" />
      </span>
      <p className="max-w-xs font-inter text-sm text-ink-secondary">{message}</p>
      {onRetry ? (
        <button
          type="button"
          onClick={onRetry}
          className="rounded-xl bg-surface-muted px-4 py-2 font-inter text-sm font-semibold text-ink-secondary transition hover:bg-surface-sunken"
        >
          Retry
        </button>
      ) : null}
    </div>
  );
}
