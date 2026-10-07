"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Plus, Search, Megaphone } from "lucide-react";
import {
  listAnnouncements,
  createAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
  type AnnouncementItem,
} from "@/lib/announcements";
import type { CreateAnnouncementInput, UpdateAnnouncementInput } from "@app/shared/schemas";
import { AnnouncementDialog } from "./announcement-dialog";
import { AnnouncementCard } from "./announcement-card";

export function AnnouncementsTable({
  initialAnnouncements,
  accessToken,
  canWrite,
}: {
  initialAnnouncements: AnnouncementItem[];
  accessToken: string;
  canWrite: boolean;
}): React.JSX.Element {
  const [announcements, setAnnouncements] = useState<AnnouncementItem[]>(initialAnnouncements);
  const [search, setSearch] = useState("");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");
  const [isLoading, setIsLoading] = useState(false);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<AnnouncementItem | null>(null);

  async function refresh(searchTerm = search, priority = priorityFilter): Promise<void> {
    setIsLoading(true);
    try {
      const { items } = await listAnnouncements(accessToken, {
        search: searchTerm || undefined,
        priority: priority === "all" ? undefined : (priority as AnnouncementItem["priority"]),
        limit: 50,
      });
      setAnnouncements(items);
    } catch (err) {
      console.error("Failed to load announcements", err);
    } finally {
      setIsLoading(false);
    }
  }

  function handleSearch(val: string): void {
    setSearch(val);
    void refresh(val, priorityFilter);
  }

  function handlePriorityChange(val: string): void {
    setPriorityFilter(val);
    void refresh(search, val);
  }

  async function handleSubmit(
    input: CreateAnnouncementInput | UpdateAnnouncementInput,
  ): Promise<void> {
    if (editingItem) await updateAnnouncement(accessToken, editingItem.id, input);
    else await createAnnouncement(accessToken, input as CreateAnnouncementInput);
    await refresh();
  }

  async function handleDelete(id: string): Promise<void> {
    if (!confirm("Are you sure you want to delete this announcement?")) return;
    try {
      await deleteAnnouncement(accessToken, id);
      await refresh();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to delete announcement");
    }
  }

  function openEdit(item: AnnouncementItem): void {
    setEditingItem(item);
    setDialogOpen(true);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 items-center gap-3">
          <div className="relative max-w-sm flex-1">
            <Search className="text-muted-foreground absolute left-2.5 top-2.5 h-4 w-4" />
            <Input
              placeholder="Search announcements..."
              value={search}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-9"
            />
          </div>

          <select
            value={priorityFilter}
            onChange={(e) => handlePriorityChange(e.target.value)}
            className="border-input bg-background focus:ring-primary rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2"
          >
            <option value="all">All Priorities</option>
            <option value="urgent">Urgent</option>
            <option value="high">High</option>
            <option value="normal">Normal</option>
          </select>
        </div>

        {canWrite && (
          <Button
            onClick={() => {
              setEditingItem(null);
              setDialogOpen(true);
            }}
            className="gap-2"
          >
            <Plus className="h-4 w-4" /> New Announcement
          </Button>
        )}
      </div>

      {announcements.length === 0 ? (
        <Card className="text-muted-foreground p-8 text-center">
          <Megaphone className="mx-auto mb-2 h-8 w-8 opacity-50" />
          <p>{isLoading ? "Loading announcements..." : "No announcements posted yet."}</p>
        </Card>
      ) : (
        <div className="space-y-4">
          {announcements.map((item) => (
            <AnnouncementCard
              key={item.id}
              item={item}
              canWrite={canWrite}
              onEdit={openEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      <AnnouncementDialog
        open={dialogOpen}
        onOpenChange={(open) => {
          setDialogOpen(open);
          if (!open) setEditingItem(null);
        }}
        announcement={editingItem}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
