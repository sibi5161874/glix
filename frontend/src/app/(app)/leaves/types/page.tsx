import { auth } from "@/auth";
import { listLeaveTypes } from "@/lib/leave";
import { LeaveTypesTable } from "./leave-types-table";

export default async function LeaveTypesPage(): Promise<React.JSX.Element> {
  const session = await auth();
  if (!session?.accessToken) return <p className="text-muted-foreground">Sign in required.</p>;

  const leaveTypes = await listLeaveTypes(session.accessToken);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-semibold">Leave types</h1>
      </div>
      <LeaveTypesTable
        initialLeaveTypes={leaveTypes}
        canWrite={session.user.role === "org_admin"}
      />
    </div>
  );
}
