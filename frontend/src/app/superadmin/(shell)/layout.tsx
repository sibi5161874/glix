import Link from "next/link";
import { auth } from "@/auth";
import { brandConfig } from "@app/shared/config";
import { UserMenu } from "@/components/app-shell/user-menu";
import {
  ShieldAlert,
  LayoutDashboard,
  Building2,
  CreditCard,
  LifeBuoy,
  MessageSquare,
  Users,
  Settings,
} from "lucide-react";

export default async function SuperadminLayout({
  children,
}: {
  children: React.ReactNode;
}): Promise<React.JSX.Element> {
  const session = await auth();

  return (
    <div className="flex min-h-screen flex-col">
      <header className="bg-accent text-accent-foreground flex h-14 items-center justify-between border-b px-6">
        <div className="flex items-center gap-6">
          <Link href="/superadmin/dashboard" className="flex shrink-0 items-center gap-2">
            <ShieldAlert className="h-4 w-4" />
            <span className="text-sm font-semibold">{brandConfig.name}</span>
          </Link>

          <nav className="flex items-center gap-4 overflow-x-auto text-xs font-medium">
            <Link
              href="/superadmin/dashboard"
              className="text-muted-foreground hover:text-foreground flex items-center gap-1.5 whitespace-nowrap transition-colors"
            >
              <LayoutDashboard className="h-3.5 w-3.5" />
              Dashboard
            </Link>
            <Link
              href="/superadmin/organizations"
              className="text-muted-foreground hover:text-foreground flex items-center gap-1.5 whitespace-nowrap transition-colors"
            >
              <Building2 className="h-3.5 w-3.5" />
              Organizations
            </Link>
            <Link
              href="/superadmin/plans"
              className="text-muted-foreground hover:text-foreground flex items-center gap-1.5 whitespace-nowrap transition-colors"
            >
              <CreditCard className="h-3.5 w-3.5" />
              Plans
            </Link>
            <Link
              href="/superadmin/support"
              className="text-muted-foreground hover:text-foreground flex items-center gap-1.5 whitespace-nowrap transition-colors"
            >
              <LifeBuoy className="h-3.5 w-3.5" />
              Support
            </Link>
            <Link
              href="/superadmin/leads"
              className="text-muted-foreground hover:text-foreground flex items-center gap-1.5 whitespace-nowrap transition-colors"
            >
              <MessageSquare className="h-3.5 w-3.5" />
              Leads
            </Link>
            <Link
              href="/superadmin/team"
              className="text-muted-foreground hover:text-foreground flex items-center gap-1.5 whitespace-nowrap transition-colors"
            >
              <Users className="h-3.5 w-3.5" />
              Team
            </Link>
            <Link
              href="/superadmin/settings"
              className="text-muted-foreground hover:text-foreground flex items-center gap-1.5 whitespace-nowrap transition-colors"
            >
              <Settings className="h-3.5 w-3.5" />
              Settings
            </Link>
          </nav>
        </div>
        <UserMenu email={session?.user.email} role="super_admin" />
      </header>
      <main className="bg-muted/20 flex-1">
        <div className="mx-auto max-w-7xl px-6 py-8">{children}</div>
      </main>
    </div>
  );
}
