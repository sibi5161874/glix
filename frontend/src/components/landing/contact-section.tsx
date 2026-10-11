"use client";

import React, { useState } from "react";
import { Send, Loader2, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { submitContactLead } from "@/lib/platform";

export function ContactSection(): React.JSX.Element {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    setErrorMsg("");
    try {
      setSubmitting(true);
      await submitContactLead({
        name,
        email,
        phone: phone || null,
        subject: subject || null,
        message,
      });
      setSubmitted(true);
      setName("");
      setEmail("");
      setPhone("");
      setSubject("");
      setMessage("");
    } catch {
      setErrorMsg("Unable to send inquiry right now. Please try again or email support@glix.ae.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="relative border-t border-white/5 bg-slate-950/40 py-20" id="contact">
      <div className="mx-auto max-w-4xl px-6">
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-extrabold tracking-tight text-white md:text-5xl">
            Get In Touch
          </h2>
          <p className="mt-2 text-sm text-slate-400 md:text-base">
            Have questions about enterprise deployment or custom integrations? Send us a message and
            we&apos;ll reply shortly.
          </p>
        </div>

        <div className="mx-auto max-w-2xl rounded-2xl border border-white/10 bg-slate-900/60 p-6 shadow-2xl backdrop-blur-xl md:p-10">
          {submitted ? (
            <div className="space-y-3 py-12 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-emerald-500/30 bg-emerald-500/20 text-emerald-400">
                <CheckCircle2 className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-white">Message Dispatched!</h3>
              <p className="mx-auto max-w-md text-xs text-slate-300 md:text-sm">
                Thank you for contacting Glix Connect. Our solutions team will review your
                requirements and reach out within 24 hours.
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSubmitted(false)}
                className="mt-4 border-white/20 text-white hover:bg-white/10"
              >
                Send Another Inquiry
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs md:text-sm">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label className="text-slate-300">Your Full Name *</Label>
                  <Input
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. John Doe"
                    className="border-white/10 bg-slate-950/70 text-white placeholder:text-slate-500"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-slate-300">Email Address *</Label>
                  <Input
                    required
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. john@company.com"
                    className="border-white/10 bg-slate-950/70 text-white placeholder:text-slate-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label className="text-slate-300">Phone Number (Optional)</Label>
                  <Input
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="e.g. +971 50 123 4567"
                    className="border-white/10 bg-slate-950/70 text-white placeholder:text-slate-500"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-slate-300">Subject of Inquiry</Label>
                  <Input
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="e.g. Enterprise Migration"
                    className="border-white/10 bg-slate-950/70 text-white placeholder:text-slate-500"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label className="text-slate-300">Detailed Message *</Label>
                <textarea
                  required
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Tell us about your organization headcount, current pain points, or specific questions..."
                  className="w-full rounded-md border border-white/10 bg-slate-950/70 p-3 text-white placeholder:text-slate-500 focus:border-[#f76707] focus:outline-none"
                />
              </div>

              {errorMsg ? (
                <div className="rounded border border-rose-500/20 bg-rose-500/10 p-2.5 text-xs text-rose-400">
                  {errorMsg}
                </div>
              ) : null}

              <div className="pt-2 text-right">
                <Button
                  type="submit"
                  disabled={submitting}
                  className="gap-2 bg-[#f76707] px-6 font-semibold text-white shadow-lg shadow-orange-500/20 hover:bg-[#e05d06]"
                >
                  {submitting ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                  Send Message
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
