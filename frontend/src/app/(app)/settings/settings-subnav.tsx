"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Building2, Network, Award, ShieldCheck, Mail } from "lucide-react";
import { cn } from "@/lib/utils";

const TABS = [
  { label: "Company Profile", href: "/settings/profile", icon: Building2 },
  { label: "Departments", href: "/settings/departments", icon: Network },
  { label: "Designations", href: "/settings/designations", icon: Award },
  { label: "Roles & Permissions", href: "/settings/roles", icon: ShieldCheck },
  { label: "Notification Templates", href: "/settings/templates", icon: Mail },
] as const;

export function SettingsSubnav(): React.JSX.Element {
  const pathname = usePathname();

  return (
    <nav className="flex gap-2 overflow-x-auto border-b pb-4">
      {TABS.map(({ label, href, icon: Icon }) => {
        const isActive = pathname === href || pathname.startsWith(`${href}/`);
        return (
          <Link
            key={label}
            href={href}
            className={cn(
              "flex items-center gap-2 whitespace-nowrap rounded-md px-3 py-2 text-sm font-medium transition-colors",
              isActive
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-muted hover:text-foreground",
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
