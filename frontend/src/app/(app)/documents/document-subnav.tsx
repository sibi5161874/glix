"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const TABS = [
  { label: "Vault", href: "/documents" },
  { label: "Document Types", href: "/documents/types" },
] as const;

export function DocumentSubnav(): React.JSX.Element {
  const pathname = usePathname();

  return (
    <nav className="mb-6 flex gap-1 border-b">
      {TABS.map((tab) => {
        const isActive =
          tab.href === "/documents" ? pathname === "/documents" : pathname.startsWith(tab.href);
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
