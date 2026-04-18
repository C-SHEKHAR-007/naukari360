import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const configs = await prisma.interstitialPage.findMany({
    orderBy: { title: "asc" },
  });
  return NextResponse.json(configs);
}

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { title, adSlotKey, delaySeconds, isActive } = await request.json();
    if (!title || !adSlotKey) {
      return NextResponse.json({ error: "Title and ad slot key are required" }, { status: 400 });
    }

    const config = await prisma.interstitialPage.create({
      data: {
        title,
        adSlotKey,
        delaySeconds: delaySeconds || 5,
        isActive: isActive ?? true,
      },
    });
    return NextResponse.json(config);
  } catch (err: unknown) {
    console.error("Create interstitial error:", err);
    return NextResponse.json({ error: "Failed to create config" }, { status: 500 });
  }
}
