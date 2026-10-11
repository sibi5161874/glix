"use client";

import { useState } from "react";
import {
  MessageSquare,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  UserCheck,
  Eye,
  Loader2,
  Mail,
  Phone,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { updatePlatformLead, type PlatformLeadItem } from "@/lib/platform";

interface LeadsViewProps {
  accessToken: string;
  initialLeads: PlatformLeadItem[];
  initialTotal: number;
}

export function LeadsView({ accessToken, initialLeads }: LeadsViewProps): React.JSX.Element {
  const [leads, setLeads] = useState<PlatformLeadItem[]>(initialLeads);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [activeLead, setActiveLead] = useState<PlatformLeadItem | null>(null);
  const [editStatus, setEditStatus] = useState<PlatformLeadItem["status"]>("new");
  const [editNotes, setEditNotes] = useState("");
  const [saving, setSaving] = useState(false);

  const filtered = leads.filter((item) => {
    const matchSearch =
      search.trim() === "" ||
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.email.toLowerCase().includes(search.toLowerCase()) ||
      (item.subject && item.subject.toLowerCase().includes(search.toLowerCase()));
    const matchStatus = statusFilter === "all" || item.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const openLeadModal = (lead: PlatformLeadItem): void => {
    setActiveLead(lead);
    setEditStatus(lead.status);
    setEditNotes(lead.notes ?? "");
  };

  const handleSaveTriage = async (): Promise<void> => {
    if (!activeLead) return;
    try {
      setSaving(true);
      const updated = await updatePlatformLead(accessToken, activeLead.id, {
        status: editStatus,
        notes: editNotes,
      });
      setLeads((prev) => prev.map((l) => (l.id === updated.id ? updated : l)));
      setActiveLead(null);
    } catch {
      // handled
    } finally {
      setSaving(false);
    }
  };

  const getStatusBadge = (status: PlatformLeadItem["status"]) => {
    switch (status) {
      case "new":
        return <Badge className="border-amber-500/20 bg-amber-500/10 text-amber-500">New</Badge>;
      case "contacted":
        return <Badge className="border-blue-500/20 bg-blue-500/10 text-blue-500">Contacted</Badge>;
      case "qualified":
        return (
          <Badge className="border-emerald-500/20 bg-emerald-500/10 text-emerald-500">
            Qualified
          </Badge>
        );
      case "closed":
        return <Badge className="border-slate-500/20 bg-slate-500/10 text-slate-400">Closed</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="flex items-center gap-2 text-2xl font-bold tracking-tight">
            <MessageSquare className="text-primary h-6 w-6" />
            CRM Leads & Landing Inquiries
          </h2>
          <p className="text-muted-foreground text-sm">
            Prospective clients and trial requests submitted through the public website.
          </p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="bg-card rounded-xl border p-4">
          <div className="text-muted-foreground flex items-center justify-between text-xs font-medium">
            <span>Total Inquiries</span>
            <MessageSquare className="h-4 w-4" />
          </div>
          <div className="mt-2 text-2xl font-bold">{leads.length}</div>
        </div>
        <div className="bg-card rounded-xl border p-4">
          <div className="flex items-center justify-between text-xs font-medium text-amber-500">
            <span>New Leads</span>
            <Clock className="h-4 w-4" />
          </div>
          <div className="mt-2 text-2xl font-bold text-amber-500">
            {leads.filter((l) => l.status === "new").length}
          </div>
        </div>
        <div className="bg-card rounded-xl border p-4">
          <div className="flex items-center justify-between text-xs font-medium text-blue-500">
            <span>Contacted</span>
            <UserCheck className="h-4 w-4" />
          </div>
          <div className="mt-2 text-2xl font-bold text-blue-500">
            {leads.filter((l) => l.status === "contacted").length}
          </div>
        </div>
        <div className="bg-card rounded-xl border p-4">
          <div className="flex items-center justify-between text-xs font-medium text-emerald-500">
            <span>Qualified</span>
            <CheckCircle2 className="h-4 w-4" />
          </div>
          <div className="mt-2 text-2xl font-bold text-emerald-500">
            {leads.filter((l) => l.status === "qualified").length}
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="relative min-w-[200px] flex-1">
          <Search className="text-muted-foreground absolute left-2.5 top-2.5 h-4 w-4" />
          <Input
            placeholder="Search leads by name, email, or subject..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 text-sm"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="text-muted-foreground h-4 w-4" />
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[140px] text-xs">
              <SelectValue placeholder="All Statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="new">New</SelectItem>
              <SelectItem value="contacted">Contacted</SelectItem>
              <SelectItem value="qualified">Qualified</SelectItem>
              <SelectItem value="closed">Closed</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="bg-card overflow-hidden rounded-xl border">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-muted/50 text-muted-foreground border-b text-xs">
              <tr>
                <th className="px-4 py-3">Lead / Company</th>
                <th className="px-4 py-3">Subject</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Received</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-border divide-y">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-muted-foreground py-8 text-center text-xs">
                    No matching sales inquiries found.
                  </td>
                </tr>
              ) : (
                filtered.map((item) => (
                  <tr key={item.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-3">
                      <div className="text-foreground font-medium">{item.name}</div>
                      <div className="text-muted-foreground mt-0.5 flex items-center gap-2 text-xs">
                        <span className="flex items-center gap-1">
                          <Mail className="h-3 w-3" /> {item.email}
                        </span>
                        {item.phone ? (
                          <span className="flex items-center gap-1">
                            <Phone className="h-3 w-3" /> {item.phone}
                          </span>
                        ) : null}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="max-w-xs truncate font-medium">
                        {item.subject || "General Inquiry"}
                      </div>
                      <div className="text-muted-foreground max-w-xs truncate text-xs">
                        {item.message}
                      </div>
                    </td>
                    <td className="px-4 py-3">{getStatusBadge(item.status)}</td>
                    <td className="text-muted-foreground px-4 py-3 text-xs">
                      {new Date(item.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openLeadModal(item)}
                        className="h-8 gap-1.5"
                      >
                        <Eye className="h-3.5 w-3.5" /> View
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {activeLead ? (
        <Dialog open={!!activeLead} onOpenChange={(open) => !open && setActiveLead(null)}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-base">
                <MessageSquare className="text-primary h-4 w-4" />
                Inquiry Details — {activeLead.name}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-2 text-xs">
              <div className="bg-muted/40 grid grid-cols-2 gap-3 rounded-lg p-3">
                <div>
                  <span className="text-muted-foreground block">Email</span>
                  <span className="font-medium">{activeLead.email}</span>
                </div>
                <div>
                  <span className="text-muted-foreground block">Phone</span>
                  <span className="font-medium">{activeLead.phone || "Not provided"}</span>
                </div>
              </div>
              <div>
                <span className="text-muted-foreground mb-1 block">Subject</span>
                <span className="text-sm font-semibold">
                  {activeLead.subject || "General Inquiry"}
                </span>
              </div>
              <div>
                <span className="text-muted-foreground mb-1 block">Message</span>
                <div className="bg-muted/20 whitespace-pre-wrap rounded border p-3 leading-relaxed">
                  {activeLead.message}
                </div>
              </div>
              <div className="space-y-1.5">
                <Label>Lead Status</Label>
                <Select
                  value={editStatus}
                  onValueChange={(val) => setEditStatus(val as PlatformLeadItem["status"])}
                >
                  <SelectTrigger className="text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="new">New</SelectItem>
                    <SelectItem value="contacted">Contacted</SelectItem>
                    <SelectItem value="qualified">Qualified</SelectItem>
                    <SelectItem value="closed">Closed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Internal Sales Notes</Label>
                <textarea
                  value={editNotes}
                  onChange={(e) => setEditNotes(e.target.value)}
                  placeholder="Record follow-up notes, demo scheduling, or deal terms..."
                  rows={3}
                  className="border-input bg-background w-full rounded-md border p-2.5 text-xs"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setActiveLead(null)} size="sm">
                Cancel
              </Button>
              <Button onClick={handleSaveTriage} disabled={saving} size="sm" className="gap-1.5">
                {saving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : null}
                Save Lead Update
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      ) : null}
    </div>
  );
}
