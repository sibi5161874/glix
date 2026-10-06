import Link from "next/link";
import { CalendarClock, Plus } from "lucide-react";
import { auth } from "@/auth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { listLeaveRequests } from "@/lib/leave";
import { LeaveRequestFilters } from "./leave-request-filters";
import { LeaveRequestRow } from "./leave-request-row";

export default async function LeaveRequestsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}): Promise<React.JSX.Element> {
  const session = await auth();
  const params = await searchParams;
  if (!session?.accessToken) return <p className="text-muted-foreground">Sign in required.</p>;

  const isApprover = session.user.role === "org_admin" || session.user.role === "org_staff";
  const filter = {
    status: params["status"] as "pending" | "approved" | "rejected" | "cancelled" | undefined,
    employeeId: isApprover ? undefined : (session.user.employeeId ?? undefined),
  };
  const requests = await listLeaveRequests(session.accessToken, filter);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-semibold">Leave requests</h1>
        <Button asChild>
          <Link href="/leaves/requests/create">
            <Plus className="h-4 w-4" />
            Request leave
          </Link>
        </Button>
      </div>

      <LeaveRequestFilters />

      <Card className="p-0">
        {requests.length === 0 ? (
          <div className="py-16 text-center">
            <CalendarClock className="text-muted-foreground mx-auto h-12 w-12" />
            <p className="mt-4 text-lg font-medium">No leave requests found</p>
          </div>
        ) : (
          <div className="divide-y">
            {requests.map((r) => (
              <LeaveRequestRow key={r.id} request={r} isApprover={isApprover} />
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
