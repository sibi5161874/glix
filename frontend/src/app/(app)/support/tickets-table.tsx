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
import { Button } from "@/components/ui/button";
import { Eye, LifeBuoy } from "lucide-react";
import type { TicketItem } from "@/lib/support";

interface TicketsTableProps {
  tickets: TicketItem[];
  onViewTicket: (ticket: TicketItem) => void;
}

function getStatusBadge(status: TicketItem["status"]): React.JSX.Element {
  switch (status) {
    case "open":
      return <Badge className="bg-blue-600 text-white hover:bg-blue-700">Open</Badge>;
    case "in_progress":
      return <Badge className="bg-amber-600 text-white hover:bg-amber-700">In Progress</Badge>;
    case "resolved":
      return <Badge className="bg-emerald-600 text-white hover:bg-emerald-700">Resolved</Badge>;
    case "closed":
      return <Badge variant="secondary">Closed</Badge>;
  }
}

function getPriorityBadge(priority: TicketItem["priority"]): React.JSX.Element {
  switch (priority) {
    case "urgent":
      return <Badge variant="destructive">Urgent</Badge>;
    case "high":
      return <Badge className="bg-orange-600 text-white hover:bg-orange-700">High</Badge>;
    case "medium":
      return <Badge variant="outline">Medium</Badge>;
    case "low":
      return <Badge variant="secondary">Low</Badge>;
  }
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function TicketsTable({ tickets, onViewTicket }: TicketsTableProps): React.JSX.Element {
  if (tickets.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-10 text-center">
        <LifeBuoy className="text-muted-foreground mb-3 h-10 w-10" />
        <h4 className="text-base font-semibold">No Support Tickets</h4>
        <p className="text-muted-foreground mt-1 max-w-sm text-xs">
          No tickets found matching your current filter. Click &quot;New Request&quot; to submit a
          support ticket.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Subject</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Priority</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Submitted By</TableHead>
            <TableHead>Created</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tickets.map((ticket) => (
            <TableRow
              key={ticket.id}
              className="cursor-pointer"
              onClick={() => onViewTicket(ticket)}
            >
              <TableCell className="max-w-[240px] truncate font-medium">{ticket.subject}</TableCell>
              <TableCell>
                <Badge variant="outline" className="text-xs capitalize">
                  {ticket.category.replace("_", " ")}
                </Badge>
              </TableCell>
              <TableCell>{getPriorityBadge(ticket.priority)}</TableCell>
              <TableCell>{getStatusBadge(ticket.status)}</TableCell>
              <TableCell className="text-muted-foreground text-xs">
                {ticket.submitterName || ticket.submitterEmail || "User"}
              </TableCell>
              <TableCell className="text-muted-foreground text-xs">
                {formatDate(ticket.createdAt)}
              </TableCell>
              <TableCell className="text-right">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={(e) => {
                    e.stopPropagation();
                    onViewTicket(ticket);
                  }}
                  className="h-8 px-2"
                >
                  <Eye className="mr-1 h-4 w-4" />
                  View
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
