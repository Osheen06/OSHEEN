"use client";

import { Loader2, Send } from "lucide-react";
import type { FormEvent } from "react";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { sendContact } from "@/lib/api";

export function ContactForm() {
  const [status, setStatus] = useState("Tell us what you want Osheen to become.");
  const [isSending, setIsSending] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSending(true);
    const form = new FormData(event.currentTarget);

    try {
      const response = await sendContact({
        name: String(form.get("name")),
        email: String(form.get("email")),
        intent: String(form.get("intent")),
        message: String(form.get("message"))
      });
      setStatus(response.message);
      event.currentTarget.reset();
    } catch {
      setStatus("Message captured in demo mode. Start the backend API to submit through Express.");
    } finally {
      setIsSending(false);
    }
  }

  return (
    <form onSubmit={submit} className="soft-panel rounded-[2rem] p-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="grid gap-2 text-sm font-bold text-ink">
          Name
          <input name="name" required className="focus-ring rounded-2xl border border-ink/10 bg-white px-4 py-3" placeholder="Osheen" />
        </label>
        <label className="grid gap-2 text-sm font-bold text-ink">
          Email
          <input name="email" required type="email" className="focus-ring rounded-2xl border border-ink/10 bg-white px-4 py-3" placeholder="you@example.com" />
        </label>
      </div>
      <label className="mt-4 grid gap-2 text-sm font-bold text-ink">
        I am here for
        <select name="intent" className="focus-ring rounded-2xl border border-ink/10 bg-white px-4 py-3">
          <option value="demo">Demo presentation</option>
          <option value="vendor">Boutique partnership</option>
          <option value="investor">Investor conversation</option>
          <option value="student">College innovation programme</option>
          <option value="other">Something else</option>
        </select>
      </label>
      <label className="mt-4 grid gap-2 text-sm font-bold text-ink">
        Message
        <textarea name="message" required rows={6} className="focus-ring resize-none rounded-2xl border border-ink/10 bg-white px-4 py-3" placeholder="I want to see how Osheen could work for..." />
      </label>
      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm font-semibold text-ink/54">{status}</p>
        <Button type="submit" disabled={isSending}>
          {isSending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          Send note
        </Button>
      </div>
    </form>
  );
}
