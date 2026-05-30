import { Loader2 } from "lucide-react";
import { cn } from "@/lib/cn";

type Props = {
  text: string;
  bgColor: string;
  textColor: string;
  onClick?: () => void;
  type?: "button" | "submit";
  disabled?: boolean;
  loading?: boolean;
  className?: string;
};

export function Button({
  text,
  bgColor,
  textColor,
  onClick,
  type = "button",
  disabled,
  loading,
  className,
}: Props) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      style={{ backgroundColor: bgColor, color: textColor }}
      className={cn(
        "flex h-14 w-full items-center justify-center gap-2 rounded-xl px-4 font-manrope text-base font-bold tracking-wide transition active:opacity-90 disabled:cursor-not-allowed disabled:opacity-60",
        className,
      )}
    >
      {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : text}
    </button>
  );
}
