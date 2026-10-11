import Link from "next/link";
import { ArrowLeft, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function PrivacyPolicyPage(): React.JSX.Element {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-200">
      <header className="sticky top-0 z-50 border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-2 text-lg font-bold text-white">
            <span className="text-[#f76707]">✦</span> Glix Connect
          </Link>
          <Link href="/">
            <Button variant="ghost" size="sm" className="gap-2 text-slate-300">
              <ArrowLeft className="h-4 w-4" /> Back to Home
            </Button>
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-6 py-12">
        <div className="mb-4 flex items-center gap-3">
          <div className="rounded-xl bg-orange-500/10 p-2.5 text-[#f76707]">
            <Shield className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold text-white">Privacy Policy</h1>
            <p className="mt-1 text-xs text-slate-400">Last Updated: October 2026</p>
          </div>
        </div>

        <div className="mt-8 space-y-6 divide-y divide-slate-800/60 text-sm leading-relaxed text-slate-300">
          <section className="pt-4">
            <h2 className="mb-2 text-lg font-semibold text-white">1. Information We Collect</h2>
            <p>
              Glix Connect operates as a multi-tenant B2B enterprise software provider. We collect
              organizational details, employee records, document metadata, and access logs provided
              directly by authorized tenant administrators for workforce management.
            </p>
          </section>

          <section className="pt-6">
            <h2 className="mb-2 text-lg font-semibold text-white">
              2. Multi-Tenant Data Isolation
            </h2>
            <p>
              Your organization&apos;s data is isolated using PostgreSQL Row-Level Security (RLS).
              Each tenant operates within a strictly scoped partition. No other organization can
              query, view, or modify your records.
            </p>
          </section>

          <section className="pt-6">
            <h2 className="mb-2 text-lg font-semibold text-white">
              3. Document Security & Storage
            </h2>
            <p>
              Employee documents such as passports, labor cards, and contracts are encrypted at rest
              and in transit. Temporary access URLs are digitally signed and expire automatically.
            </p>
          </section>

          <section className="pt-6">
            <h2 className="mb-2 text-lg font-semibold text-white">4. Contact & Data Requests</h2>
            <p>
              For privacy inquiries, audit reports, or account data deletion requests, contact our
              compliance team at <span className="text-[#f76707]">privacy@glix.ae</span>.
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}
