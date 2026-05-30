import { cn } from "@/lib/cn";

type Props = {
  title: string;
  time: string;
  color: string;
  className?: string;
};

// Pulls "HH:mm" out of whatever the backend sends (full ISO, "HH:mm:ss",
// or a "T19:00" fragment). Ported from the RN TodayCard.
function formatTime(timeString: string): string {
  if (!timeString) return "";

  if (/^\d{2}:\d{2}(:\d{2})?$/.test(timeString)) {
    return timeString.substring(0, 5);
  }

  const date = new Date(timeString);
  if (!isNaN(date.getTime())) {
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
  }

  const match = timeString.match(/T(\d{2}):(\d{2})/);
  if (match) return `${match[1]}:${match[2]}`;

  return timeString;
}

export function TodayCard({ title, time, color, className }: Props) {
  return (
    <div
      className={cn(
        "flex items-center justify-between gap-3 rounded-xl border border-surface-sunken bg-surface p-4",
        className,
      )}
    >
      <div className="flex min-w-0 items-center gap-3">
        <span
          className="h-2 w-2 shrink-0 rounded-full"
          style={{ backgroundColor: color }}
        />
        <span className="truncate font-inter text-sm font-semibold text-ink">
          {title}
        </span>
      </div>
      <span
        className="shrink-0 font-inter text-xs font-bold"
        style={{ color }}
      >
        {formatTime(time)}
      </span>
    </div>
  );
}
