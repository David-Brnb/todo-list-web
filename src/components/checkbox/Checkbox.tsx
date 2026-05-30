import { Check } from "lucide-react";

type Props = {
  checked: boolean;
  onChange?: () => void;
  color?: string;
  label?: string;
};

export function Checkbox({
  checked,
  onChange,
  color = "#005BBF",
  label = "Mark as completed",
}: Props) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={checked}
      aria-label={label}
      onClick={onChange}
      className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md border-2 transition"
      style={{
        borderColor: checked ? color : "#C1C6D6",
        backgroundColor: checked ? color : "transparent",
      }}
    >
      {checked ? <Check className="h-3.5 w-3.5 text-white" /> : null}
    </button>
  );
}
