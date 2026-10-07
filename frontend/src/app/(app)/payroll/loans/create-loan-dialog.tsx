"use client";

import { useState } from "react";
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
import { Alert, AlertDescription } from "@/components/ui/alert";
import type { EmployeeListItem } from "@/lib/employees";
import type { CreateLoanInput } from "@app/shared/schemas";

export function CreateLoanDialog({
  open,
  onOpenChange,
  employees,
  preselectedEmployeeId,
  onSubmit,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  employees: EmployeeListItem[];
  preselectedEmployeeId?: string;
  onSubmit: (input: CreateLoanInput) => Promise<void>;
}): React.JSX.Element {
  const [employeeId, setEmployeeId] = useState(preselectedEmployeeId || "");
  const [principalAmount, setPrincipalAmount] = useState("");
  const [monthlyInstallment, setMonthlyInstallment] = useState("");
  const [termMonths, setTermMonths] = useState("12");
  const [startMonth, setStartMonth] = useState(new Date().toISOString().split("T")[0]!);
  const [reason, setReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handlePrincipalChange(val: string) {
    setPrincipalAmount(val);
    const p = parseFloat(val);
    const t = parseInt(termMonths, 10);
    if (!isNaN(p) && !isNaN(t) && t > 0) {
      setMonthlyInstallment((p / t).toFixed(2));
    }
  }

  function handleTermChange(val: string) {
    setTermMonths(val);
    const p = parseFloat(principalAmount);
    const t = parseInt(val, 10);
    if (!isNaN(p) && !isNaN(t) && t > 0) {
      setMonthlyInstallment((p / t).toFixed(2));
    }
  }

  async function handleSubmit(e: React.FormEvent): Promise<void> {
    e.preventDefault();
    setError(null);

    const targetEmpId = preselectedEmployeeId || employeeId;
    if (!targetEmpId) {
      setError("Please select an employee.");
      return;
    }

    const principal = parseFloat(principalAmount);
    const installment = parseFloat(monthlyInstallment);
    const term = parseInt(termMonths, 10);

    if (isNaN(principal) || principal <= 0) {
      setError("Please enter a valid principal amount.");
      return;
    }
    if (isNaN(installment) || installment <= 0) {
      setError("Please enter a valid monthly installment.");
      return;
    }
    if (isNaN(term) || term <= 0) {
      setError("Please enter a valid term in months.");
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit({
        employeeId: targetEmpId,
        principalAmount: principal,
        monthlyInstallment: installment,
        termMonths: term,
        startMonth,
        reason: reason.trim() || undefined,
      });
      onOpenChange(false);
      setEmployeeId(preselectedEmployeeId || "");
      setPrincipalAmount("");
      setMonthlyInstallment("");
      setTermMonths("12");
      setReason("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create loan application");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Apply for Employee Loan</DialogTitle>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {!preselectedEmployeeId && (
              <div className="space-y-1.5">
                <Label htmlFor="employeeId">Employee *</Label>
                <select
                  id="employeeId"
                  value={employeeId}
                  onChange={(e) => setEmployeeId(e.target.value)}
                  className="border-input bg-background focus:ring-primary w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2"
                  required
                >
                  <option value="">Select an employee...</option>
                  {employees.map((emp) => (
                    <option key={emp.id} value={emp.id}>
                      {emp.employeeCode} — {emp.firstName} {emp.lastName}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="principalAmount">Principal Amount *</Label>
                <Input
                  id="principalAmount"
                  type="number"
                  step="0.01"
                  placeholder="e.g. 5000"
                  value={principalAmount}
                  onChange={(e) => handlePrincipalChange(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="termMonths">Term (Months) *</Label>
                <Input
                  id="termMonths"
                  type="number"
                  min="1"
                  max="120"
                  placeholder="e.g. 12"
                  value={termMonths}
                  onChange={(e) => handleTermChange(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="monthlyInstallment">Monthly Deduction *</Label>
                <Input
                  id="monthlyInstallment"
                  type="number"
                  step="0.01"
                  placeholder="e.g. 416.67"
                  value={monthlyInstallment}
                  onChange={(e) => setMonthlyInstallment(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="startMonth">Deduction Start Date *</Label>
                <Input
                  id="startMonth"
                  type="date"
                  value={startMonth}
                  onChange={(e) => setStartMonth(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="reason">Purpose / Reason</Label>
              <textarea
                id="reason"
                rows={3}
                placeholder="Reason for salary advance or loan request..."
                className="border-input bg-background focus:ring-primary w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Submit Application"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
