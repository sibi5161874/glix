"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import type { AnnouncementItem } from "@/lib/announcements";
import type { CreateAnnouncementInput, UpdateAnnouncementInput } from "@app/shared/schemas";

export function AnnouncementDialog({
  open,
  onOpenChange,
  announcement,
  onSubmit,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  announcement: AnnouncementItem | null;
  onSubmit: (input: CreateAnnouncementInput | UpdateAnnouncementInput) => Promise<void>;
}): React.JSX.Element {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [priority, setPriority] = useState<"normal" | "high" | "urgent">("normal");
  const [publishAt, setPublishAt] = useState("");
  const [expiresAt, setExpiresAt] = useState("");
  const [attachmentUrl, setAttachmentUrl] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (announcement) {
      setTitle(announcement.title);
      setBody(announcement.body);
      setPriority(announcement.priority);
      setPublishAt(announcement.publishAt ? announcement.publishAt.slice(0, 16) : "");
      setExpiresAt(announcement.expiresAt ? announcement.expiresAt.slice(0, 16) : "");
      setAttachmentUrl(announcement.attachmentUrl || "");
    } else {
      setTitle("");
      setBody("");
      setPriority("normal");
      setPublishAt("");
      setExpiresAt("");
      setAttachmentUrl("");
    }
  }, [announcement, open]);

  async function handleSubmit(e: React.FormEvent): Promise<void> {
    e.preventDefault();
    setError(null);

    if (!title.trim()) {
      setError("Please enter an announcement title.");
      return;
    }
    if (!body.trim()) {
      setError("Please enter announcement body content.");
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit({
        title: title.trim(),
        body: body.trim(),
        priority,
        publishAt: publishAt ? new Date(publishAt).toISOString() : undefined,
        expiresAt: expiresAt ? new Date(expiresAt).toISOString() : undefined,
        attachmentUrl: attachmentUrl.trim() || undefined,
      });
      onOpenChange(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save announcement");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{announcement ? "Edit Announcement" : "Create Announcement"}</DialogTitle>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-1.5">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                placeholder="e.g. Office Closed for National Day"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="priority">Priority</Label>
                <select
                  id="priority"
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as "normal" | "high" | "urgent")}
                  className="border-input bg-background focus:ring-primary w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2"
                >
                  <option value="normal">Normal (Default)</option>
                  <option value="high">High Priority</option>
                  <option value="urgent">Urgent Banner</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="expiresAt">Expiry (Optional)</Label>
                <Input
                  id="expiresAt"
                  type="datetime-local"
                  value={expiresAt}
                  onChange={(e) => setExpiresAt(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="body">Message Content *</Label>
              <textarea
                id="body"
                rows={5}
                placeholder="Write your announcement details here..."
                className="border-input bg-background focus:ring-primary w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2"
                value={body}
                onChange={(e) => setBody(e.target.value)}
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="attachmentUrl">Attachment Link (Optional)</Label>
              <Input
                id="attachmentUrl"
                type="url"
                placeholder="https://example.com/handbook.pdf"
                value={attachmentUrl}
                onChange={(e) => setAttachmentUrl(e.target.value)}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting
                ? "Saving..."
                : announcement
                  ? "Update Announcement"
                  : "Post Announcement"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
