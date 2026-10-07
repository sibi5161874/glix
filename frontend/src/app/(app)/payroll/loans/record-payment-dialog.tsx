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
import type { LoanItem } from "@/lib/loans";
import type { RecordLoanPaymentInput } from "@app/shared/schemas";

export function RecordPaymentDialog({
  open,
  onOpenChange,
  loan,
  onSubmit,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  loan: LoanItem | null;
  onSubmit: (loanId: string, input: RecordLoanPaymentInput) => Promise<void>;
}): React.JSX.Element {
  const [amount, setAmount] = useState("");
  const [paymentDate, setPaymentDate] = useState(new Date().toISOString().split("T")[0]!);
  const [note, setNote] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!loan) return <></>;

  async function handleSubmit(e: React.FormEvent): Promise<void> {
    e.preventDefault();
    setError(null);
    if (!loan) return;

    const paymentAmount = parseFloat(amount || loan.monthlyInstallment);
    if (isNaN(paymentAmount) || paymentAmount <= 0) {
      setError("Please enter a valid payment amount.");
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(loan.id, {
        amount: paymentAmount,
        paymentDate: paymentDate || undefined,
        note: note.trim() || undefined,
      });
      onOpenChange(false);
      setAmount("");
      setNote("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to record payment");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[450px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Record Loan Payment</DialogTitle>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="bg-muted/50 space-y-1 rounded-lg p-3 text-sm">
              <p className="text-foreground font-medium">
                {loan.employeeName || "Employee"} ({loan.employeeCode || "—"})
              </p>
              <div className="text-muted-foreground flex justify-between text-xs">
                <span>Principal: ${parseFloat(loan.principalAmount).toLocaleString()}</span>
                <span>
                  Outstanding: $
                  {parseFloat(loan.remainingAmount || loan.principalAmount).toLocaleString()}
                </span>
              </div>
              <div className="text-muted-foreground text-xs">
                Monthly Schedule: ${parseFloat(loan.monthlyInstallment).toLocaleString()} / mo
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="paymentAmount">Payment Amount ($) *</Label>
              <Input
                id="paymentAmount"
                type="number"
                step="0.01"
                placeholder={loan.monthlyInstallment}
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="paymentDate">Payment Date *</Label>
              <Input
                id="paymentDate"
                type="date"
                value={paymentDate}
                onChange={(e) => setPaymentDate(e.target.value)}
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="paymentNote">Note / Reference</Label>
              <Input
                id="paymentNote"
                placeholder="e.g. Payroll deduction, Bank wire ref #123"
                value={note}
                onChange={(e) => setNote(e.target.value)}
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
              {isSubmitting ? "Recording..." : "Record Payment"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
