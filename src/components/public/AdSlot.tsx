import { getAdSlot } from "@/lib/db";

interface AdSlotProps {
  slotKey: string;
  className?: string;
}

export default async function AdSlot({ slotKey, className = "" }: AdSlotProps) {
  const slot = await getAdSlot(slotKey);

  if (!slot || !slot.isActive || !slot.adCode) return null;

  // Check device targeting
  // Note: Server components can't detect device - CSS handles responsive show/hide

  return (
    <div
      className={`ad-slot flex items-center justify-center ${className}`}
      data-slot={slotKey}
      dangerouslySetInnerHTML={{ __html: slot.adCode }}
    />
  );
}
