"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ShieldAlert, Loader2, Building, User, Clock } from "lucide-react";
import { updatePlatformTicket, type TicketItem } from "@/lib/support";
import type { TicketStatus, TicketPriority } from "@app/shared/schemas";

interface UpdateTicketDialogProps {
  accessToken: string;
  ticket: TicketItem | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
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

export function UpdateTicketDialog({
  accessToken,
  ticket,
  isOpen,
  onClose,
  onSuccess,
}: UpdateTicketDialogProps): React.JSX.Element {
  const [status, setStatus] = useState<TicketItem["status"]>(ticket?.status ?? "open");
  const [priority, setPriority] = useState<TicketItem["priority"]>(ticket?.priority ?? "medium");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!ticket) return <></>;

  const handleSave = async (): Promise<void> => {
    try {
      setIsSubmitting(true);
      setError(null);
      await updatePlatformTicket(accessToken, ticket.id, {
        status: status as typeof TicketStatus._type,
        priority: priority as typeof TicketPriority._type,
      });
      onSuccess();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update ticket");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ShieldAlert className="text-primary h-5 w-5" />
            Manage Support Ticket
          </DialogTitle>
          <DialogDescription className="text-xs">
            Ticket ID: <span className="font-mono">{ticket.id}</span>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2 text-sm">
          {error && (
            <div className="bg-destructive/10 text-destructive rounded-md p-3 text-xs font-medium">
              {error}
            </div>
          )}

          <div className="bg-muted/40 space-y-1.5 rounded-lg border p-3 text-xs">
            <div className="text-foreground mb-1 text-sm font-semibold">{ticket.subject}</div>
            <div className="text-muted-foreground flex items-center justify-between">
              <span className="text-foreground flex items-center gap-1.5 font-medium">
                <Building className="h-3.5 w-3.5" /> Organization
              </span>
              <span>{ticket.orgName || "—"}</span>
            </div>
            <div className="text-muted-foreground flex items-center justify-between">
              <span className="text-foreground flex items-center gap-1.5 font-medium">
                <User className="h-3.5 w-3.5" /> Submitter
              </span>
              <span>{ticket.submitterName || ticket.submitterEmail || "User"}</span>
            </div>
            <div className="text-muted-foreground flex items-center justify-between">
              <span className="text-foreground flex items-center gap-1.5 font-medium">
                <Clock className="h-3.5 w-3.5" /> Created
              </span>
              <span>{formatDate(ticket.createdAt)}</span>
            </div>
          </div>

          <div>
            <div className="text-muted-foreground mb-1 text-xs font-semibold">
              Issue Description
            </div>
            <div className="bg-background max-h-36 overflow-y-auto whitespace-pre-wrap rounded-md border p-3 text-xs leading-relaxed">
              {ticket.body}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 border-t pt-3">
            <div className="space-y-1.5">
              <Label className="text-xs">Update Status</Label>
              <Select
                value={status}
                onValueChange={(val) => setStatus(val as TicketItem["status"])}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="open">Open</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="resolved">Resolved</SelectItem>
                  <SelectItem value="closed">Closed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs">Update Priority</Label>
              <Select
                value={priority}
                onValueChange={(val) => setPriority(val as TicketItem["priority"])}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving Changes...
              </>
            ) : (
              "Save Changes"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
