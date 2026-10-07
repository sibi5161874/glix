"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search } from "lucide-react";
import {
  listLoans,
  getLoanSummary,
  createLoan,
  approveLoan,
  rejectLoan,
  recordLoanPayment,
  type LoanItem,
  type LoanSummary,
} from "@/lib/loans";
import type { EmployeeListItem } from "@/lib/employees";
import type { CreateLoanInput, RecordLoanPaymentInput } from "@app/shared/schemas";
import { CreateLoanDialog } from "./create-loan-dialog";
import { RecordPaymentDialog } from "./record-payment-dialog";
import { LoanSummaryCards } from "./loan-summary-cards";
import { LoanRow } from "./loan-row";

export function LoansTable({
  initialLoans,
  summary: initialSummary,
  employees,
  accessToken,
  canApprove,
  canCreate,
}: {
  initialLoans: LoanItem[];
  summary: LoanSummary;
  employees: EmployeeListItem[];
  accessToken: string;
  canApprove: boolean;
  canCreate: boolean;
}): React.JSX.Element {
  const [loans, setLoans] = useState<LoanItem[]>(initialLoans);
  const [summary, setSummary] = useState<LoanSummary>(initialSummary);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [isLoading, setIsLoading] = useState(false);

  const [createOpen, setCreateOpen] = useState(false);
  const [paymentLoan, setPaymentLoan] = useState<LoanItem | null>(null);

  async function refresh(searchTerm = search, status = statusFilter): Promise<void> {
    setIsLoading(true);
    try {
      const [res, summaryRes] = await Promise.all([
        listLoans(accessToken, {
          search: searchTerm || undefined,
          status: status === "all" ? undefined : (status as LoanItem["status"]),
          limit: 100,
        }),
        getLoanSummary(accessToken),
      ]);
      setLoans(res.items);
      setSummary(summaryRes);
    } catch (err) {
      console.error("Failed to load loans", err);
    } finally {
      setIsLoading(false);
    }
  }

  function handleSearch(val: string): void {
    setSearch(val);
    void refresh(val, statusFilter);
  }

  function handleStatusChange(val: string): void {
    setStatusFilter(val);
    void refresh(search, val);
  }

  async function handleCreateLoan(input: CreateLoanInput): Promise<void> {
    await createLoan(accessToken, input);
    await refresh();
  }

  async function handleApprove(id: string): Promise<void> {
    if (!confirm("Are you sure you want to approve this loan application?")) return;
    try {
      await approveLoan(accessToken, id);
      await refresh();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to approve loan");
    }
  }

  async function handleReject(id: string): Promise<void> {
    const reason = prompt("Enter reason for rejection (optional):");
    if (reason === null) return;
    try {
      await rejectLoan(accessToken, id, { loanId: id, reason: reason || undefined });
      await refresh();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to reject loan");
    }
  }

  async function handleRecordPayment(loanId: string, input: RecordLoanPaymentInput): Promise<void> {
    await recordLoanPayment(accessToken, loanId, input);
    await refresh();
  }

  return (
    <div className="space-y-6">
      <LoanSummaryCards summary={summary} />

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 items-center gap-3">
          <div className="relative max-w-sm flex-1">
            <Search className="text-muted-foreground absolute left-2.5 top-2.5 h-4 w-4" />
            <Input
              placeholder="Search by employee or reason..."
              value={search}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-9"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => handleStatusChange(e.target.value)}
            className="border-input bg-background focus:ring-primary rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2"
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="active">Active</option>
            <option value="paid_off">Paid Off</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>

        {canCreate && (
          <Button onClick={() => setCreateOpen(true)} className="gap-2">
            <Plus className="h-4 w-4" /> Apply for Loan
          </Button>
        )}
      </div>

      <div className="bg-card rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Employee</TableHead>
              <TableHead>Principal</TableHead>
              <TableHead>Monthly</TableHead>
              <TableHead>Repaid / Remaining</TableHead>
              <TableHead>Progress</TableHead>
              <TableHead>Start Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loans.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-muted-foreground h-32 text-center">
                  {isLoading ? "Loading loans..." : "No loans or salary advances found."}
                </TableCell>
              </TableRow>
            ) : (
              loans.map((loan) => (
                <LoanRow
                  key={loan.id}
                  loan={loan}
                  canApprove={canApprove}
                  onApprove={handleApprove}
                  onReject={handleReject}
                  onRecordPayment={setPaymentLoan}
                />
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <CreateLoanDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        employees={employees}
        onSubmit={handleCreateLoan}
      />

      <RecordPaymentDialog
        open={!!paymentLoan}
        onOpenChange={(open) => !open && setPaymentLoan(null)}
        loan={paymentLoan}
        onSubmit={handleRecordPayment}
      />
    </div>
  );
}
