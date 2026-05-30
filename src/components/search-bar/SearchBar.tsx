import { Search, X } from "lucide-react";
import { cn } from "@/lib/cn";

type Props = {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  onClear?: () => void;
  className?: string;
};

export function SearchBar({
  value,
  onChangeText,
  placeholder = "Search...",
  onClear,
  className,
}: Props) {
  return (
    <div
      className={cn(
        "flex h-12 items-center gap-3 rounded-xl bg-surface-muted px-4",
        className,
      )}
    >
      <Search className="h-5 w-5 shrink-0 text-ink-muted" />
      <input
        type="search"
        value={value}
        onChange={(e) => onChangeText(e.target.value)}
        placeholder={placeholder}
        aria-label={placeholder}
        className="flex-1 bg-transparent font-inter text-base text-ink outline-none placeholder:text-ink-muted [&::-webkit-search-cancel-button]:hidden"
      />
      {value.length > 0 ? (
        <button
          type="button"
          aria-label="Clear search"
          onClick={onClear}
          className="shrink-0 text-ink-muted transition hover:text-ink"
        >
          <X className="h-4 w-4" />
        </button>
      ) : null}
    </div>
  );
}
