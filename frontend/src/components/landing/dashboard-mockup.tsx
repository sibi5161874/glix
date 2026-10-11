import React from "react";
import { Lock, LayoutDashboard, Users, CalendarDays, Megaphone, FileText } from "lucide-react";

export function DashboardMockup(): React.JSX.Element {
  return (
    <div className="w-full max-w-5xl overflow-hidden rounded-2xl border border-white/10 bg-slate-900/60 shadow-2xl shadow-black/60 backdrop-blur-2xl transition-all hover:border-[#f76707]/30">
      {/* Browser Bar */}
      <div className="flex items-center gap-2 border-b border-white/10 bg-slate-950/70 px-4 py-2.5">
        <div className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-rose-500/80" />
          <span className="h-2.5 w-2.5 rounded-full bg-amber-500/80" />
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-500/80" />
        </div>
        <div className="mx-auto flex w-72 max-w-xs items-center justify-center gap-1.5 rounded-full border border-white/5 bg-slate-900/80 px-3 py-1 font-mono text-[11px] text-slate-400">
          <Lock className="h-3 w-3 text-emerald-400" />
          <span>edocs.glix.ae/dashboard</span>
        </div>
      </div>

      {/* Mockup Body */}
      <div className="grid min-h-[340px] grid-cols-12 text-left">
        {/* Mockup Sidebar */}
        <aside className="hidden flex-col gap-4 border-r border-white/10 bg-slate-950/40 p-4 md:col-span-3 md:flex">
          <div className="flex items-center gap-2 px-1">
            <span className="flex h-6 w-6 items-center justify-center rounded bg-[#f76707]/20 text-xs font-bold text-[#f76707]">
              GC
            </span>
            <span className="text-xs font-semibold tracking-wide text-white">Glix Connect</span>
          </div>

          <div className="flex flex-col gap-1 text-xs">
            <div className="flex items-center gap-2.5 rounded-lg bg-[#f76707]/15 px-3 py-2 font-semibold text-[#f76707]">
              <LayoutDashboard className="h-4 w-4" />
              <span>Dashboard</span>
            </div>
            <div className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-slate-400 hover:text-slate-200">
              <Users className="h-4 w-4" />
              <span>Employees</span>
            </div>
            <div className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-slate-400 hover:text-slate-200">
              <CalendarDays className="h-4 w-4" />
              <span>Leaves</span>
            </div>
            <div className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-slate-400 hover:text-slate-200">
              <Megaphone className="h-4 w-4" />
              <span>Announcements</span>
            </div>
            <div className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-slate-400 hover:text-slate-200">
              <FileText className="h-4 w-4" />
              <span>Documents</span>
            </div>
          </div>
        </aside>

        {/* Mockup Main Workspace */}
        <main className="col-span-12 space-y-5 bg-slate-900/40 p-5 md:col-span-9 md:p-6">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white md:text-base">System Control Dashboard</h3>
            <span className="flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-semibold text-emerald-400">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
              Live Sync
            </span>
          </div>

          {/* Metric Cards Row */}
          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-xl border border-white/5 bg-slate-950/60 p-3">
              <span className="block text-[11px] text-slate-400">Active Employees</span>
              <span className="mt-1 block text-xl font-bold text-white md:text-2xl">124</span>
            </div>
            <div className="rounded-xl border border-white/5 bg-slate-950/60 p-3">
              <span className="block text-[11px] text-slate-400">Pending Leaves</span>
              <span className="mt-1 block text-xl font-bold text-white md:text-2xl">3</span>
            </div>
            <div className="rounded-xl border border-rose-500/20 bg-slate-950/60 p-3">
              <span className="block text-[11px] text-slate-400">Expiring Docs</span>
              <span className="mt-1 block text-xl font-bold text-rose-400 md:text-2xl">8</span>
            </div>
          </div>

          {/* Activity Table Card */}
          <div className="overflow-hidden rounded-xl border border-white/5 bg-slate-950/60">
            <div className="border-b border-white/5 px-3 py-2 text-[11px] font-semibold text-slate-300">
              Recent Activity
            </div>
            <div className="divide-y divide-white/5 text-[11px]">
              <div className="flex items-center justify-between px-3 py-2">
                <span className="font-medium text-white">Passport Expiry alert</span>
                <span className="text-slate-400">John Doe</span>
                <span className="font-medium text-rose-400">Expires in 12 days</span>
              </div>
              <div className="flex items-center justify-between px-3 py-2">
                <span className="font-medium text-white">Annual Leave approved</span>
                <span className="text-slate-400">Sarah Jenkins</span>
                <span className="font-medium text-emerald-400">Approved by Admin</span>
              </div>
              <div className="flex items-center justify-between px-3 py-2">
                <span className="font-medium text-white">Announcement published</span>
                <span className="text-slate-400">Office Notice</span>
                <span className="font-medium text-emerald-400">Published</span>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
