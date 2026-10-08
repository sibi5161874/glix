import { MoreHorizontal, CheckCircle, XCircle, CreditCard } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { LoanItem } from "@/lib/loans";

function StatusBadge({ status }: { status: LoanItem["status"] }): React.JSX.Element {
  switch (status) {
    case "active":
      return <Badge className="bg-blue-600">Active</Badge>;
    case "paid_off":
      return <Badge className="bg-emerald-600">Paid Off</Badge>;
    case "pending":
      return <Badge variant="secondary">Pending Approval</Badge>;
    case "rejected":
      return <Badge variant="destructive">Rejected</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
}

export function LoanRow({
  loan,
  canApprove,
  onApprove,
  onReject,
  onRecordPayment,
}: {
  loan: LoanItem;
  canApprove: boolean;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  onRecordPayment: (loan: LoanItem) => void;
}): React.JSX.Element {
  return (
    <TableRow>
      <TableCell>
        <div className="text-foreground font-medium">{loan.employeeName || "Employee"}</div>
        <div className="text-muted-foreground text-xs">{loan.employeeCode || "—"}</div>
      </TableCell>
      <TableCell className="font-medium">
        ${parseFloat(loan.principalAmount).toLocaleString()}
      </TableCell>
      <TableCell>${parseFloat(loan.monthlyInstallment).toLocaleString()} / mo</TableCell>
      <TableCell>
        <div className="text-xs">
          <span className="font-medium text-emerald-600">
            ${parseFloat(loan.repaidAmount).toLocaleString()}
          </span>{" "}
          /{" "}
          <span className="text-muted-foreground">
            ${parseFloat(loan.remainingAmount || loan.principalAmount).toLocaleString()}
          </span>
        </div>
      </TableCell>
      <TableCell>
        <div className="w-24">
          <div className="text-muted-foreground mb-1 flex justify-between text-[10px]">
            <span>{loan.progressPercent || 0}%</span>
          </div>
          <div className="bg-muted h-1.5 w-full overflow-hidden rounded-full">
            <div
              className="h-full rounded-full bg-emerald-500"
              style={{ width: `${loan.progressPercent || 0}%` }}
            />
          </div>
        </div>
      </TableCell>
      <TableCell className="text-muted-foreground text-xs">{loan.startMonth}</TableCell>
      <TableCell>
        <StatusBadge status={loan.status} />
      </TableCell>
      <TableCell className="text-right">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              aria-label={`Actions for ${loan.employeeName ?? "loan"}`}
            >
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {canApprove && loan.status === "pending" && (
              <>
                <DropdownMenuItem
                  onClick={() => onApprove(loan.id)}
                  className="cursor-pointer gap-2 text-emerald-600"
                >
                  <CheckCircle className="h-4 w-4" /> Approve
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => onReject(loan.id)}
                  className="cursor-pointer gap-2 text-rose-600"
                >
                  <XCircle className="h-4 w-4" /> Reject
                </DropdownMenuItem>
              </>
            )}
            {canApprove && loan.status === "active" && (
              <DropdownMenuItem
                onClick={() => onRecordPayment(loan)}
                className="cursor-pointer gap-2"
              >
                <CreditCard className="h-4 w-4" /> Record Payment
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
}
