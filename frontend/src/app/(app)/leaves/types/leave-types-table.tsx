"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { createLeaveType, deleteLeaveType, updateLeaveType, type LeaveType } from "@/lib/leave";
import { ApiError } from "@/lib/api";
import { LeaveTypeDialog } from "./leave-type-dialog";

export function LeaveTypesTable({
  initialLeaveTypes,
  canWrite,
}: {
  initialLeaveTypes: LeaveType[];
  canWrite: boolean;
}): React.JSX.Element {
  const { data: session } = useSession();
  const [leaveTypes, setLeaveTypes] = useState(initialLeaveTypes);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<LeaveType | null>(null);

  async function handleDelete(id: string): Promise<void> {
    if (!session?.accessToken) return;
    try {
      await deleteLeaveType(session.accessToken, id);
      setLeaveTypes((prev) => prev.filter((t) => t.id !== id));
      toast.success("Leave type removed.");
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Failed to remove leave type.");
    }
  }

  async function handleSave(values: {
    name: string;
    code: string;
    daysPerYear: number;
    isPaid: boolean;
    requiresApproval: boolean;
  }): Promise<void> {
    if (!session?.accessToken) return;
    try {
      if (editing) {
        const updated = await updateLeaveType(session.accessToken, editing.id, values);
        setLeaveTypes((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
        toast.success("Leave type updated.");
      } else {
        const created = await createLeaveType(session.accessToken, values);
        setLeaveTypes((prev) => [...prev, created]);
        toast.success("Leave type added.");
      }
      setDialogOpen(false);
      setEditing(null);
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Failed to save leave type.");
    }
  }

  return (
    <>
      {canWrite && (
        <div className="flex justify-end">
          <Button
            onClick={() => {
              setEditing(null);
              setDialogOpen(true);
            }}
          >
            <Plus className="h-4 w-4" />
            Add leave type
          </Button>
        </div>
      )}

      <Card className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Code</TableHead>
              <TableHead>Days/year</TableHead>
              <TableHead>Paid</TableHead>
              <TableHead>Approval</TableHead>
              <TableHead>Status</TableHead>
              {canWrite && <TableHead className="text-right">Actions</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {leaveTypes.map((t) => (
              <TableRow key={t.id}>
                <TableCell className="font-medium">{t.name}</TableCell>
                <TableCell className="text-muted-foreground">{t.code}</TableCell>
                <TableCell>{t.daysPerYear}</TableCell>
                <TableCell>{t.isPaid ? "Paid" : "Unpaid"}</TableCell>
                <TableCell>{t.requiresApproval ? "Required" : "Auto"}</TableCell>
                <TableCell>
                  <Badge variant={t.isActive ? "success" : "secondary"}>
                    {t.isActive ? "active" : "inactive"}
                  </Badge>
                </TableCell>
                {canWrite && (
                  <TableCell className="text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      className="mr-2"
                      onClick={() => {
                        setEditing(t);
                        setDialogOpen(true);
                      }}
                    >
                      Edit
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleDelete(t.id)}>
                      Delete
                    </Button>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      <LeaveTypeDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        leaveType={editing}
        onSave={handleSave}
      />
    </>
  );
}
