import { auth } from "@/auth";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  CalendarDays,
  FileText,
  Wallet,
  Megaphone,
  AlertTriangle,
  ArrowRight,
} from "lucide-react";
import { listEmployees } from "@/lib/employees";
import { getDocumentSummary } from "@/lib/documents";
import { getLoanSummary } from "@/lib/loans";
import { listAnnouncements, type AnnouncementItem } from "@/lib/announcements";

export default async function DashboardPage(): Promise<React.JSX.Element> {
  const session = await auth();
  const name = session?.user.email?.split("@")[0] ?? "there";

  let employeeCount = "—";
  let expiringDocCount = "—";
  let activeLoansCount = "—";
  let announcements: AnnouncementItem[] = [];

  if (session?.accessToken) {
    try {
      const [empRes, docSummary, loanSummary, recentAnnouncements] = await Promise.allSettled([
        listEmployees(session.accessToken, { limit: 1 }),
        getDocumentSummary(session.accessToken),
        getLoanSummary(session.accessToken),
        listAnnouncements(session.accessToken, { limit: 5 }),
      ]);

      if (empRes.status === "fulfilled") {
        employeeCount = String(empRes.value.total);
      }
      if (docSummary.status === "fulfilled") {
        const expiringTotal =
          docSummary.value.expiring30 +
          docSummary.value.expiring60 +
          docSummary.value.expiring90 +
          docSummary.value.expired;
        expiringDocCount = String(expiringTotal);
      }
      if (loanSummary.status === "fulfilled") {
        activeLoansCount = String(loanSummary.value.activeCount);
      }
      if (recentAnnouncements.status === "fulfilled") {
        announcements = recentAnnouncements.value.items;
      }
    } catch {
      // Fallbacks kept as dashes
    }
  }

  const kpis = [
    {
      label: "Total Employees",
      value: employeeCount,
      icon: Users,
      href: "/employees",
    },
    {
      label: "Pending Leaves",
      value: "—",
      icon: CalendarDays,
      href: "/leaves",
    },
    {
      label: "Expiring Documents",
      value: expiringDocCount,
      icon: FileText,
      href: "/documents",
    },
    {
      label: "Active Loans",
      value: activeLoansCount,
      icon: Wallet,
      href: "/payroll/loans",
    },
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-baseline justify-between">
        <div>
          <h1 className="text-3xl font-semibold">Welcome back, {name}</h1>
          <p className="text-muted-foreground text-sm">
            Here is an overview of your organization's workforce status today.
          </p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {kpis.map(({ label, value, icon: Icon, href }) => (
          <Link key={label} href={href}>
            <Card className="hover:border-primary/50 cursor-pointer transition-colors">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <span className="text-muted-foreground text-sm font-medium">{label}</span>
                <Icon className="text-muted-foreground h-4 w-4" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{value}</div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Company Announcements Bulletin */}
        <div className="space-y-4 lg:col-span-2">
          <div className="flex items-center justify-between">
            <h2 className="flex items-center gap-2 text-lg font-semibold">
              <Megaphone className="text-primary h-5 w-5" /> Company Announcements
            </h2>
            <Link
              href="/announcements"
              className="text-primary flex items-center gap-1 text-xs font-medium hover:underline"
            >
              View all <ArrowRight className="h-3 w-3" />
            </Link>
          </div>

          {announcements.length === 0 ? (
            <Card className="text-muted-foreground p-8 text-center">
              <Megaphone className="mx-auto mb-2 h-8 w-8 opacity-40" />
              <p className="text-sm">No recent company bulletins or notices.</p>
            </Card>
          ) : (
            <div className="space-y-3">
              {announcements.map((item) => (
                <Card
                  key={item.id}
                  className={
                    item.priority === "urgent"
                      ? "border-rose-500/50 bg-rose-50/20 dark:bg-rose-950/10"
                      : ""
                  }
                >
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {item.priority === "urgent" && (
                          <Badge className="flex items-center gap-1 bg-rose-600 text-[10px] text-white">
                            <AlertTriangle className="h-2.5 w-2.5" /> Urgent
                          </Badge>
                        )}
                        {item.priority === "high" && (
                          <Badge className="bg-amber-600 text-[10px] text-white">High</Badge>
                        )}
                        <CardTitle className="text-base">{item.title}</CardTitle>
                      </div>
                      <span className="text-muted-foreground text-xs">
                        {new Date(item.publishAt).toLocaleDateString()}
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground line-clamp-2 text-sm">{item.body}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Quick Links & Shortcuts */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Quick Actions</h2>
          <Card>
            <CardContent className="space-y-3 p-4">
              <Link
                href="/employees"
                className="hover:bg-muted flex items-center justify-between rounded-md p-2 text-sm font-medium transition-colors"
              >
                <span>Directory & Onboarding</span>
                <ArrowRight className="text-muted-foreground h-4 w-4" />
              </Link>
              <Link
                href="/leaves/requests"
                className="hover:bg-muted flex items-center justify-between rounded-md p-2 text-sm font-medium transition-colors"
              >
                <span>Apply or Review Leaves</span>
                <ArrowRight className="text-muted-foreground h-4 w-4" />
              </Link>
              <Link
                href="/documents"
                className="hover:bg-muted flex items-center justify-between rounded-md p-2 text-sm font-medium transition-colors"
              >
                <span>Document Vault & Expiry Alerts</span>
                <ArrowRight className="text-muted-foreground h-4 w-4" />
              </Link>
              <Link
                href="/payroll/loans"
                className="hover:bg-muted flex items-center justify-between rounded-md p-2 text-sm font-medium transition-colors"
              >
                <span>Loans & Advances</span>
                <ArrowRight className="text-muted-foreground h-4 w-4" />
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
