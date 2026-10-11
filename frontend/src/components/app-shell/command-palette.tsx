"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  LayoutDashboard,
  Users,
  UserPlus,
  CalendarDays,
  FileText,
  Wallet,
  Megaphone,
  BarChart3,
  Settings,
  CreditCard,
  LifeBuoy,
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

interface NavCommand {
  label: string;
  category: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

const COMMANDS: NavCommand[] = [
  { label: "Dashboard", category: "Workspace", href: "/dashboard", icon: LayoutDashboard },
  { label: "Employees Directory", category: "People", href: "/employees", icon: Users },
  { label: "Add Employee", category: "People", href: "/employees/create", icon: UserPlus },
  { label: "Leave Requests", category: "Time Off", href: "/leaves/requests", icon: CalendarDays },
  { label: "Document Vault", category: "Compliance", href: "/documents", icon: FileText },
  { label: "Payroll Loans", category: "Finance", href: "/payroll/loans", icon: Wallet },
  { label: "Announcements", category: "Workspace", href: "/announcements", icon: Megaphone },
  { label: "Reports & Analytics", category: "Intelligence", href: "/reports", icon: BarChart3 },
  { label: "Profile & Account", category: "Settings", href: "/settings/profile", icon: Settings },
  {
    label: "Subscription & Invoices",
    category: "Settings",
    href: "/settings/subscription",
    icon: CreditCard,
  },
  { label: "Support Helpdesk", category: "Help", href: "/support", icon: LifeBuoy },
];

export function CommandPalette(): React.JSX.Element {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const router = useRouter();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent): void => {
      if ((e.key === "k" || e.key === "K") && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const filtered =
    query.trim() === ""
      ? COMMANDS
      : COMMANDS.filter(
          (cmd) =>
            cmd.label.toLowerCase().includes(query.toLowerCase()) ||
            cmd.category.toLowerCase().includes(query.toLowerCase()),
        );

  const handleSelect = (href: string): void => {
    setOpen(false);
    setQuery("");
    router.push(href);
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="border-input bg-background/50 text-muted-foreground hover:bg-muted/60 flex w-48 items-center gap-2 rounded-md border px-3 py-1.5 text-xs transition-colors sm:w-64"
        aria-label="Open global search command palette"
      >
        <Search className="h-3.5 w-3.5" />
        <span className="flex-1 text-left">Quick jump...</span>
        <kbd className="bg-muted pointer-events-none hidden select-none items-center gap-1 rounded border px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
          <span className="text-xs">Ctrl</span>K
        </kbd>
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg gap-0 overflow-hidden p-0">
          <DialogHeader className="border-b p-3">
            <DialogTitle className="sr-only">Global Navigation Search</DialogTitle>
            <div className="flex items-center gap-2 px-1">
              <Search className="text-muted-foreground h-4 w-4" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Type a command or section..."
                className="h-9 border-none text-sm shadow-none focus-visible:ring-0"
                autoFocus
              />
            </div>
          </DialogHeader>
          <div className="max-h-72 overflow-y-auto p-2">
            {filtered.length === 0 ? (
              <div className="text-muted-foreground p-4 text-center text-xs">
                No matching navigation targets found.
              </div>
            ) : (
              <div className="space-y-1">
                {filtered.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.href}
                      onClick={() => handleSelect(item.href)}
                      className="hover:bg-muted flex w-full items-center justify-between rounded-md px-3 py-2 text-left text-sm transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <Icon className="text-muted-foreground h-4 w-4" />
                        <span className="text-foreground font-medium">{item.label}</span>
                      </div>
                      <span className="text-muted-foreground bg-muted/80 rounded px-2 py-0.5 text-[11px]">
                        {item.category}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
