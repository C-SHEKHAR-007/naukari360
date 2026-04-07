import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendContactNotification } from "@/lib/email";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, type, subject, message } = body;

    // Validation
    if (!name || !email || !subject || !message) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    if (typeof name !== "string" || name.length > 200) {
      return NextResponse.json({ error: "Invalid name" }, { status: 400 });
    }

    if (typeof email !== "string" || !email.includes("@") || email.length > 320) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }

    if (typeof message !== "string" || message.length > 5000) {
      return NextResponse.json({ error: "Message too long" }, { status: 400 });
    }

    const validTypes = ["general", "sponsored_post", "advertisement"];
    const contactType = validTypes.includes(type) ? type : "general";

    // Save to database
    await prisma.contactSubmission.create({
      data: {
        name: name.slice(0, 200),
        email: email.slice(0, 320),
        type: contactType,
        subject: subject.slice(0, 500),
        message: message.slice(0, 5000),
      },
    });

    // Send email notification (fire and forget)
    sendContactNotification({ name, email, type: contactType, subject, message }).catch(() => {});

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
