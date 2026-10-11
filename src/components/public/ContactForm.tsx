"use client";

import { useState } from "react";
import { Alert, Input, Label, Select, Textarea } from "@/components/ui";

export default function ContactForm() {
  const [formState, setFormState] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    type: "general",
    subject: "",
    message: "",
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormState("loading");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        setFormState("success");
        setFormData({ name: "", email: "", type: "general", subject: "", message: "" });
      } else {
        setFormState("error");
      }
    } catch {
      setFormState("error");
    }
  }

  if (formState === "success") {
    return (
      <div className="mt-8 rounded-xl border border-success-emphasis/25 bg-success-subtle p-8 text-center shadow-sm">
        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-success-emphasis/10">
          <svg
            className="h-6 w-6 text-success-emphasis"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <p className="text-lg font-semibold text-success-emphasis">Thank you!</p>
        <p className="mt-1 text-sm text-success-emphasis">
          Your message has been submitted. We&apos;ll get back to you soon.
        </p>
        <button
          onClick={() => setFormState("idle")}
          className="mt-4 text-sm font-medium text-primary hover:underline underline-offset-2"
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mt-8 space-y-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="contact-name">Name *</Label>
          <Input
            id="contact-name"
            name="name"
            type="text"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
        </div>
        <div>
          <Label htmlFor="contact-email">Email *</Label>
          <Input
            id="contact-email"
            name="email"
            type="email"
            required
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
        </div>
      </div>

      <div>
        <Label htmlFor="contact-type">Type</Label>
        <Select
          id="contact-type"
          name="type"
          value={formData.type}
          onChange={(e) => setFormData({ ...formData, type: e.target.value })}
        >
          <option value="general">General Inquiry</option>
          <option value="sponsored_post">Sponsored Post</option>
          <option value="advertisement">Advertisement</option>
        </Select>
      </div>

      <div>
        <Label htmlFor="contact-subject">Subject *</Label>
        <Input
          id="contact-subject"
          name="subject"
          type="text"
          required
          value={formData.subject}
          onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
        />
      </div>

      <div>
        <Label htmlFor="contact-message">Message *</Label>
        <Textarea
          id="contact-message"
          name="message"
          required
          rows={5}
          value={formData.message}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
        />
      </div>

      {formState === "error" && (
        <Alert tone="danger">Something went wrong. Please try again.</Alert>
      )}

      <button
        type="submit"
        disabled={formState === "loading"}
        className="rounded-lg bg-primary px-8 py-3 text-sm font-semibold text-primary-foreground shadow-sm transition-all hover:bg-primary-dark hover:shadow-md active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none"
      >
        {formState === "loading" ? "Sending..." : "Send Message"}
      </button>
    </form>
  );
}
