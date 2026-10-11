"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { FileText } from "lucide-react";
import type { InvoiceItem } from "@/lib/billing";

interface InvoicesTableProps {
  invoices: InvoiceItem[];
}

function getStatusBadge(status: InvoiceItem["status"]): React.JSX.Element {
  switch (status) {
    case "paid":
      return <Badge className="bg-emerald-600 text-white hover:bg-emerald-700">Paid</Badge>;
    case "open":
      return <Badge variant="secondary">Open</Badge>;
    case "draft":
      return <Badge variant="outline">Draft</Badge>;
    case "void":
      return <Badge variant="destructive">Void</Badge>;
  }
}

function formatDate(iso: string | null): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function InvoicesTable({ invoices }: InvoicesTableProps): React.JSX.Element {
  if (invoices.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
        <FileText className="text-muted-foreground mb-2 h-8 w-8" />
        <h4 className="text-sm font-semibold">No Invoices Yet</h4>
        <p className="text-muted-foreground mt-1 max-w-sm text-xs">
          Invoices will be automatically generated whenever your subscription renews or when a tier
          change is confirmed.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Invoice #</TableHead>
            <TableHead>Date Issued</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Gateway</TableHead>
            <TableHead>Paid Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {invoices.map((inv) => (
            <TableRow key={inv.id}>
              <TableCell className="font-mono text-xs font-semibold">{inv.invoiceNumber}</TableCell>
              <TableCell className="text-sm">{formatDate(inv.issuedAt)}</TableCell>
              <TableCell className="text-sm font-medium">
                {inv.amount} {inv.currency}
              </TableCell>
              <TableCell>{getStatusBadge(inv.status)}</TableCell>
              <TableCell className="text-muted-foreground text-xs capitalize">
                {inv.gateway || "System / Manual"}
              </TableCell>
              <TableCell className="text-muted-foreground text-xs">
                {formatDate(inv.paidAt)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
