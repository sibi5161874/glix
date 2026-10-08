import Link from "next/link";
import { Users, CalendarDays, FileText, Wallet } from "lucide-react";
import { auth } from "@/auth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ReportsSubnav } from "./reports-subnav";

const REPORTS = [
  {
    label: "Employee Demographics",
    href: "/reports/employees",
    icon: Users,
    description: "Headcount by department, designation, gender, employment type, and status.",
  },
  {
    label: "Leave Utilization",
    href: "/reports/leaves",
    icon: CalendarDays,
    description: "Allocated vs. used leave by type, pending requests, and approved days per year.",
  },
  {
    label: "Document Expiry",
    href: "/reports/documents",
    icon: FileText,
    description: "Compliance document expiry windows and breakdown by document type.",
  },
  {
    label: "Loan Balances",
    href: "/reports/loans",
    icon: Wallet,
    description: "Outstanding and repaid loan amounts, broken down by status.",
  },
] as const;

export default async function ReportsPage(): Promise<React.JSX.Element> {
  const session = await auth();
  if (!session?.accessToken) {
    return <p className="text-muted-foreground">Sign in required.</p>;
  }
  if (session.user.role === "org_viewer") {
    return <p className="text-muted-foreground">You don&apos;t have permission to view reports.</p>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold">Reports</h1>
        <p className="text-muted-foreground text-sm">
          Org-wide reporting with CSV, Excel, and PDF export.
        </p>
      </div>

      <ReportsSubnav />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {REPORTS.map(({ label, href, icon: Icon, description }) => (
          <Link key={href} href={href}>
            <Card className="hover:border-primary/50 h-full transition-colors">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Icon className="h-5 w-5" /> {label}
                </CardTitle>
                <CardDescription>{description}</CardDescription>
              </CardHeader>
              <CardContent />
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
