import type { PriorityUi } from "@/lib/priority";

type Props = {
  value: PriorityUi;
  onChange: (value: PriorityUi) => void;
};

const OPTIONS: { key: PriorityUi; label: string; color: string }[] = [
  { key: "baja", label: "Low", color: "#1E9E5A" },
  { key: "media", label: "Medium", color: "#F4A261" },
  { key: "alta", label: "High", color: "#BA1A1A" },
];

export function PrioritySelector({ value, onChange }: Props) {
  return (
    <div className="flex flex-col gap-2">
      <span className="px-1 font-inter text-sm font-medium text-ink-secondary">
        Priority
      </span>
      <div className="flex gap-3">
        {OPTIONS.map((option) => {
          const active = value === option.key;
          return (
            <button
              key={option.key}
              type="button"
              onClick={() => onChange(option.key)}
              className="flex-1 rounded-xl border-2 py-3 font-inter text-sm font-semibold transition"
              style={{
                borderColor: active ? option.color : "#E0E2EC",
                backgroundColor: active ? `${option.color}1A` : "transparent",
                color: active ? option.color : "#727785",
              }}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
