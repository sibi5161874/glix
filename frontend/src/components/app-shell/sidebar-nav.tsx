"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  CalendarDays,
  FileText,
  Wallet,
  Megaphone,
  BarChart3,
  Settings,
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard, enabled: true },
  { label: "Employees", href: "/employees", icon: Users, enabled: false },
  { label: "Leave", href: "/leaves/requests", icon: CalendarDays, enabled: false },
  { label: "Documents", href: "/documents", icon: FileText, enabled: false },
  { label: "Loans", href: "/payroll/loans", icon: Wallet, enabled: false },
  { label: "Announcements", href: "/announcements", icon: Megaphone, enabled: false },
  { label: "Reports", href: "/reports", icon: BarChart3, enabled: false },
  { label: "Settings", href: "/settings/profile", icon: Settings, enabled: false },
] as const;

export function SidebarNav(): React.JSX.Element {
  const pathname = usePathname();

  return (
    <nav className="flex flex-col gap-1 px-3 py-4">
      {NAV_ITEMS.map(({ label, href, icon: Icon, enabled }) => {
        const isActive = pathname === href;
        if (!enabled) {
          return (
            <span
              key={label}
              title="Coming in a later phase"
              className="text-muted-foreground/50 flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium"
            >
              <Icon className="h-4 w-4" />
              {label}
            </span>
          );
        }
        return (
          <Link
            key={label}
            href={href}
            className={cn(
              "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
              isActive ? "bg-muted text-foreground" : "text-muted-foreground hover:bg-muted/50",
            )}
          >
            <Icon className="h-4 w-4" />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
