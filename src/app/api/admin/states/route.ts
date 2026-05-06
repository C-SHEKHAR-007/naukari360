import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth-utils";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  const authResult = await requireAdmin();
  if (!authResult.authorized) return authResult.response;

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
