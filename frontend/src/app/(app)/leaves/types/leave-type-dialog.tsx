"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { LeaveType } from "@/lib/leave";

export interface LeaveTypeFormValues {
  name: string;
  code: string;
  daysPerYear: number;
  isPaid: boolean;
  requiresApproval: boolean;
}

const EMPTY: LeaveTypeFormValues = {
  name: "",
  code: "",
  daysPerYear: 0,
  isPaid: true,
  requiresApproval: true,
};

export function LeaveTypeDialog({
  open,
  onOpenChange,
  leaveType,
  onSave,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  leaveType: LeaveType | null;
  onSave: (values: LeaveTypeFormValues) => Promise<void>;
}): React.JSX.Element {
  const [values, setValues] = useState<LeaveTypeFormValues>(EMPTY);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setValues(
      leaveType
        ? {
            name: leaveType.name,
            code: leaveType.code,
            daysPerYear: Number(leaveType.daysPerYear),
            isPaid: leaveType.isPaid,
            requiresApproval: leaveType.requiresApproval,
          }
        : EMPTY,
    );
  }, [leaveType, open]);

  async function handleSubmit(e: React.FormEvent): Promise<void> {
    e.preventDefault();
    setIsSaving(true);
    try {
      await onSave(values);
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{leaveType ? "Edit leave type" : "Add leave type"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="lt-name">Name</Label>
            <Input
              id="lt-name"
              value={values.name}
              onChange={(e) => setValues((v) => ({ ...v, name: e.target.value }))}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lt-code">Code</Label>
            <Input
              id="lt-code"
              value={values.code}
              disabled={Boolean(leaveType)}
              onChange={(e) =>
                setValues((v) => ({
                  ...v,
                  code: e.target.value.toLowerCase().replace(/\s+/g, "_"),
                }))
              }
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lt-days">Days per year</Label>
            <Input
              id="lt-days"
              type="number"
              min={0}
              max={365}
              value={values.daysPerYear}
              onChange={(e) => setValues((v) => ({ ...v, daysPerYear: Number(e.target.value) }))}
              required
            />
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={values.isPaid}
              onChange={(e) => setValues((v) => ({ ...v, isPaid: e.target.checked }))}
            />
            Paid leave
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={values.requiresApproval}
              onChange={(e) => setValues((v) => ({ ...v, requiresApproval: e.target.checked }))}
            />
            Requires approval
          </label>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSaving}>
              {isSaving ? "Saving..." : "Save"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
