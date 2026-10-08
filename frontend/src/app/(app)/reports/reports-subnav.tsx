"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const TABS = [
  { label: "Overview", href: "/reports" },
  { label: "Employees", href: "/reports/employees" },
  { label: "Leaves", href: "/reports/leaves" },
  { label: "Documents", href: "/reports/documents" },
  { label: "Loans", href: "/reports/loans" },
] as const;

export function ReportsSubnav(): React.JSX.Element {
  const pathname = usePathname();

  return (
    <nav className="mb-6 flex gap-1 border-b">
      {TABS.map((tab) => {
        const isActive =
          tab.href === "/reports" ? pathname === "/reports" : pathname.startsWith(tab.href);
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={cn(
              "border-b-2 px-3 py-2 text-sm font-medium transition-colors",
              isActive
                ? "border-primary text-foreground"
                : "text-muted-foreground hover:text-foreground border-transparent",
            )}
          >
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
}
