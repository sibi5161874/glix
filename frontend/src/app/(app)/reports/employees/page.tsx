import { auth } from "@/auth";
import { getEmployeeReport } from "@/lib/reports";
import { ReportsSubnav } from "../reports-subnav";
import { ReportExportButton } from "../report-export-button";
import { BreakdownTable } from "../breakdown-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function EmployeeReportPage(): Promise<React.JSX.Element> {
  const session = await auth();
  if (!session?.accessToken) {
    return <p className="text-muted-foreground">Sign in required.</p>;
  }
  if (session.user.role === "org_viewer") {
    return <p className="text-muted-foreground">You don&apos;t have permission to view reports.</p>;
  }

  const report = await getEmployeeReport(session.accessToken);

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-semibold">Reports</h1>
          <p className="text-muted-foreground text-sm">Employee demographics breakdown.</p>
        </div>
        <ReportExportButton
          endpoint="/v1/reports/employees/export"
          filename="employee-demographics"
        />
      </div>

      <ReportsSubnav />

      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">Total Employees</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{report.totalEmployees}</div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <BreakdownTable title="By Department" rows={report.byDepartment} labelHeader="Department" />
        <BreakdownTable
          title="By Designation"
          rows={report.byDesignation}
          labelHeader="Designation"
        />
        <BreakdownTable title="By Gender" rows={report.byGender} labelHeader="Gender" />
        <BreakdownTable
          title="By Employment Type"
          rows={report.byEmploymentType}
          labelHeader="Employment Type"
        />
        <BreakdownTable title="By Status" rows={report.byStatus} labelHeader="Status" />
      </div>
    </div>
  );
}
