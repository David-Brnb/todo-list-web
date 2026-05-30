import type { IconDTO } from "@/types/icons/iconDTO";
import { IconBadge } from "@/components/icon-badge";

type Props = {
  title: string;
  description: string;
  color: string;
  icon?: IconDTO | null;
};

export function TaskListHeader({ title, description, color, icon }: Props) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-4">
        <IconBadge
          icon={icon}
          color={color}
          size={30}
          className="h-16 w-16 rounded-2xl"
        />
        <h1 className="flex-1 font-manrope text-2xl font-bold tracking-tight text-ink">
          {title}
        </h1>
      </div>
      {description ? (
        <p className="font-inter text-base text-ink-secondary">{description}</p>
      ) : null}
    </div>
  );
}
