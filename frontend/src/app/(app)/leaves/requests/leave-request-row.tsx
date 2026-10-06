"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  approveLeaveRequest,
  cancelLeaveRequest,
  rejectLeaveRequest,
  type LeaveRequestItem,
} from "@/lib/leave";
import { ApiError } from "@/lib/api";

const STATUS_VARIANT: Record<string, "success" | "warning" | "secondary" | "destructive"> = {
  pending: "warning",
  approved: "success",
  rejected: "destructive",
  cancelled: "secondary",
};

export function LeaveRequestRow({
  request,
  isApprover,
}: {
  request: LeaveRequestItem;
  isApprover: boolean;
}): React.JSX.Element {
  const { data: session } = useSession();
  const router = useRouter();
  const [rejectOpen, setRejectOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [busy, setBusy] = useState(false);

  async function run(action: () => Promise<unknown>, successMsg: string): Promise<void> {
    setBusy(true);
    try {
      await action();
      toast.success(successMsg);
      router.refresh();
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Something went wrong.");
    } finally {
      setBusy(false);
    }
  }

  async function handleReject(e: React.FormEvent): Promise<void> {
    e.preventDefault();
    if (!session?.accessToken) return;
    await run(
      () => rejectLeaveRequest(session.accessToken, request.id, rejectionReason),
      "Request rejected.",
    );
    setRejectOpen(false);
  }

  return (
    <div className="flex items-center justify-between px-4 py-3">
      <div>
        <p className="font-medium">{request.employeeName}</p>
        <p className="text-muted-foreground text-sm">
          {request.leaveTypeName} · {request.startDate} to {request.endDate} ({request.totalDays}{" "}
          days)
        </p>
        {request.reason && (
          <p className="text-muted-foreground text-sm italic">"{request.reason}"</p>
        )}
        {request.rejectionReason && (
          <p className="text-destructive text-sm">Rejected: {request.rejectionReason}</p>
        )}
      </div>
      <div className="flex items-center gap-2">
        <Badge variant={STATUS_VARIANT[request.status] ?? "secondary"}>{request.status}</Badge>
        {request.status === "pending" && isApprover && session?.accessToken && (
          <>
            <Button
              size="sm"
              disabled={busy}
              onClick={() =>
                run(() => approveLeaveRequest(session.accessToken, request.id), "Request approved.")
              }
            >
              Approve
            </Button>
            <Button size="sm" variant="outline" disabled={busy} onClick={() => setRejectOpen(true)}>
              Reject
            </Button>
          </>
        )}
        {request.status === "pending" && !isApprover && session?.accessToken && (
          <Button
            size="sm"
            variant="outline"
            disabled={busy}
            onClick={() =>
              run(() => cancelLeaveRequest(session.accessToken, request.id), "Request cancelled.")
            }
          >
            Cancel
          </Button>
        )}
      </div>

      <Dialog open={rejectOpen} onOpenChange={setRejectOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject leave request</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleReject} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="reject-reason">Reason</Label>
              <Input
                id="reject-reason"
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                minLength={3}
                required
              />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setRejectOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="destructive" disabled={busy}>
                Reject
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
