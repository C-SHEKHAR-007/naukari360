// Semantic colour families shared by Badge, Alert, IconTile and SectionHeader.
// Full class strings (not interpolated) so Tailwind can see them.
export type Tone =
  | "neutral"
  | "primary"
  | "success"
  | "warning"
  | "danger"
  | "info"
  | "highlight"
  | "notice";

/** Tinted background + readable text (badges, icon tiles, alerts) */
export const subtleTone: Record<Tone, string> = {
  neutral: "bg-surface text-muted-foreground",
  primary: "bg-primary-subtle text-primary-emphasis",
  success: "bg-success-subtle text-success-emphasis",
  warning: "bg-warning-subtle text-warning-emphasis",
  danger: "bg-danger-subtle text-danger-emphasis",
  info: "bg-info-subtle text-info-emphasis",
  highlight: "bg-highlight-subtle text-highlight-emphasis",
  notice: "bg-notice-subtle text-notice-emphasis",
};

/** Solid fill with white/foreground text */
export const solidTone: Record<Tone, string> = {
  neutral: "bg-foreground text-background",
  primary: "bg-primary text-primary-foreground",
  success: "bg-success text-white",
  warning: "bg-warning text-white",
  danger: "bg-danger text-white",
  info: "bg-info text-white",
  highlight: "bg-highlight text-white",
  notice: "bg-notice text-white",
};

/** Hairline ring/border in the tone's colour */
export const ringTone: Record<Tone, string> = {
  neutral: "ring-border",
  primary: "ring-primary/25",
  success: "ring-success-emphasis/25",
  warning: "ring-warning-emphasis/25",
  danger: "ring-danger-emphasis/25",
  info: "ring-info-emphasis/25",
  highlight: "ring-highlight-emphasis/25",
  notice: "ring-notice-emphasis/25",
};

/** Accent border (e.g. the left rule on section headers) */
export const borderTone: Record<Tone, string> = {
  neutral: "border-border",
  primary: "border-primary",
  success: "border-success",
  warning: "border-warning",
  danger: "border-danger",
  info: "border-info",
  highlight: "border-highlight",
  notice: "border-notice",
};
