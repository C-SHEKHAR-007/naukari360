import { cn } from "@/lib/utils";
import { ringTone, subtleTone, type Tone } from "./tones";

export interface AlertProps extends React.ComponentProps<"div"> {
  tone?: Tone;
}

export function Alert({ tone = "info", className, role, ...props }: AlertProps) {
  return (
    <div
      role={role ?? (tone === "danger" ? "alert" : "status")}
      className={cn(
        "rounded-lg px-4 py-2.5 text-sm ring-1",
        subtleTone[tone],
        ringTone[tone],
        className
      )}
      {...props}
    />
  );
}
