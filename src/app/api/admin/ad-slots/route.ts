import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

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
