import { NextRequest, NextResponse } from "next/server";
import { revalidatePath as nextRevalidatePath } from "next/cache";

export async function POST(request: NextRequest) {
  let body: { secret?: string; path?: string };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { secret, path } = body;

  if (!secret || secret !== process.env.REVALIDATION_SECRET) {
    return NextResponse.json({ error: "Invalid secret" }, { status: 401 });
  }

  if (!path || typeof path !== "string") {
    return NextResponse.json({ error: "Missing path parameter" }, { status: 400 });
  }

  try {
    nextRevalidatePath(path);
    return NextResponse.json({ revalidated: true, path, timestamp: Date.now() });
  } catch {
    return NextResponse.json({ error: "Revalidation failed" }, { status: 500 });
  }
}
