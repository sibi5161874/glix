import { auth } from "@/auth";
import { getLeaveReport } from "@/lib/reports";
import { ReportsSubnav } from "../reports-subnav";
import { ReportExportButton } from "../report-export-button";
import { YearSelect } from "./year-select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const currentYear = new Date().getUTCFullYear();
const YEAR_OPTIONS = [currentYear - 2, currentYear - 1, currentYear, currentYear + 1];

export default async function LeaveReportPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}): Promise<React.JSX.Element> {
  const session = await auth();
  if (!session?.accessToken) {
    return <p className="text-muted-foreground">Sign in required.</p>;
  }
  if (session.user.role === "org_viewer") {
    return <p className="text-muted-foreground">You don&apos;t have permission to view reports.</p>;
  }

  const params = await searchParams;
  const year = Number(params["year"]) || currentYear;
  const report = await getLeaveReport(session.accessToken, year);

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-semibold">Reports</h1>
          <p className="text-muted-foreground text-sm">Leave utilization by type.</p>
        </div>
        <div className="flex items-center gap-2">
          <YearSelect year={year} years={YEAR_OPTIONS} />
          <ReportExportButton
            endpoint={`/v1/reports/leaves/export?year=${year}`}
            filename={`leave-utilization-${year}`}
          />
        </div>
      </div>

      <ReportsSubnav />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Pending Requests</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{report.pendingRequests}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Approved Days ({year})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{report.approvedDaysThisYear}</div>
          </CardContent>
        </Card>
      </div>

      <div>
        <h3 className="mb-2 text-sm font-medium">By Leave Type</h3>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Leave Type</TableHead>
              <TableHead className="text-right">Allocated</TableHead>
              <TableHead className="text-right">Used</TableHead>
              <TableHead className="text-right">Carried Over</TableHead>
              <TableHead className="text-right">Utilization</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {report.byLeaveType.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-muted-foreground text-center">
                  No data for {year}.
                </TableCell>
              </TableRow>
            ) : (
              report.byLeaveType.map((row) => (
                <TableRow key={row.leaveType}>
                  <TableCell>{row.leaveType}</TableCell>
                  <TableCell className="text-right">{row.totalAllocated}</TableCell>
                  <TableCell className="text-right">{row.totalUsed}</TableCell>
                  <TableCell className="text-right">{row.totalCarriedOver}</TableCell>
                  <TableCell className="text-right">{row.utilizationPercent}%</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
