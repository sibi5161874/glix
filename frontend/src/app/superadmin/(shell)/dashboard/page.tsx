import Link from "next/link";
import { auth } from "@/auth";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Building2,
  CreditCard,
  Ticket,
  TrendingUp,
  ArrowRight,
  ShieldCheck,
  PlusCircle,
} from "lucide-react";
import { getPlatformOverview } from "@/lib/platform";

export default async function SuperadminDashboardPage(): Promise<React.JSX.Element> {
  const session = await auth();
  if (!session?.accessToken || !session.user.isPlatformAdmin) {
    return <p className="text-muted-foreground">Superadmin access required.</p>;
  }

  const overview = await getPlatformOverview(session.accessToken);

  const kpis = [
    {
      label: "Total Organizations",
      value: String(overview.orgCount),
      icon: Building2,
      subtext: "Active tenant organizations",
    },
    {
      label: "Monthly Recurring Revenue",
      value: `${overview.mrrAed.toLocaleString()} AED`,
      icon: TrendingUp,
      subtext: "Active paid subscriptions",
    },
    {
      label: "Active Subscriptions",
      value: String(overview.activeSubscriptionsCount),
      icon: CreditCard,
      subtext: "Growth & Enterprise tiers",
    },
    {
      label: "Open Support Tickets",
      value: String(overview.openTicketsCount),
      icon: Ticket,
      subtext: "Pending investigation / triage",
    },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Platform Command Center</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Real-time multi-tenant operations, MRR analytics, and cross-organization controls.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/superadmin/organizations">
            <Button size="sm" className="gap-1.5">
              <PlusCircle className="h-4 w-4" />
              Manage Tenants
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {kpis.map(({ label, value, icon: Icon, subtext }) => (
          <Card key={label} className="bg-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <span className="text-muted-foreground text-xs font-semibold">{label}</span>
              <Icon className="text-primary h-4 w-4" />
            </CardHeader>
            <CardContent>
              <div className="text-foreground text-2xl font-bold">{value}</div>
              <p className="text-muted-foreground mt-1 text-xs">{subtext}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-base font-semibold">
                Recently Registered Organizations
              </CardTitle>
              <CardDescription className="text-xs">
                Latest tenants onboarded to the platform
              </CardDescription>
            </div>
            <Link href="/superadmin/organizations">
              <Button variant="ghost" size="sm" className="gap-1 text-xs">
                View all <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="space-y-3">
            {overview.recentOrgs.length === 0 ? (
              <p className="text-muted-foreground text-xs">No organizations registered yet.</p>
            ) : (
              overview.recentOrgs.map((org) => (
                <div
                  key={org.id}
                  className="bg-muted/20 flex items-center justify-between rounded-lg border p-2.5"
                >
                  <div>
                    <div className="text-sm font-semibold">{org.name}</div>
                    <div className="text-muted-foreground font-mono text-xs">{org.slug}</div>
                  </div>
                  <Badge variant="outline" className="font-semibold capitalize">
                    {org.tier}
                  </Badge>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base font-semibold">
              Platform Health & Core Operations
            </CardTitle>
            <CardDescription className="text-xs">
              Database isolation, RLS policies, and system modules
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between rounded-lg border bg-emerald-500/5 p-3 text-emerald-700 dark:text-emerald-400">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4" />
                <span className="text-xs font-semibold">PostgreSQL Row-Level Security</span>
              </div>
              <Badge className="bg-emerald-600 text-xs text-white">Active & Enforced</Badge>
            </div>
            <div className="flex items-center justify-between rounded-lg border p-3">
              <span className="text-xs font-medium">Tenant Storage & Documents</span>
              <span className="text-muted-foreground text-xs">Filesystem Vault</span>
            </div>
            <div className="flex items-center justify-between rounded-lg border p-3">
              <span className="text-xs font-medium">Authentication & JWT Model</span>
              <span className="text-muted-foreground text-xs">Argon2id + JWT Claims</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
