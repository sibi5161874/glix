import { auth } from "@/auth";
import { LoansTable } from "./loans-table";
import { listLoans, getLoanSummary } from "@/lib/loans";
import { listEmployees } from "@/lib/employees";

export default async function LoansPage(): Promise<React.JSX.Element> {
  const session = await auth();
  if (!session?.accessToken) {
    return <p className="text-muted-foreground">Sign in required.</p>;
  }

  const [loanRes, summary, empRes] = await Promise.all([
    listLoans(session.accessToken, { limit: 50 }),
    getLoanSummary(session.accessToken),
    listEmployees(session.accessToken, { limit: 100 }),
  ]);

  const canApprove = session.user.role === "org_admin";
  const canCreate = session.user.role === "org_admin" || session.user.role === "org_staff";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold">Employee Loans & Advances</h1>
        <p className="text-muted-foreground text-sm">
          Manage employee loan applications, monthly EMI deductions, and repayment tracking.
        </p>
      </div>

      <LoansTable
        initialLoans={loanRes.items}
        summary={summary}
        employees={empRes.items}
        accessToken={session.accessToken}
        canApprove={canApprove}
        canCreate={canCreate}
      />
    </div>
  );
}
