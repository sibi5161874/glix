"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, ShieldAlert, Ticket, Clock, CheckCircle2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PlatformTicketsTable } from "./platform-tickets-table";
import { UpdateTicketDialog } from "./update-ticket-dialog";
import type { TicketItem } from "@/lib/support";

interface PlatformSupportViewProps {
  accessToken: string;
  initialTickets: TicketItem[];
}

export function PlatformSupportView({
  accessToken,
  initialTickets,
}: PlatformSupportViewProps): React.JSX.Element {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [managingTicket, setManagingTicket] = useState<TicketItem | null>(null);

  const filteredTickets = initialTickets.filter((t) => {
    if (statusFilter !== "all" && t.status !== statusFilter) return false;
    if (categoryFilter !== "all" && t.category !== categoryFilter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        t.subject.toLowerCase().includes(q) ||
        t.body.toLowerCase().includes(q) ||
        (t.orgName && t.orgName.toLowerCase().includes(q)) ||
        (t.submitterName && t.submitterName.toLowerCase().includes(q)) ||
        (t.submitterEmail && t.submitterEmail.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const openCount = initialTickets.filter((t) => t.status === "open").length;
  const inProgressCount = initialTickets.filter((t) => t.status === "in_progress").length;
  const resolvedCount = initialTickets.filter(
    (t) => t.status === "resolved" || t.status === "closed",
  ).length;

  const handleSuccess = (): void => {
    router.refresh();
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="flex items-center gap-2 text-3xl font-semibold">
          <ShieldAlert className="text-primary h-7 w-7" />
          Platform Support Desk
        </h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Review, triage, and manage customer support requests from all organizations.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <span className="text-muted-foreground text-xs font-medium">Total Tickets</span>
            <Ticket className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{initialTickets.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <span className="text-muted-foreground text-xs font-medium">Open / Unresolved</span>
            <Clock className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{openCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <span className="text-muted-foreground text-xs font-medium">In Progress</span>
            <Clock className="h-4 w-4 text-amber-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600">{inProgressCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <span className="text-muted-foreground text-xs font-medium">Resolved / Closed</span>
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600">{resolvedCount}</div>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="text-muted-foreground absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2" />
          <Input
            placeholder="Search by organization, subject, submitter or keyword..."
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

      <PlatformTicketsTable
        tickets={filteredTickets}
        onManageTicket={(t) => setManagingTicket(t)}
      />

      <UpdateTicketDialog
        accessToken={accessToken}
        ticket={managingTicket}
        isOpen={Boolean(managingTicket)}
        onClose={() => setManagingTicket(null)}
        onSuccess={handleSuccess}
      />
    </div>
  );
}
