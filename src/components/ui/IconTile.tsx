import { cn } from "@/lib/utils";
import { ringTone, subtleTone, type Tone } from "./tones";

// Small tinted square holding an icon (category tiles, section headers, stats)
export function IconTile({
  tone = "primary",
  ring = false,
  className,
  ...props
}: React.ComponentProps<"div"> & { tone?: Tone; ring?: boolean }) {
  return (
    <div
      className={cn(
        "inline-flex items-center justify-center rounded-lg p-2",
        subtleTone[tone],
        ring && ["ring-1", ringTone[tone]],
        className
      )}
      {...props}
    />
  );
}
