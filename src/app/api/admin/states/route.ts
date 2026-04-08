import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { name, nameHi, slug } = await request.json();
    if (!name || !slug)
      return NextResponse.json({ error: "Name and slug required" }, { status: 400 });

    const state = await prisma.state.create({
      data: { name, nameHi: nameHi || null, slug },
    });
    return NextResponse.json(state);
  } catch {
    return NextResponse.json({ error: "Failed to create state" }, { status: 500 });
  }
}
