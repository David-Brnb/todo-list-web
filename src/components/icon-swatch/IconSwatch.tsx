import { createElement } from "react";
import type { IconDTO } from "@/types/icons/iconDTO";
import { cn } from "@/lib/cn";
import { resolveIcon } from "@/components/icon-badge";

type Props = {
  icon: IconDTO;
  selected?: boolean;
  onClick?: () => void;
};

export function IconSwatch({ icon, selected, onClick }: Props) {
  // resolveIcon returns a stable module-level lucide component — render via
  // createElement so the lint rule doesn't flag it as created during render.
  const Icon = resolveIcon(icon);
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      aria-label={icon.name ?? icon.iosName ?? `Icono ${icon.id}`}
      className={cn(
        "flex h-14 w-14 items-center justify-center rounded-xl transition",
        selected
          ? "border-b-2 border-brand bg-surface shadow-sm"
          : "bg-surface-alt hover:bg-surface-muted",
      )}
    >
      {createElement(Icon, {
        width: 26,
        height: 26,
        style: { color: selected ? "#005BBF" : "#60646C" },
      })}
    </button>
  );
}
