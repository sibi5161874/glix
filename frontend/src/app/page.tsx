"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  LogIn,
  Building,
  ListChecks,
  Calendar,
  Files,
  FileText,
  ShieldCheck,
  Cloud,
  Link2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { LandingNavbar } from "@/components/landing/landing-navbar";
import { DashboardMockup } from "@/components/landing/dashboard-mockup";
import { PricingCalculator } from "@/components/landing/pricing-calculator";
import { FaqSection } from "@/components/landing/faq-section";
import { ContactSection } from "@/components/landing/contact-section";

export default function HomePage(): React.JSX.Element {
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  useEffect(() => {
    const saved = localStorage.getItem("landing-theme") as "dark" | "light" | null;
    if (saved) {
      setTheme(saved);
      document.documentElement.classList.toggle("dark", saved === "dark");
    }
  }, []);

  const toggleTheme = (): void => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    localStorage.setItem("landing-theme", next);
    document.documentElement.classList.toggle("dark", next === "dark");
  };

  return (
    <div
      className={`relative min-h-screen overflow-x-hidden text-slate-100 transition-colors selection:bg-[#f76707] selection:text-white ${theme === "dark" ? "bg-[#030712]" : "bg-slate-50 text-slate-800"}`}
    >
      {/* Ambient Glow Backdrop Blobs */}
      <div className="pointer-events-none absolute -right-24 -top-24 h-[55vw] w-[55vw] max-w-[650px] rounded-full bg-indigo-500/10 blur-[130px]" />
      <div className="bg-[#f76707]/12 pointer-events-none absolute -left-28 top-[40vh] h-[50vw] w-[50vw] max-w-[600px] rounded-full blur-[140px]" />
      <div className="pointer-events-none absolute bottom-12 right-0 h-[45vw] w-[45vw] max-w-[550px] rounded-full bg-teal-500/10 blur-[130px]" />

      {/* Top Navbar */}
      <LandingNavbar theme={theme} onToggleTheme={toggleTheme} />

      {/* Hero Section */}
      <section className="relative z-10 px-6 pb-16 pt-24 text-center">
        <div className="mx-auto max-w-5xl">
          <div className="mb-6 inline-flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 px-3.5 py-1 text-xs font-semibold text-amber-400 shadow-sm">
            SaaS Organization Management Portal
          </div>

          <h1 className="text-4xl font-extrabold leading-[1.12] tracking-tight text-white md:text-6xl lg:text-7xl">
            Centralized HR Operations &amp;{" "}
            <span className="bg-gradient-to-r from-white via-[#f76707] to-amber-400 bg-clip-text text-transparent">
              Document Automation
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-3xl text-base font-normal leading-relaxed text-slate-400 md:text-xl">
            Manage onboarding checklists, leave applications, automated document expiries, payroll
            batches, and secure cloud storage in one high-performance dashboard.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link href="/login">
              <Button
                size="lg"
                className="gap-2 bg-[#f76707] px-8 py-6 text-base font-bold text-white shadow-xl shadow-orange-500/25 hover:bg-[#e05d06]"
              >
                <LogIn className="h-5 w-5" /> Get Started Now
              </Button>
            </Link>
            <Link href="/register">
              <Button
                size="lg"
                variant="outline"
                className="gap-2 border-white/20 px-8 py-6 text-base font-bold text-white hover:bg-white/10"
              >
                <Building className="h-5 w-5" /> Register Org
              </Button>
            </Link>
          </div>

          {/* Interactive Live Dashboard Mockup */}
          <div className="mt-14 flex justify-center">
            <DashboardMockup />
          </div>
        </div>
      </section>

      {/* Core Features Section */}
      <section className="relative border-t border-white/5 bg-slate-950/20 py-20" id="features">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-16 text-center">
            <h2 className="text-3xl font-extrabold tracking-tight text-white md:text-5xl">
              Platform Capabilities
            </h2>
            <p className="mt-3 text-base text-slate-400 md:text-lg">
              Enterprise-grade modules designed to automate daily operations
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-slate-900/50 p-8 backdrop-blur-xl transition-all hover:-translate-y-1 hover:border-[#f76707]/30">
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500/20 text-amber-400">
                <ListChecks className="h-6 w-6" />
              </div>
              <h3 className="mb-2 text-lg font-bold text-white">Onboarding Checklists</h3>
              <p className="text-xs leading-relaxed text-slate-400 md:text-sm">
                Define reusable onboarding checklist templates, assign tasks, and track step-by-step
                progress for new hires.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-slate-900/50 p-8 backdrop-blur-xl transition-all hover:-translate-y-1 hover:border-[#f76707]/30">
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-sky-500/20 text-sky-400">
                <Calendar className="h-6 w-6" />
              </div>
              <h3 className="mb-2 text-lg font-bold text-white">Leave &amp; Vacation Planner</h3>
              <p className="text-xs leading-relaxed text-slate-400 md:text-sm">
                Apply for leaves, track dynamic entitlement balances, view team calendars, and
                process approvals with one click.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-slate-900/50 p-8 backdrop-blur-xl transition-all hover:-translate-y-1 hover:border-[#f76707]/30">
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-400">
                <Files className="h-6 w-6" />
              </div>
              <h3 className="mb-2 text-lg font-bold text-white">Document Automation</h3>
              <p className="text-xs leading-relaxed text-slate-400 md:text-sm">
                Securely upload documents, receive email alerts before critical expiries, and verify
                validity status instantly.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-slate-900/50 p-8 backdrop-blur-xl transition-all hover:-translate-y-1 hover:border-[#f76707]/30">
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-500/20 text-indigo-400">
                <FileText className="h-6 w-6" />
              </div>
              <h3 className="mb-2 text-lg font-bold text-white">Official Letters Builder</h3>
              <p className="text-xs leading-relaxed text-slate-400 md:text-sm">
                Generate professional HR letters, salary certificates, and official documents
                dynamically for employees.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-slate-900/50 p-8 backdrop-blur-xl transition-all hover:-translate-y-1 hover:border-[#f76707]/30">
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-rose-500/20 text-rose-400">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <h3 className="mb-2 text-lg font-bold text-white">Multi-Tenant Context</h3>
              <p className="text-xs leading-relaxed text-slate-400 md:text-sm">
                Isolate organization datasets completely using Postgres RLS, enforcing strict tenant
                access controls and rules.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-slate-900/50 p-8 backdrop-blur-xl transition-all hover:-translate-y-1 hover:border-[#f76707]/30">
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-500/20 text-cyan-400">
                <Cloud className="h-6 w-6" />
              </div>
              <h3 className="mb-2 text-lg font-bold text-white">Hybrid Storage Integration</h3>
              <p className="text-xs leading-relaxed text-slate-400 md:text-sm">
                Store files locally on VPS or integrate AWS S3 buckets dynamically with signed-URL
                security.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section with Slider Calculator */}
      <PricingCalculator />

      {/* FAQs Section */}
      <FaqSection />

      {/* Contact Section */}
      <ContactSection />

      {/* Footer */}
      <footer className="border-t border-white/10 bg-[#020617] px-6 py-12 text-center text-xs text-slate-400">
        <div className="mx-auto max-w-4xl space-y-4">
          <div className="flex items-center justify-center gap-2 text-lg font-bold text-white">
            <span className="text-[#f76707]">
              <Link2 className="h-5 w-5" />
            </span>
            <span>Glix Connect</span>
          </div>
          <p className="mx-auto max-w-md text-xs text-slate-400">
            The dynamic SaaS framework powering HR control and operations automation.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2 text-slate-400">
            <Link href="/privacy-policy" className="transition-colors hover:text-[#f76707]">
              Privacy Policy
            </Link>
            <span className="text-slate-600">|</span>
            <Link href="/terms-conditions" className="transition-colors hover:text-[#f76707]">
              Terms &amp; Conditions
            </Link>
            <span className="text-slate-600">|</span>
            <Link href="/refund-policy" className="transition-colors hover:text-[#f76707]">
              Refund Policy
            </Link>
          </div>
          <div className="pt-4 text-[11px] text-slate-500">
            &copy; {new Date().getFullYear()} Glix Connect HR Portal. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
