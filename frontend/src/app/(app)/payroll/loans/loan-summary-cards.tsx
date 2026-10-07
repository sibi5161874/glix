import { Banknote, Clock, CreditCard, Check } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { LoanSummary } from "@/lib/loans";

export function LoanSummaryCards({ summary }: { summary: LoanSummary }): React.JSX.Element {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Active Loans</CardTitle>
          <Banknote className="h-4 w-4 text-blue-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{summary.activeCount}</div>
          <p className="text-muted-foreground text-xs">Currently in repayment</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Pending Requests</CardTitle>
          <Clock className="h-4 w-4 text-amber-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{summary.pendingCount}</div>
          <p className="text-muted-foreground text-xs">Awaiting review</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Total Outstanding</CardTitle>
          <CreditCard className="h-4 w-4 text-rose-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            ${parseFloat(summary.totalOutstanding).toLocaleString()}
          </div>
          <p className="text-muted-foreground text-xs">Remaining balance</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Total Recovered</CardTitle>
          <Check className="h-4 w-4 text-emerald-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            ${parseFloat(summary.totalRepaid).toLocaleString()}
          </div>
          <p className="text-muted-foreground text-xs">Successfully paid back</p>
        </CardContent>
      </Card>
    </div>
  );
}
