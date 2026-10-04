"use client";

import React, { useEffect, useState } from "react";
import {
  Users,
  FileCheck,
  Shield,
  Calendar,
  ArrowRight,
  Server,
  Sparkles,
  Zap,
} from "lucide-react";

export default function HomePage() {
  const [apiStatus, setApiStatus] = useState<"checking" | "online" | "offline">("checking");
  const [apiVersion, setApiVersion] = useState<string>("");

  useEffect(() => {
    async function checkBackend() {
      try {
        const res = await fetch("http://localhost:5000/health", { mode: "cors" });
        if (res.ok) {
          const data = await res.json();
          setApiStatus("online");
          if (data.version) {
            setApiVersion(`v${data.version}`);
          }
        } else {
          setApiStatus("offline");
        }
      } catch {
        setApiStatus("offline");
      }
    }
    checkBackend();
    const interval = setInterval(checkBackend, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex min-h-screen flex-col justify-between bg-slate-900 text-slate-100 selection:bg-blue-500 selection:text-white">
      {/* Top Navigation */}
      <header className="sticky top-0 z-50 border-b border-slate-800/80 bg-slate-900/80 px-6 py-4 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 text-lg font-bold text-white shadow-lg shadow-blue-500/20">
              G
            </div>
            <div>
              <span className="text-lg font-bold tracking-tight text-white">Glix Connect</span>
              <span className="ml-2.5 rounded-md border border-blue-500/30 bg-blue-500/10 px-2 py-0.5 text-[11px] font-semibold text-blue-400">
                Port 4000
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Live API Health Indicator */}
            <div
              className={`flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium transition-all ${
                apiStatus === "online"
                  ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
                  : apiStatus === "checking"
                    ? "border-amber-500/30 bg-amber-500/10 text-amber-400"
                    : "border-rose-500/30 bg-rose-500/10 text-rose-400"
              }`}
            >
              <span className="relative flex h-2 w-2">
                {apiStatus === "online" && (
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
                )}
                <span
                  className={`relative inline-flex h-2 w-2 rounded-full ${
                    apiStatus === "online"
                      ? "bg-emerald-500"
                      : apiStatus === "checking"
                        ? "bg-amber-500"
                        : "bg-rose-500"
                  }`}
                ></span>
              </span>
              <span>
                {apiStatus === "online"
                  ? `Fastify API Connected (:5000) ${apiVersion}`
                  : apiStatus === "checking"
                    ? "Pinging Backend..."
                    : "Backend Offline (:5000)"}
              </span>
            </div>

            <a
              href="http://localhost:5000/health"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800 px-3.5 py-1.5 text-xs font-medium text-slate-200 transition-colors hover:bg-slate-700 hover:text-white"
            >
              <Server className="h-3.5 w-3.5" /> API Health
            </a>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="mx-auto flex max-w-6xl flex-1 flex-col items-center justify-center px-6 py-16 text-center">
        <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3.5 py-1 text-xs font-semibold text-indigo-300 shadow-inner">
          <Sparkles className="h-3.5 w-3.5 text-indigo-400" />
          <span>Multi-Tenant GCC Enterprise HR Platform</span>
        </div>

        <h1 className="max-w-4xl text-4xl font-extrabold leading-tight tracking-tight text-white sm:text-6xl">
          Next-Generation HR Operations &amp;{" "}
          <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent">
            Document Automation
          </span>
        </h1>

        <p className="mt-6 max-w-2xl text-base leading-relaxed text-slate-400 sm:text-lg">
          Full-stack boilerplate with Next.js 15 App Router on port{" "}
          <code className="font-mono font-semibold text-blue-400">4000</code> and Fastify API on
          port <code className="font-mono font-semibold text-indigo-400">5000</code>. Tenant
          isolation guaranteed by Postgres RLS.
        </p>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <a
            href="http://localhost:5000/health"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-600/30 transition-all hover:bg-blue-500 hover:shadow-blue-500/40"
          >
            Check Backend API Status <ArrowRight className="h-4 w-4" />
          </a>
          <div className="inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-800/60 px-5 py-3 text-sm font-medium text-slate-300">
            <Zap className="h-4 w-4 text-amber-400" /> Monorepo Boilerplate Ready
          </div>
        </div>

        {/* Feature Grid */}
        <div className="mt-16 grid w-full grid-cols-1 gap-5 text-left sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-slate-800 bg-slate-800/40 p-6 backdrop-blur-sm transition-all hover:border-slate-700 hover:bg-slate-800/60">
            <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl border border-blue-500/20 bg-blue-500/10 text-blue-400">
              <Users className="h-5 w-5" />
            </div>
            <h3 className="text-base font-semibold text-white">Employee Master</h3>
            <p className="mt-2 text-xs leading-relaxed text-slate-400">
              Comprehensive workforce directory with department hierarchy and batch CSV imports.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-800/40 p-6 backdrop-blur-sm transition-all hover:border-slate-700 hover:bg-slate-800/60">
            <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl border border-emerald-500/20 bg-emerald-500/10 text-emerald-400">
              <Calendar className="h-5 w-5" />
            </div>
            <h3 className="text-base font-semibold text-white">Leave Engine</h3>
            <p className="mt-2 text-xs leading-relaxed text-slate-400">
              One-click leave approvals, automated balance deduction, and team calendar view.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-800/40 p-6 backdrop-blur-sm transition-all hover:border-slate-700 hover:bg-slate-800/60">
            <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl border border-amber-500/20 bg-amber-500/10 text-amber-400">
              <FileCheck className="h-5 w-5" />
            </div>
            <h3 className="text-base font-semibold text-white">Document Vault</h3>
            <p className="mt-2 text-xs leading-relaxed text-slate-400">
              Secure signed-URL storage with automated 90/60/30-day expiry notifications.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-800/40 p-6 backdrop-blur-sm transition-all hover:border-slate-700 hover:bg-slate-800/60">
            <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl border border-purple-500/20 bg-purple-500/10 text-purple-400">
              <Shield className="h-5 w-5" />
            </div>
            <h3 className="text-base font-semibold text-white">Postgres RLS Security</h3>
            <p className="mt-2 text-xs leading-relaxed text-slate-400">
              Guaranteed tenant data isolation enforced at the database layer via Supabase JWT
              claims.
            </p>
          </div>
        </div>

        {/* Server & Environment Info */}
        <div className="mt-10 w-full max-w-4xl rounded-xl border border-slate-800 bg-slate-950/60 p-5 text-left font-mono text-xs text-slate-400">
          <div className="mb-3 flex items-center justify-between border-b border-slate-800 pb-3 font-semibold text-slate-300">
            <div className="flex items-center gap-2">
              <Server className="h-4 w-4 text-blue-400" />
              <span>Workspace Runtime Architecture</span>
            </div>
            <span className="text-[11px] font-normal text-emerald-400">Boilerplate Connected</span>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div>
              <span className="block text-slate-500">Frontend App:</span>
              <span className="text-white">Next.js 15 (React 19) • Port 4000</span>
            </div>
            <div>
              <span className="block text-slate-500">Backend API:</span>
              <span className="text-white">Fastify 5 (Node 20) • Port 5000</span>
            </div>
            <div>
              <span className="block text-slate-500">Database / Tenancy:</span>
              <span className="text-white">Postgres RLS + Supabase JWT</span>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-900/60 px-6 py-4 text-center text-xs text-slate-500">
        © {new Date().getFullYear()} Glix Connect HR SaaS. All rights reserved.
      </footer>
    </div>
  );
}
