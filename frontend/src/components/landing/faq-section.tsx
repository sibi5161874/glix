"use client";

import React, { useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";

interface FAQItem {
  question: string;
  answer: string;
}

const FAQS: FAQItem[] = [
  {
    question: "How does Glix Connect isolate our tenant data?",
    answer:
      "Tenant data isolation is enforced at the database kernel layer via PostgreSQL Row-Level Security (RLS). Every query automatically runs under session-scoped organization checks (org_id = current_org_id()), preventing data leakage across clients.",
  },
  {
    question: "How do automated document expiry alerts function?",
    answer:
      "You can configure automated alarms for passports, visas, Emirates IDs, and commercial trade licenses. The system dispatches automated notifications at 90, 60, and 30-day thresholds via email and in-app action badges.",
  },
  {
    question: "Can we import our existing employee roster from Excel?",
    answer:
      "Yes. Our bulk import engine lets you upload standard XLSX and CSV spreadsheets with automatic field validation, row-by-row error reporting, and duplicate detection.",
  },
  {
    question: "Can we upgrade or downgrade subscription tiers at any time?",
    answer:
      "Yes. You can switch plans instantly from the Billing settings tab. Upgrades activate higher seat counts immediately, while proration is applied automatically to your invoice.",
  },
];

export function FaqSection(): React.JSX.Element {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="relative border-t border-white/5 bg-slate-950/20 py-20" id="faq">
      <div className="mx-auto max-w-4xl px-6">
        <div className="mb-12 text-center">
          <div className="mb-3 inline-flex items-center gap-1.5 rounded-full border border-[#f76707]/20 bg-[#f76707]/10 px-3 py-1 text-xs font-semibold text-[#f76707]">
            <HelpCircle className="h-3.5 w-3.5" /> Frequently Asked Questions
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight text-white md:text-5xl">
            Got Questions? We Have Answers.
          </h2>
          <p className="mt-2 text-sm text-slate-400 md:text-base">
            Everything you need to know about security, onboarding, and subscription plans.
          </p>
        </div>

        <div className="space-y-3">
          {FAQS.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="overflow-hidden rounded-xl border border-white/10 bg-slate-900/50 backdrop-blur-xl transition-colors hover:border-white/20"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="flex w-full items-center justify-between p-5 text-left text-sm font-semibold text-white focus:outline-none md:text-base"
                >
                  <span className={isOpen ? "text-[#f76707]" : ""}>{faq.question}</span>
                  <ChevronDown
                    className={`ml-4 h-4 w-4 shrink-0 text-slate-400 transition-transform ${
                      isOpen ? "rotate-180 text-[#f76707]" : ""
                    }`}
                  />
                </button>
                {isOpen ? (
                  <div className="border-t border-white/5 px-5 pb-5 pt-3 text-xs leading-relaxed text-slate-300 md:text-sm">
                    {faq.answer}
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
