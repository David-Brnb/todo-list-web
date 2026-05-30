import { cn } from "@/lib/cn";

type Props = {
  /** 0..1 */
  value: number;
  color?: string;
  className?: string;
};

export function ProgressBar({ value, color = "#005BBF", className }: Props) {
  const pct = Math.max(0, Math.min(1, value)) * 100;
  return (
    <div
      className={cn(
        "h-2 w-full overflow-hidden rounded-full bg-surface-muted",
        className,
      )}
    >
      <div
        className="h-full rounded-full transition-[width]"
        style={{ width: `${pct}%`, backgroundColor: color }}
      />
    </div>
  );
}
