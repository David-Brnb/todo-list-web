import { createElement } from "react";
import type { IconDTO } from "@/types/icons/iconDTO";
import { cn } from "@/lib/cn";
import { resolveIcon } from "./resolveIcon";

type Props = {
  icon?: IconDTO | null;
  name?: string | null;
  color: string;
  /** Lucide icon size in px. */
  size?: number;
  /** Box classes — size + radius. Defaults to a 48px rounded-2xl tile. */
  className?: string;
};

export function IconBadge({
  icon,
  name,
  color,
  size = 22,
  className = "h-12 w-12 rounded-2xl",
}: Props) {
  // resolveIcon returns a stable module-level lucide component. Render via
  // createElement (not <Icon/>) so the lint rule doesn't read a locally-bound
  // variable as a component freshly created during render.
  const Icon = resolveIcon(icon, name);
  return (
    <span
      className={cn("inline-flex shrink-0 items-center justify-center", className)}
      style={{ backgroundColor: `${color}1A` }}
    >
      {createElement(Icon, { style: { color }, width: size, height: size })}
    </span>
  );
}
