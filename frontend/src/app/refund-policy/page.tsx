import Link from "next/link";
import { ArrowLeft, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function RefundPolicyPage(): React.JSX.Element {
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
            <RefreshCw className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold text-white">Refund & Billing Policy</h1>
            <p className="mt-1 text-xs text-slate-400">Effective Date: October 2026</p>
          </div>
        </div>

        <div className="mt-8 space-y-6 divide-y divide-slate-800/60 text-sm leading-relaxed text-slate-300">
          <section className="pt-4">
            <h2 className="mb-2 text-lg font-semibold text-white">
              1. Subscription Renewals & Cancellations
            </h2>
            <p>
              Subscriptions renew automatically each billing cycle (monthly or annual). Organization
              administrators may cancel renewal at any time through the billing dashboard without
              penalty.
            </p>
          </section>

          <section className="pt-6">
            <h2 className="mb-2 text-lg font-semibold text-white">2. Refund Window</h2>
            <p>
              We provide a 14-day money-back guarantee for first-time annual subscriptions if our
              platform does not meet your operational expectations. Monthly subscription fees are
              non-refundable once billed.
            </p>
          </section>

          <section className="pt-6">
            <h2 className="mb-2 text-lg font-semibold text-white">3. Downgrades & Prorations</h2>
            <p>
              When upgrading a plan mid-cycle, unused credit is applied toward the new tier.
              Downgrades take effect at the conclusion of the active billing cycle to preserve
              current employee data limits.
            </p>
          </section>

          <section className="pt-6">
            <h2 className="mb-2 text-lg font-semibold text-white">4. Requesting Assistance</h2>
            <p>
              For billing adjustments or invoice inquiries, open a ticket via the tenant support
              portal or reach out to <span className="text-[#f76707]">billing@glix.ae</span>.
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}
