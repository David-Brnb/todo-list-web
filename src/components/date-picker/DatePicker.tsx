type Props = {
  label?: string;
  value: Date | undefined;
  onChange: (value: Date | undefined) => void;
  accentColor?: string;
};

const pad = (n: number) => String(n).padStart(2, "0");

// Date → "YYYY-MM-DDTHH:mm" in LOCAL time, the format <input type="datetime-local"> expects.
function toInputValue(date: Date | undefined): string {
  if (!date) return "";
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
    date.getDate(),
  )}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

/**
 * Native datetime picker — web port of the RN `DatePicker`. The value is a Date;
 * the parent converts it to the backend's `LocalDateTime` string at submit.
 */
export function DatePicker({
  label = "Due Date",
  value,
  onChange,
  accentColor = "#005BBF",
}: Props) {
  return (
    <label className="block w-full">
      <span className="mb-1 block px-1 font-inter text-sm font-medium text-ink-secondary">
        {label}
      </span>
      <input
        type="datetime-local"
        value={toInputValue(value)}
        onChange={(e) =>
          onChange(e.target.value ? new Date(e.target.value) : undefined)
        }
        style={{ accentColor }}
        className="h-14 w-full rounded-xl border border-border bg-surface px-4 font-inter text-base text-ink outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20"
      />
    </label>
  );
}
