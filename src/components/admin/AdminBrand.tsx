import { cn } from "@/lib/utils";

/** App mark used by the admin login and sidebar */
export function AdminLogo({ className }: { className?: string }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/favicon.svg"
      alt=""
      className={cn("h-8 w-8 shrink-0 rounded-lg shadow-lg shadow-brand/25", className)}
    />
  );
}

export function AdminWordmark({ className }: { className?: string }) {
  return (
    <span className={cn("text-base font-bold tracking-tight text-foreground", className)}>
      Naukari<span className="text-brand">360</span>
    </span>
  );
}

export function AdminBrand({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      <AdminLogo />
      <AdminWordmark />
    </div>
  );
}
