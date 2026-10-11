"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PlusCircle, Search, LifeBuoy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TicketsTable } from "./tickets-table";
import { CreateTicketDialog } from "./create-ticket-dialog";
import { TicketDetailDialog } from "./ticket-detail-dialog";
import type { TicketItem } from "@/lib/support";

interface SupportViewProps {
  accessToken: string;
  initialTickets: TicketItem[];
  isAdmin: boolean;
}

export function SupportView({
  accessToken,
  initialTickets,
  isAdmin,
}: SupportViewProps): React.JSX.Element {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [viewingTicket, setViewingTicket] = useState<TicketItem | null>(null);

  const filteredTickets = initialTickets.filter((t) => {
    if (statusFilter !== "all" && t.status !== statusFilter) return false;
    if (categoryFilter !== "all" && t.category !== categoryFilter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        t.subject.toLowerCase().includes(q) ||
        t.body.toLowerCase().includes(q) ||
        (t.submitterName && t.submitterName.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const handleSuccess = (): void => {
    router.refresh();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="flex items-center gap-2 text-2xl font-bold tracking-tight">
            <LifeBuoy className="text-primary h-6 w-6" />
            Support Desk & Tickets
          </h2>
          <p className="text-muted-foreground mt-1 text-sm">
            {isAdmin
              ? "Manage organization support queries, track progress, and submit technical requests."
              : "Submit help requests and track resolutions from the support team."}
          </p>
        </div>
        <Button onClick={() => setIsCreateOpen(true)} className="shrink-0 gap-1.5">
          <PlusCircle className="h-4 w-4" />
          New Request
        </Button>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="text-muted-foreground absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2" />
          <Input
            placeholder="Search tickets by subject, description or submitter..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="w-full sm:w-44">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger>
              <SelectValue placeholder="All Statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="open">Open</SelectItem>
              <SelectItem value="in_progress">In Progress</SelectItem>
              <SelectItem value="resolved">Resolved</SelectItem>
              <SelectItem value="closed">Closed</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="w-full sm:w-48">
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger>
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="technical">Technical</SelectItem>
              <SelectItem value="billing">Billing</SelectItem>
              <SelectItem value="hr_feature">HR Feature</SelectItem>
              <SelectItem value="bug">Bug Report</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <TicketsTable tickets={filteredTickets} onViewTicket={(ticket) => setViewingTicket(ticket)} />

      <CreateTicketDialog
        accessToken={accessToken}
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onSuccess={handleSuccess}
      />

      <TicketDetailDialog
        ticket={viewingTicket}
        isOpen={Boolean(viewingTicket)}
        onClose={() => setViewingTicket(null)}
      />
    </div>
  );
}
