import type { IconDTO } from "@/types/icons/iconDTO";
import { cn } from "@/lib/cn";
import { IconBadge } from "@/components/icon-badge";
import { ProgressBar } from "@/components/progress-bar";

type Props = {
  /** Right-hand pill text, e.g. "63%". */
  tag: string;
  title: string;
  icon?: IconDTO | null;
  color: string;
  /** 0..1 */
  progress: number;
  lastTaskTitle: string;
  className?: string;
};

/**
 * The big "project" card on Home — web port of the RN `TaskListMain`. Icon tile,
 * title + oldest-pending subtitle, a progress pill, and a progress bar.
 */
export function TaskListCard({
  tag,
  title,
  icon,
  color,
  progress,
  lastTaskTitle,
  className,
}: Props) {
  return (
    <div
      className={cn(
        "flex w-full flex-col gap-4 rounded-3xl border border-surface-sunken bg-surface p-5 text-left transition hover:border-brand-soft hover:shadow-sm",
        className,
      )}
    >
      <div className="flex items-center gap-4">
        <IconBadge icon={icon} color={color} size={24} />
        <div className="min-w-0 flex-1">
          <h3 className="truncate font-manrope text-base font-bold text-ink">
            {title}
          </h3>
          <p className="truncate font-inter text-xs text-ink-muted">
            {lastTaskTitle || "No pending tasks"}
          </p>
        </div>
        <span
          className="shrink-0 rounded-full px-3 py-1 font-inter text-xs font-semibold"
          style={{ backgroundColor: `${color}1A`, color }}
        >
          {tag}
        </span>
      </div>
      <ProgressBar value={progress} color={color} />
    </div>
  );
}
