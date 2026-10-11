import { cn } from "@/lib/utils";
import { IconTile } from "./IconTile";
import { borderTone, type Tone } from "./tones";

interface SectionHeaderProps {
  icon?: React.ReactNode;
  tone?: Tone;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}

export function SectionHeader({
  icon,
  tone = "primary",
  title,
  subtitle,
  action,
  className,
}: SectionHeaderProps) {
  return (
    <div
      className={cn(
        "mb-5 flex items-center justify-between border-l-4 pl-4",
        borderTone[tone],
        className
      )}
    >
      <div className="flex items-center gap-2.5">
        {icon && <IconTile tone={tone}>{icon}</IconTile>}
        <div>
          {title}
          {subtitle}
        </div>
      </div>
      {action}
    </div>
  );
}
