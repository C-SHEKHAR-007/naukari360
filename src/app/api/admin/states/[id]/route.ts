import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  try {
    const { name, nameHi, slug } = await request.json();
    if (!name || !slug)
      return NextResponse.json({ error: "Name and slug required" }, { status: 400 });

    const state = await prisma.state.update({
      where: { id },
      data: { name, nameHi: nameHi || null, slug },
    });
    return NextResponse.json(state);
  } catch {
    return NextResponse.json({ error: "Failed to update state" }, { status: 500 });
  }
}

export async function DELETE(_request: NextRequest, { params }: RouteParams) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  try {
    await prisma.state.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to delete state" }, { status: 500 });
  }
}
