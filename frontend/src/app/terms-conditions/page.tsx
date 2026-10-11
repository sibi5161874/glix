import Link from "next/link";
import { ArrowLeft, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function TermsConditionsPage(): React.JSX.Element {
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
            <FileText className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold text-white">Terms & Conditions</h1>
            <p className="mt-1 text-xs text-slate-400">Effective Date: October 2026</p>
          </div>
        </div>

        <div className="mt-8 space-y-6 divide-y divide-slate-800/60 text-sm leading-relaxed text-slate-300">
          <section className="pt-4">
            <h2 className="mb-2 text-lg font-semibold text-white">1. Subscription Agreement</h2>
            <p>
              By accessing Glix Connect HR Portal, your organization agrees to these Terms of
              Service. Your subscription grants a non-exclusive license to use the HR platform in
              accordance with your selected tier limits.
            </p>
          </section>

          <section className="pt-6">
            <h2 className="mb-2 text-lg font-semibold text-white">
              2. Usage & Employee Seat Quotas
            </h2>
            <p>
              Each subscription plan allows up to the designated active employee count and document
              storage volume. Exceeding seat quotas requires an upgrade to a higher tier plan.
            </p>
          </section>

          <section className="pt-6">
            <h2 className="mb-2 text-lg font-semibold text-white">3. Service Level & Uptime</h2>
            <p>
              Glix Connect commits to a 99.9% application availability target, backed by automated
              backups, redundant hosting infrastructure, and proactive 24/7 telemetry monitoring.
            </p>
          </section>

          <section className="pt-6">
            <h2 className="mb-2 text-lg font-semibold text-white">4. Support & Escalations</h2>
            <p>
              Support tickets are triaged according to severity. Growth and Enterprise plans receive
              priority handling and dedicated escalation channels.
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}
