import { useEffect, useRef, useState } from "react";
import { MoreVertical, Pencil, Trash2 } from "lucide-react";
import type { IconDTO } from "@/types/icons/iconDTO";
import { cn } from "@/lib/cn";
import { Checkbox } from "@/components/checkbox";
import { IconBadge } from "@/components/icon-badge";

type Props = {
  title: string;
  description?: string;
  color: string;
  icon?: IconDTO | null;
  completed?: boolean;
  onToggle?: () => void;
  onUpdate?: () => void;
  onDelete?: () => void;
};

export function TaskCard({
  title,
  description,
  color,
  icon,
  completed,
  onToggle,
  onUpdate,
  onDelete,
}: Props) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close the row menu on an outside click or ESC.
  useEffect(() => {
    if (!menuOpen) return;
    const onDown = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMenuOpen(false);
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [menuOpen]);

  return (
    <div
      className={cn(
        "flex items-center gap-4 rounded-xl bg-surface p-4 shadow-sm",
        completed && "opacity-80",
      )}
      style={!completed ? { borderLeft: `4px solid ${color}` } : undefined}
    >
      <Checkbox checked={!!completed} onChange={onToggle} color={color} />

      <IconBadge
        icon={icon}
        color={completed ? "#9CA3AF" : color}
        size={20}
        className="h-10 w-10 rounded-lg"
      />

      <div className="min-w-0 flex-1">
        <p
          className={cn(
            "truncate font-manrope text-sm font-semibold text-ink",
            completed && "font-normal text-ink-secondary line-through",
          )}
        >
          {title}
        </p>
        {description ? (
          <p
            className={cn(
              "truncate font-inter text-xs text-ink-muted",
              completed && "opacity-60",
            )}
          >
            {description}
          </p>
        ) : null}
      </div>

      {onUpdate || onDelete ? (
        <div className="relative" ref={menuRef}>
          <button
            type="button"
            aria-label="Task options"
            onClick={() => setMenuOpen((v) => !v)}
            className="flex h-8 w-8 items-center justify-center rounded-full text-ink-secondary transition hover:bg-surface-muted"
          >
            <MoreVertical className="h-5 w-5" />
          </button>

          {menuOpen ? (
          <div className="absolute right-0 top-9 z-20 w-40 overflow-hidden rounded-xl border border-border-soft bg-surface shadow-lg">
            <button
              type="button"
              onClick={() => {
                setMenuOpen(false);
                onUpdate?.();
              }}
              className="flex w-full items-center gap-3 border-b border-border-soft px-4 py-3 text-left font-inter text-sm text-ink transition hover:bg-surface-muted"
            >
              <Pencil className="h-4 w-4" />
              Edit
            </button>
            <button
              type="button"
              onClick={() => {
                setMenuOpen(false);
                onDelete?.();
              }}
              className="flex w-full items-center gap-3 px-4 py-3 text-left font-inter text-sm text-danger transition hover:bg-surface-muted"
            >
              <Trash2 className="h-4 w-4" />
              Delete
            </button>
          </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
