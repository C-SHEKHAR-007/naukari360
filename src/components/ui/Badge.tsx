import { cn } from "@/lib/utils";
import { ringTone, solidTone, subtleTone, type Tone } from "./tones";

export interface BadgeProps extends React.ComponentProps<"span"> {
  tone?: Tone;
  variant?: "subtle" | "solid";
}

export function Badge({ tone = "neutral", variant = "subtle", className, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide",
        variant === "solid" ? solidTone[tone] : [subtleTone[tone], "ring-1", ringTone[tone]],
        className
      )}
      {...props}
    />
  );
}
