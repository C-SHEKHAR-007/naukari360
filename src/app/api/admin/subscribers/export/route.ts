import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const subscribers = await prisma.emailSubscriber.findMany({
    orderBy: { subscribedAt: "desc" },
  });

  const csv = [
    "Email,Name,Source,Status,Subscribed At",
    ...subscribers.map(
      (s) =>
        `"${s.email}","${s.name || ""}","${s.source}","${s.isActive ? "active" : "unsubscribed"}","${s.subscribedAt.toISOString()}"`
    ),
  ].join("\n");

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": `attachment; filename="subscribers-${new Date().toISOString().split("T")[0]}.csv"`,
    },
  });
}
