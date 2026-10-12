import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getPersonalizedPosts } from "@/lib/db";

export async function GET() {
  const session = await auth();
  const qual = session?.user?.qualification || null;
  const userState = session?.user?.state || null;

  if (!session?.user || (!qual && !userState)) {
    return NextResponse.json({ posts: [] });
  }

  const posts = await getPersonalizedPosts(qual, userState, 6);
  return NextResponse.json({ posts }, { headers: { "Cache-Control": "private, no-store" } });
}
