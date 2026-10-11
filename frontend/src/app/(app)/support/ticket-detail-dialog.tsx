"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LifeBuoy, Clock, User, Building } from "lucide-react";
import type { TicketItem } from "@/lib/support";

interface TicketDetailDialogProps {
  ticket: TicketItem | null;
  isOpen: boolean;
  onClose: () => void;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
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

export function TicketDetailDialog({
  ticket,
  isOpen,
  onClose,
}: TicketDetailDialogProps): React.JSX.Element {
  if (!ticket) return <></>;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <LifeBuoy className="text-primary h-5 w-5" />
            <DialogTitle className="text-base font-bold leading-snug">{ticket.subject}</DialogTitle>
          </div>
          <DialogDescription className="text-xs">
            Ticket ID: <span className="font-mono">{ticket.id}</span>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2 text-sm">
          <div className="flex flex-wrap items-center gap-2">
            {getStatusBadge(ticket.status)}
            {getPriorityBadge(ticket.priority)}
            <Badge variant="outline" className="capitalize">
              {ticket.category.replace("_", " ")}
            </Badge>
          </div>

          <div className="bg-muted/30 text-muted-foreground space-y-1.5 rounded-lg border p-3 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-foreground flex items-center gap-1.5 font-medium">
                <User className="text-muted-foreground h-3.5 w-3.5" />
                Submitted By
              </span>
              <span>{ticket.submitterName || ticket.submitterEmail || "User"}</span>
            </div>
            {ticket.orgName && (
              <div className="flex items-center justify-between">
                <span className="text-foreground flex items-center gap-1.5 font-medium">
                  <Building className="text-muted-foreground h-3.5 w-3.5" />
                  Organization
                </span>
                <span>{ticket.orgName}</span>
              </div>
            )}
            <div className="flex items-center justify-between">
              <span className="text-foreground flex items-center gap-1.5 font-medium">
                <Clock className="text-muted-foreground h-3.5 w-3.5" />
                Created At
              </span>
              <span>{formatDate(ticket.createdAt)}</span>
            </div>
            {ticket.assigneeName && (
              <div className="flex items-center justify-between border-t pt-1.5">
                <span className="text-foreground font-medium">Assigned Engineer</span>
                <span className="text-primary font-semibold">{ticket.assigneeName}</span>
              </div>
            )}
          </div>

          <div>
            <div className="text-muted-foreground mb-1.5 text-xs font-semibold">Description</div>
            <div className="bg-background whitespace-pre-wrap rounded-md border p-3 text-xs leading-relaxed">
              {ticket.body}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
