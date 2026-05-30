import { Plus } from "lucide-react";
import { cn } from "@/lib/cn";

type Props = {
  onClick?: () => void;
  color?: string;
  label?: string;
  className?: string;
};

/**
 * Floating action button — web port of the RN `Add`. Fixed by the caller via
 * `className`; defaults to a brand-blue circle with a plus icon.
 */
export function Fab({
  onClick,
  color = "#005BBF",
  label = "Add",
  className,
}: Props) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      style={{ backgroundColor: color }}
      className={cn(
        "flex h-14 w-14 items-center justify-center rounded-full text-white shadow-lg transition hover:opacity-90 active:scale-95",
        className,
      )}
    >
      <Plus className="h-6 w-6" />
    </button>
  );
}
