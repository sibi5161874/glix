import { auth } from "@/auth";
import { listLeaveTypes } from "@/lib/leave";
import { listEmployees } from "@/lib/employees";
import { CreateLeaveRequestForm } from "./create-leave-request-form";

export default async function CreateLeaveRequestPage(): Promise<React.JSX.Element> {
  const session = await auth();
  if (!session?.accessToken) return <p className="text-muted-foreground">Sign in required.</p>;

  const isApprover = session.user.role === "org_admin" || session.user.role === "org_staff";
  const [leaveTypes, employeesResult] = await Promise.all([
    listLeaveTypes(session.accessToken),
    isApprover
      ? listEmployees(session.accessToken, { limit: 100 })
      : Promise.resolve({ items: [], total: 0, page: 1, limit: 0 }),
  ]);

  return (
    <div className="max-w-xl space-y-6">
      <h1 className="text-3xl font-semibold">Request leave</h1>
      <CreateLeaveRequestForm
        leaveTypes={leaveTypes}
        employees={employeesResult.items}
        selfEmployeeId={session.user.employeeId}
        isApprover={isApprover}
      />
    </div>
  );
}
