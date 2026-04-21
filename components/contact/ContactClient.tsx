"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Input } from "@/components/ui/Input";

export function ContactClient() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [sent, setSent] = useState(false);

  const errors = useMemo(() => {
    if (!submitted) return { name: "", email: "", message: "" };
    const nameErr = name.trim().length >= 2 ? "" : "Please enter your name.";
    const emailErr =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()) ? "" : "Please enter a valid email.";
    const msgErr = message.trim().length >= 10 ? "" : "Message must be at least 10 characters.";
    return { name: nameErr, email: emailErr, message: msgErr };
  }, [email, message, name, submitted]);

  const ok =
    name.trim().length >= 2 &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()) &&
    message.trim().length >= 10;

  return (
    <div className="py-12">
      <Container>
        <div className="mx-auto max-w-2xl">
          <h1 className="text-3xl font-semibold tracking-tight">Contact</h1>
          <p className="mt-2 text-zinc-600">
            Send a message. This is a UI-only form; submissions are not sent anywhere.
          </p>

          <div className="mt-8 rounded-2xl border border-zinc-200 bg-white p-6 sm:p-8">
            <form
              className="space-y-4"
              onSubmit={(e) => {
                e.preventDefault();
                setSubmitted(true);
                if (!ok) return;
                // mock submit
                setSent(true);
                setName("");
                setEmail("");
                setMessage("");
              }}
            >
              {sent ? (
                <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-800">
                  Message saved locally (mock). Thanks for reaching out!
                </div>
              ) : null}
              <Input
                label="Name"
                name="name"
                value={name}
                onChange={(e) => {
                  setSent(false);
                  setName(e.target.value);
                }}
                error={errors.name}
              />
              <Input
                label="Email"
                name="email"
                type="email"
                value={email}
                onChange={(e) => {
                  setSent(false);
                  setEmail(e.target.value);
                }}
                error={errors.email}
              />

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-zinc-900" htmlFor="message">
                  Message
                </label>
                <textarea
                  id="message"
                  className="min-h-32 w-full resize-y rounded-xl border border-zinc-200 bg-white px-3 py-2.5 text-sm text-zinc-900 placeholder:text-zinc-400 shadow-sm outline-none transition focus:border-zinc-300 focus:ring-2 focus:ring-zinc-900/10"
                  placeholder="How can we help?"
                  value={message}
                  onChange={(e) => {
                    setSent(false);
                    setMessage(e.target.value);
                  }}
                />
                {errors.message ? <p className="text-sm text-red-600">{errors.message}</p> : null}
              </div>

              <Button type="submit" className="w-full">
                Send message
              </Button>
            </form>
          </div>
        </div>
      </Container>
    </div>
  );
}
