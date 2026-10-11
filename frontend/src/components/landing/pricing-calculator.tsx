"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Check, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export function PricingCalculator(): React.JSX.Element {
  const [isAnnual, setIsAnnual] = useState(false);
  const [seats, setSeats] = useState(25);

  const getRecommendedTier = (count: number) => {
    if (count <= 25) {
      return {
        name: "Starter Plan",
        price: "0 AED",
        slug: "free",
        note: "Free forever for small teams",
      };
    }
    if (count <= 250) {
      const p = isAnnual ? 239 : 299;
      return {
        name: "Growth Plan",
        price: `${p} AED / month`,
        slug: "pro",
        note: isAnnual ? "Billed annually (20% off)" : "Billed monthly",
      };
    }
    return {
      name: "Enterprise Custom",
      price: "Custom Quote",
      slug: "enterprise",
      note: "Dedicated infrastructure & SLA",
    };
  };

  const currentRec = getRecommendedTier(seats);

  return (
    <section className="relative border-t border-white/5 bg-slate-950/40 py-20" id="pricing">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-extrabold tracking-tight text-white md:text-5xl">
            Flexible Pricing Plans
          </h2>
          <p className="mt-3 text-base text-slate-400 md:text-lg">
            Scale employee limits and storage integrations seamlessly as your business expands.
          </p>

          {/* Billing Cycle Switch */}
          <div className="mt-8 flex items-center justify-center gap-3">
            <span
              className={`text-sm font-semibold transition-colors ${!isAnnual ? "text-white" : "text-slate-400"}`}
            >
              Monthly Billing
            </span>
            <button
              onClick={() => setIsAnnual(!isAnnual)}
              className="relative h-7 w-14 rounded-full border border-white/10 bg-slate-800 p-1 transition-colors focus:outline-none"
              aria-label="Toggle annual billing discount"
            >
              <div
                className={`h-5 w-5 rounded-full bg-[#f76707] shadow-md transition-transform ${
                  isAnnual ? "translate-x-7" : "translate-x-0"
                }`}
              />
            </button>
            <span
              className={`flex items-center gap-1.5 text-sm font-semibold transition-colors ${isAnnual ? "text-white" : "text-slate-400"}`}
            >
              Annual Billing
              <span className="rounded-full border border-emerald-500/30 bg-emerald-500/20 px-2 py-0.5 text-[10px] font-bold text-emerald-400">
                Save 20%
              </span>
            </span>
          </div>
        </div>

        {/* Interactive Slider Calculator Card */}
        <div className="mx-auto mb-14 max-w-3xl rounded-2xl border border-white/10 bg-slate-900/60 p-6 shadow-2xl backdrop-blur-xl md:p-8">
          <div className="mb-6 text-center">
            <h3 className="text-lg font-bold text-white md:text-xl">Estimate Your Pricing</h3>
            <p className="mt-1 text-xs text-slate-400">
              Adjust the slider to your company size to discover your recommended plan.
            </p>
          </div>

          <div className="px-2">
            <input
              type="range"
              min="1"
              max="500"
              value={seats}
              onChange={(e) => setSeats(parseInt(e.target.value, 10))}
              className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-slate-800 accent-[#f76707]"
            />
            <div className="mt-2 flex justify-between text-xs font-medium text-slate-500">
              <span>1 Employee</span>
              <span>250 Employees</span>
              <span>500+ Enterprise</span>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 items-center gap-4 border-t border-white/10 pt-6 sm:grid-cols-2">
            <div>
              <span className="block text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                Required Seats
              </span>
              <div className="mt-0.5 text-2xl font-bold text-white">
                <span className="text-[#f76707]">{seats}</span> Active Employees
              </div>
            </div>
            <div className="sm:text-right">
              <span className="block text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                Recommended Plan
              </span>
              <div className="text-xl font-bold text-white">{currentRec.name}</div>
              <div className="mt-0.5 text-sm font-semibold text-[#f76707]">{currentRec.price}</div>
            </div>
          </div>
        </div>

        {/* Plan Cards Grid */}
        <div className="grid grid-cols-1 items-stretch gap-8 md:grid-cols-3">
          {/* Free Tier */}
          <div
            className={`flex flex-col justify-between rounded-2xl border p-8 backdrop-blur-xl transition-all ${
              currentRec.slug === "free"
                ? "scale-102 border-[#f76707] bg-slate-900/80 shadow-xl shadow-orange-500/10"
                : "border-white/10 bg-slate-900/50"
            }`}
          >
            <div>
              <h4 className="text-xl font-bold text-white">Free Version</h4>
              <p className="mt-1 text-xs text-slate-400">For small startups and trials</p>
              <div className="my-6">
                <span className="text-4xl font-extrabold text-white">0</span>
                <span className="ml-1.5 font-mono text-xs text-slate-400">AED / month</span>
                <div className="mt-1 text-[11px] text-slate-500">Free forever</div>
              </div>
              <ul className="space-y-3 border-t border-white/10 pt-5 text-xs text-slate-300">
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 shrink-0 text-[#f76707]" />
                  <span>Up to 25 active employees</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 shrink-0 text-[#f76707]" />
                  <span>Basic HR directory & records</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 shrink-0 text-[#f76707]" />
                  <span>500 MB document vault</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 shrink-0 text-[#f76707]" />
                  <span>Self-service leave requests</span>
                </li>
              </ul>
            </div>
            <div className="mt-8">
              <Link href="/register?plan=free" className="block w-full">
                <Button
                  variant="outline"
                  className="w-full border-white/20 text-white hover:bg-white/10"
                >
                  Select Free Plan
                </Button>
              </Link>
            </div>
          </div>

          {/* Growth Tier (Popular) */}
          <div
            className={`relative flex flex-col justify-between rounded-2xl border p-8 backdrop-blur-xl transition-all ${
              currentRec.slug === "pro"
                ? "scale-105 border-[#f76707] bg-slate-900/90 shadow-2xl shadow-orange-500/20"
                : "border-[#f76707]/60 bg-slate-900/60 shadow-lg shadow-orange-500/10"
            }`}
          >
            <div className="absolute -top-3.5 left-1/2 flex -translate-x-1/2 items-center gap-1 rounded-full bg-[#f76707] px-3.5 py-0.5 text-[11px] font-bold text-white shadow-md">
              <Sparkles className="h-3 w-3" /> Most Popular
            </div>
            <div>
              <h4 className="text-xl font-bold text-white">Growth Plan</h4>
              <p className="mt-1 text-xs text-slate-400">Full-featured automation suite</p>
              <div className="my-6">
                <span className="text-4xl font-extrabold text-white">{isAnnual ? 239 : 299}</span>
                <span className="ml-1.5 font-mono text-xs text-slate-400">AED / month</span>
                <div className="mt-1 text-[11px] text-slate-400">
                  {isAnnual ? "Billed annually" : "Billed monthly"}
                </div>
              </div>
              <ul className="space-y-3 border-t border-white/10 pt-5 text-xs text-slate-300">
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 shrink-0 text-[#f76707]" />
                  <span className="font-semibold text-white">Up to 250 active employees</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 shrink-0 text-[#f76707]" />
                  <span>Bulk Excel/CSV roster import</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 shrink-0 text-[#f76707]" />
                  <span>10 GB document cloud storage</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 shrink-0 text-[#f76707]" />
                  <span>Custom RBAC roles & permissions</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 shrink-0 text-[#f76707]" />
                  <span>WhatsApp & email expiry alarms</span>
                </li>
              </ul>
            </div>
            <div className="mt-8">
              <Link href="/register?plan=pro" className="block w-full">
                <Button className="w-full bg-[#f76707] font-semibold text-white hover:bg-[#e05d06]">
                  Get Growth Plan
                </Button>
              </Link>
            </div>
          </div>

          {/* Enterprise Tier */}
          <div
            className={`flex flex-col justify-between rounded-2xl border p-8 backdrop-blur-xl transition-all ${
              currentRec.slug === "enterprise"
                ? "scale-102 border-[#f76707] bg-slate-900/80 shadow-xl shadow-orange-500/10"
                : "border-white/10 bg-slate-900/50"
            }`}
          >
            <div>
              <h4 className="text-xl font-bold text-white">Enterprise</h4>
              <p className="mt-1 text-xs text-slate-400">For multi-entity holding groups</p>
              <div className="my-6">
                <span className="text-3xl font-extrabold text-white">Custom</span>
                <span className="ml-1.5 font-mono text-xs text-slate-400">Quote</span>
                <div className="mt-1 text-[11px] text-slate-500">Tailored enterprise terms</div>
              </div>
              <ul className="space-y-3 border-t border-white/10 pt-5 text-xs text-slate-300">
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 shrink-0 text-[#f76707]" />
                  <span>Unlimited active employees</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 shrink-0 text-[#f76707]" />
                  <span>Unlimited secure vault storage</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 shrink-0 text-[#f76707]" />
                  <span>Dedicated SSO & API gateway</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 shrink-0 text-[#f76707]" />
                  <span>Custom branding & white-label domain</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 shrink-0 text-[#f76707]" />
                  <span>24/7 dedicated enterprise SLA</span>
                </li>
              </ul>
            </div>
            <div className="mt-8">
              <a href="#contact" className="block w-full">
                <Button
                  variant="outline"
                  className="w-full border-white/20 text-white hover:bg-white/10"
                >
                  Contact Sales
                </Button>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
