"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { Plus, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { adjustLeaveBalance, type LeaveBalanceItem, type LeaveType } from "@/lib/leave";
import type { EmployeeListItem } from "@/lib/employees";
import { ApiError } from "@/lib/api";
import { AdjustBalanceDialog } from "./adjust-balance-dialog";

export function LeaveBalancesTable({
  initialBalances,
  leaveTypes,
  employees,
  year,
  canAdjust,
}: {
  initialBalances: LeaveBalanceItem[];
  leaveTypes: LeaveType[];
  employees: EmployeeListItem[];
  year: number;
  canAdjust: boolean;
}): React.JSX.Element {
  const { data: session } = useSession();
  const [balances, setBalances] = useState(initialBalances);
  const [open, setOpen] = useState(false);

  async function handleAdjust(values: {
    employeeId: string;
    leaveTypeId: string;
    allocated: number;
    carriedOver: number;
  }): Promise<void> {
    if (!session?.accessToken) return;
    try {
      const updated = await adjustLeaveBalance(session.accessToken, { ...values, year });
      setBalances((prev) => {
        const exists = prev.some((b) => b.id === updated.id);
        return exists ? prev.map((b) => (b.id === updated.id ? updated : b)) : [...prev, updated];
      });
      toast.success("Balance updated.");
      setOpen(false);
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Failed to adjust balance.");
    }
  }

  return (
    <>
      {canAdjust && (
        <div className="flex justify-end">
          <Button onClick={() => setOpen(true)}>
            <Plus className="h-4 w-4" />
            Adjust balance
          </Button>
        </div>
      )}

      <Card className="p-0">
        {balances.length === 0 ? (
          <div className="py-16 text-center">
            <Wallet className="text-muted-foreground mx-auto h-12 w-12" />
            <p className="mt-4 text-lg font-medium">No balances recorded for {year} yet</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Employee</TableHead>
                <TableHead>Leave type</TableHead>
                <TableHead>Allocated</TableHead>
                <TableHead>Used</TableHead>
                <TableHead>Carried over</TableHead>
                <TableHead>Remaining</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {balances.map((b) => (
                <TableRow key={b.id}>
                  <TableCell className="font-medium">{b.employeeName}</TableCell>
                  <TableCell>{b.leaveTypeName}</TableCell>
                  <TableCell>{b.allocated}</TableCell>
                  <TableCell>{b.used}</TableCell>
                  <TableCell>{b.carriedOver}</TableCell>
                  <TableCell>
                    {(Number(b.allocated) + Number(b.carriedOver) - Number(b.used)).toFixed(1)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Card>

      <AdjustBalanceDialog
        open={open}
        onOpenChange={setOpen}
        leaveTypes={leaveTypes}
        employees={employees}
        onSave={handleAdjust}
      />
    </>
  );
}
