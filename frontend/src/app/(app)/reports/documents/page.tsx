import { FileText, CheckCircle2, Clock, AlertTriangle } from "lucide-react";
import { auth } from "@/auth";
import { getDocumentReport } from "@/lib/reports";
import { ReportsSubnav } from "../reports-subnav";
import { ReportExportButton } from "../report-export-button";
import { BreakdownTable } from "../breakdown-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function DocumentReportPage(): Promise<React.JSX.Element> {
  const session = await auth();
  if (!session?.accessToken) {
    return <p className="text-muted-foreground">Sign in required.</p>;
  }
  if (session.user.role === "org_viewer") {
    return <p className="text-muted-foreground">You don&apos;t have permission to view reports.</p>;
  }

  const report = await getDocumentReport(session.accessToken);
  const { summary } = report;

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-semibold">Reports</h1>
          <p className="text-muted-foreground text-sm">Document expiry summary.</p>
        </div>
        <ReportExportButton endpoint="/v1/reports/documents/export" filename="document-expiry" />
      </div>

      <ReportsSubnav />

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Documents</CardTitle>
            <FileText className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Active & Valid</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600">{summary.active}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Expiring Soon</CardTitle>
            <Clock className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600">
              {summary.expiring30 + summary.expiring60 + summary.expiring90}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Expired</CardTitle>
            <AlertTriangle className="h-4 w-4 text-rose-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-rose-600">{summary.expired}</div>
          </CardContent>
        </Card>
      </div>

      <BreakdownTable title="By Document Type" rows={report.byType} labelHeader="Document Type" />
    </div>
  );
}
