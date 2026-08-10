import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendContactNotification } from "@/lib/email";
import { rateLimit } from "@/lib/rate-limit";

import { z } from "zod";

const contactSchema = z.object({
  name: z.string().min(1, "Name is required").max(200, "Name is too long"),
  email: z.string().email("Invalid email").max(320, "Email is too long"),
  subject: z.string().min(1, "Subject is required").max(500, "Subject is too long"),
  message: z.string().min(1, "Message is required").max(5000, "Message is too long"),
  type: z.enum(["general", "sponsored_post", "advertisement"]).catch("general"),
});

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get("x-forwarded-for") || "unknown";
    const { success } = rateLimit(`contact:${ip}`, { limit: 5, windowMs: 60_000 });
    if (!success) {
      return NextResponse.json({ error: "Too many requests" }, { status: 429 });
    }

    const body = await request.json();
    const parsed = contactSchema.safeParse(body);
    
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0]?.message || "Invalid input" }, { status: 400 });
    }
    
    const { name, email, type: contactType, subject, message } = parsed.data;

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

    // Send email notification
    const resendResponse = await sendContactNotification({ name, email, type: contactType, subject, message });
    if (resendResponse.error) {
      console.error("Resend API Error:", resendResponse.error);
    } else {
      console.log("Email sent successfully:", resendResponse.data);
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
