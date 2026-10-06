import { auth } from "@/auth";
import { listLeaveBalances, listLeaveTypes } from "@/lib/leave";
import { listEmployees } from "@/lib/employees";
import { LeaveBalancesTable } from "./leave-balances-table";

export default async function LeaveBalancesPage(): Promise<React.JSX.Element> {
  const session = await auth();
  if (!session?.accessToken) return <p className="text-muted-foreground">Sign in required.</p>;

  const year = new Date().getFullYear();
  const canAdjust = session.user.role === "org_admin";
  const [balances, leaveTypes, employeesResult] = await Promise.all([
    listLeaveBalances(session.accessToken, undefined, year),
    listLeaveTypes(session.accessToken),
    canAdjust
      ? listEmployees(session.accessToken, { limit: 100 })
      : Promise.resolve({ items: [], total: 0, page: 1, limit: 0 }),
  ]);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-semibold">Leave balances — {year}</h1>
      <LeaveBalancesTable
        initialBalances={balances}
        leaveTypes={leaveTypes}
        employees={employeesResult.items}
        year={year}
        canAdjust={canAdjust}
      />
    </div>
  );
}
