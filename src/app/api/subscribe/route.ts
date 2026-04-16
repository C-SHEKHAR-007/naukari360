import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, name, source } = body;

    if (!email || typeof email !== "string") {
      return Response.json({ error: "Email is required" }, { status: 400 });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return Response.json({ error: "Invalid email format" }, { status: 400 });
    }

    const existing = await prisma.emailSubscriber.findUnique({ where: { email } });
    if (existing) {
      if (!existing.isActive) {
        await prisma.emailSubscriber.update({
          where: { email },
          data: { isActive: true },
        });
        return Response.json({ message: "Re-subscribed successfully" });
      }
      return Response.json({ message: "Already subscribed" });
    }

    await prisma.emailSubscriber.create({
      data: {
        email,
        name: name || null,
        source: source || "popup",
      },
    });

    return Response.json({ message: "Subscribed successfully" }, { status: 201 });
  } catch {
    return Response.json({ error: "Something went wrong" }, { status: 500 });
  }
}
