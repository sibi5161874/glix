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
import { Settings2, LifeBuoy } from "lucide-react";
import type { TicketItem } from "@/lib/support";

interface PlatformTicketsTableProps {
  tickets: TicketItem[];
  onManageTicket: (ticket: TicketItem) => void;
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

export function PlatformTicketsTable({
  tickets,
  onManageTicket,
}: PlatformTicketsTableProps): React.JSX.Element {
  if (tickets.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-10 text-center">
        <LifeBuoy className="text-muted-foreground mb-3 h-10 w-10" />
        <h4 className="text-base font-semibold">No Tickets Found</h4>
        <p className="text-muted-foreground mt-1 max-w-sm text-xs">
          No support requests matched the selected filters.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-card overflow-x-auto rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Organization</TableHead>
            <TableHead>Submitter</TableHead>
            <TableHead>Subject</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Priority</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Created</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tickets.map((ticket) => (
            <TableRow
              key={ticket.id}
              className="cursor-pointer"
              onClick={() => onManageTicket(ticket)}
            >
              <TableCell className="text-foreground text-xs font-semibold">
                {ticket.orgName || "—"}
              </TableCell>
              <TableCell className="text-muted-foreground text-xs">
                {ticket.submitterName || ticket.submitterEmail || "User"}
              </TableCell>
              <TableCell className="max-w-[220px] truncate text-sm font-medium">
                {ticket.subject}
              </TableCell>
              <TableCell>
                <Badge variant="outline" className="text-xs capitalize">
                  {ticket.category.replace("_", " ")}
                </Badge>
              </TableCell>
              <TableCell>{getPriorityBadge(ticket.priority)}</TableCell>
              <TableCell>{getStatusBadge(ticket.status)}</TableCell>
              <TableCell className="text-muted-foreground text-xs">
                {formatDate(ticket.createdAt)}
              </TableCell>
              <TableCell className="text-right">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={(e) => {
                    e.stopPropagation();
                    onManageTicket(ticket);
                  }}
                  className="h-8 gap-1 px-2 text-xs"
                >
                  <Settings2 className="h-3.5 w-3.5" />
                  Manage
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
