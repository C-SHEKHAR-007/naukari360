import { NextRequest, NextResponse } from "next/server";
import { requireSuperAdmin } from "@/lib/auth-utils";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  const authResult = await requireSuperAdmin();
  if (!authResult.authorized) return authResult.response;

  try {
    const { name, slotKey, adCode, device, notes } = await request.json();
    if (!name || !slotKey)
      return NextResponse.json({ error: "Name and slot key required" }, { status: 400 });

    const slot = await prisma.adSlot.create({
      data: {
        name,
        slotKey,
        adCode: adCode || null,
        device: device || "all",
        notes: notes || null,
      },
    });
    return NextResponse.json(slot);
  } catch {
    return NextResponse.json({ error: "Failed to create ad slot" }, { status: 500 });
  }
}
