import React from "react";
import { Users, FileCheck, Shield, Calendar, ArrowRight, Activity } from "lucide-react";

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col justify-between bg-gradient-to-b from-slate-50 to-slate-100 text-slate-900">
      <header className="sticky top-0 z-50 flex items-center justify-between border-b border-slate-200 bg-white/80 px-6 py-4 backdrop-blur">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-lg font-bold text-white shadow-sm">
            G
          </div>
          <span className="text-xl font-bold tracking-tight text-slate-900">Glix Connect</span>
          <span className="ml-2 rounded-full border border-blue-200 bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700">
            Port 4000
          </span>
        </div>
        <div className="flex items-center gap-3">
          <a
            href="http://localhost:6000/health"
            target="_blank"
            rel="noreferrer"
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-all hover:bg-blue-700"
          >
            API Health (:6000)
          </a>
        </div>
      </header>

      <section className="mx-auto flex max-w-6xl flex-col items-center px-6 py-20 text-center">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
          <Activity className="h-3.5 w-3.5" /> Backend API Connected on Port 6000
        </div>
        <h1 className="max-w-4xl text-4xl font-extrabold leading-tight tracking-tight text-slate-900 sm:text-6xl">
          Next-Generation HR Operations &amp; Multi-Tenant Document Automation
        </h1>
        <p className="mt-6 max-w-2xl text-lg text-slate-600 sm:text-xl">
          Automated document expiry tracking, leave entitlement approvals, loan advances, and
          Postgres RLS security in one high-performance portal.
        </p>

        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <a
            href="http://localhost:6000/health"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3.5 text-base font-semibold text-white shadow-md transition-all hover:bg-blue-700 hover:shadow-lg"
          >
            Fastify API Health (:6000) <ArrowRight className="h-4 w-4" />
          </a>
        </div>

        <div className="mt-16 grid w-full grid-cols-1 gap-6 text-left md:grid-cols-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
              <Users className="h-5 w-5" />
            </div>
            <h3 className="font-bold text-slate-900">Employee Master</h3>
            <p className="mt-2 text-sm text-slate-600">
              Comprehensive workforce directory with department hierarchy and batch CSV imports.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
              <Calendar className="h-5 w-5" />
            </div>
            <h3 className="font-bold text-slate-900">Leave Management</h3>
            <p className="mt-2 text-sm text-slate-600">
              One-click leave approvals, automated balance deduction, and interactive holiday
              calendar.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
              <FileCheck className="h-5 w-5" />
            </div>
            <h3 className="font-bold text-slate-900">Document Vault</h3>
            <p className="mt-2 text-sm text-slate-600">
              Secure private S3 storage with automated 30/60/90-day expiry notifications.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-purple-50 text-purple-600">
              <Shield className="h-5 w-5" />
            </div>
            <h3 className="font-bold text-slate-900">Postgres RLS Security</h3>
            <p className="mt-2 text-sm text-slate-600">
              Guaranteed tenant data isolation enforced at the database layer via Supabase JWT
              claims.
            </p>
          </div>
        </div>
      </section>

      <footer className="border-t border-slate-200 bg-white py-6 text-center text-sm text-slate-500">
        © {new Date().getFullYear()} Glix Connect HR. All rights reserved.
      </footer>
    </main>
  );
}
