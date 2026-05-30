import { cn } from "@/lib/cn";

type Props = {
  text?: string;
  color?: string;
  className?: string;
};

export function BrandLogo({
  text = "TaskFlow",
  color = "#1D4ED8",
  className,
}: Props) {
  return (
    <span
      className={cn("inline-flex items-center gap-3", className)}
      style={{ height: 28 }}
    >
      <svg width={22} height={16} viewBox="0 0 22 16" fill="none" aria-hidden>
        <path
          d="M1 2.25C1 1.836 1.336 1.5 1.75 1.5H8.5C9.605 1.5 10.5 2.395 10.5 3.5V14.25C10.5 14.664 10.164 15 9.75 15H1.75C1.336 15 1 14.664 1 14.25V2.25Z"
          fill={color}
        />
        <path
          d="M21 2.25C21 1.836 20.664 1.5 20.25 1.5H13.5C12.395 1.5 11.5 2.395 11.5 3.5V14.25C11.5 14.664 11.836 15 12.25 15H20.25C20.664 15 21 14.664 21 14.25V2.25Z"
          fill={color}
        />
      </svg>
      <span
        className="font-inter text-[20px] font-extrabold tracking-[-1px]"
        style={{ color }}
      >
        {text}
      </span>
    </span>
  );
}
