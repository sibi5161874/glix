import { Banknote, Clock, CreditCard, Check } from "lucide-react";
import { auth } from "@/auth";
import { getLoanReport } from "@/lib/reports";
import { ReportsSubnav } from "../reports-subnav";
import { ReportExportButton } from "../report-export-button";
import { BreakdownTable } from "../breakdown-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function LoanReportPage(): Promise<React.JSX.Element> {
  const session = await auth();
  if (!session?.accessToken) {
    return <p className="text-muted-foreground">Sign in required.</p>;
  }
  if (session.user.role === "org_viewer") {
    return <p className="text-muted-foreground">You don&apos;t have permission to view reports.</p>;
  }

  const report = await getLoanReport(session.accessToken);
  const { summary } = report;

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-semibold">Reports</h1>
          <p className="text-muted-foreground text-sm">Loan balances summary.</p>
        </div>
        <ReportExportButton endpoint="/v1/reports/loans/export" filename="loan-balances" />
      </div>

      <ReportsSubnav />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Active Loans</CardTitle>
            <Banknote className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary.activeCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Pending Requests</CardTitle>
            <Clock className="h-4 w-4 text-amber-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary.pendingCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Outstanding</CardTitle>
            <CreditCard className="h-4 w-4 text-rose-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${parseFloat(summary.totalOutstanding).toLocaleString()}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Recovered</CardTitle>
            <Check className="h-4 w-4 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${parseFloat(summary.totalRepaid).toLocaleString()}
            </div>
          </CardContent>
        </Card>
      </div>

      <BreakdownTable title="By Status" rows={report.byStatus} labelHeader="Status" />
    </div>
  );
}
