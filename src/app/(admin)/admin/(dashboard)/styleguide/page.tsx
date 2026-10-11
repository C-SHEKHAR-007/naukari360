import type { Metadata } from "next";
import { AlertTriangle, Bell, Briefcase, CheckCircle2, Info, Sparkles } from "lucide-react";
import {
  Alert,
  Badge,
  Button,
  Card,
  IconTile,
  Input,
  Label,
  SectionHeader,
  Select,
  Textarea,
  type Tone,
} from "@/components/ui";
import ThemeToggle from "@/components/public/ThemeToggle";

export const metadata: Metadata = { title: "Style guide" };

// Full class strings so Tailwind generates them
const SURFACES = [
  ["background", "bg-background"],
  ["surface", "bg-surface"],
  ["card", "bg-card"],
  ["accent", "bg-accent"],
  ["border", "bg-border"],
  ["input", "bg-input"],
] as const;

const BRAND = [
  ["brand", "bg-brand"],
  ["primary", "bg-primary"],
  ["primary-hover", "bg-primary-hover"],
  ["primary-subtle", "bg-primary-subtle"],
  ["secondary", "bg-secondary"],
] as const;

const TONES: Tone[] = [
  "neutral",
  "primary",
  "success",
  "warning",
  "danger",
  "info",
  "highlight",
  "notice",
];

function Swatch({ name, className }: { name: string; className: string }) {
  return (
    <div className="text-xs">
      <div className={`h-14 rounded-lg border border-border ${className}`} />
      <p className="mt-1.5 font-mono text-muted-foreground">{name}</p>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Card className="p-6">
      <h2 className="mb-4 text-base font-semibold text-foreground">{title}</h2>
      {children}
    </Card>
  );
}

export default function StyleGuidePage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Style guide</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Design tokens and shared components. Switch theme to check both modes.
          </p>
        </div>
        <ThemeToggle className="border border-border" />
      </div>

      <Section title="Surfaces">
        <div className="grid grid-cols-3 gap-4 sm:grid-cols-6">
          {SURFACES.map(([name, cls]) => (
            <Swatch key={name} name={name} className={cls} />
          ))}
        </div>
      </Section>

      <Section title="Brand">
        <div className="grid grid-cols-3 gap-4 sm:grid-cols-5">
          {BRAND.map(([name, cls]) => (
            <Swatch key={name} name={name} className={cls} />
          ))}
        </div>
      </Section>

      <Section title="Text">
        <p className="text-foreground">Foreground — primary reading text</p>
        <p className="text-muted-foreground">Muted foreground — secondary text and metadata</p>
        <p className="text-primary">Primary — links and emphasis</p>
        <p className="text-secondary">Secondary — brand navy</p>
        <p className="gradient-text text-2xl font-extrabold">Naukari360</p>
      </Section>

      <Section title="Badges">
        <div className="space-y-3">
          <div className="flex flex-wrap gap-2">
            {TONES.map((tone) => (
              <Badge key={tone} tone={tone}>
                {tone}
              </Badge>
            ))}
          </div>
          <div className="flex flex-wrap gap-2">
            {TONES.map((tone) => (
              <Badge key={tone} tone={tone} variant="solid">
                {tone}
              </Badge>
            ))}
          </div>
        </div>
      </Section>

      <Section title="Buttons">
        <div className="flex flex-wrap items-center gap-3">
          <Button>Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="subtle">Subtle</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="danger">Danger</Button>
          <Button variant="link">Link</Button>
          <Button disabled>Disabled</Button>
          <Button size="sm">Small</Button>
          <Button size="lg">Large</Button>
        </div>
      </Section>

      <Section title="Alerts">
        <div className="space-y-2">
          <Alert tone="success">Your message has been submitted.</Alert>
          <Alert tone="warning">The last date to apply is in 2 days.</Alert>
          <Alert tone="danger">Something went wrong. Please try again.</Alert>
          <Alert tone="info">Results are expected next week.</Alert>
        </div>
      </Section>

      <Section title="Section header & icon tiles">
        <SectionHeader
          tone="danger"
          icon={<AlertTriangle className="h-4 w-4" />}
          title={<h3 className="text-lg font-bold text-foreground">Closing Soon</h3>}
          subtitle={<p className="text-xs text-muted-foreground">Apply before deadline expires</p>}
        />
        <div className="flex flex-wrap gap-3">
          <IconTile tone="primary" ring>
            <Briefcase className="h-5 w-5" />
          </IconTile>
          <IconTile tone="success" ring>
            <CheckCircle2 className="h-5 w-5" />
          </IconTile>
          <IconTile tone="info" ring>
            <Info className="h-5 w-5" />
          </IconTile>
          <IconTile tone="highlight" ring>
            <Sparkles className="h-5 w-5" />
          </IconTile>
          <IconTile tone="warning" ring>
            <Bell className="h-5 w-5" />
          </IconTile>
        </div>
      </Section>

      <Section title="Form fields">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="sg-name">Name</Label>
            <Input id="sg-name" placeholder="Your name" />
          </div>
          <div>
            <Label htmlFor="sg-type">Type</Label>
            <Select id="sg-type" defaultValue="general">
              <option value="general">General Inquiry</option>
            </Select>
          </div>
          <div className="sm:col-span-2">
            <Label htmlFor="sg-message">Message</Label>
            <Textarea id="sg-message" rows={3} placeholder="Write something…" />
          </div>
        </div>
      </Section>
    </div>
  );
}
