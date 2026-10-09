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
import type { NotificationTemplateItem } from "@/lib/settings";
import type { CreateTemplateInput, UpdateTemplateInput } from "@app/shared/schemas";

export function TemplateDialog({
  open,
  onOpenChange,
  template,
  onSubmit,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  template: NotificationTemplateItem | null;
  onSubmit: (input: CreateTemplateInput | UpdateTemplateInput) => Promise<void>;
}): React.JSX.Element {
  const [channel, setChannel] = useState<"email" | "whatsapp">("email");
  const [key, setKey] = useState("");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (template) {
      setChannel(template.channel);
      setKey(template.key);
      setSubject(template.subject || "");
      setBody(template.body);
    } else {
      setChannel("email");
      setKey("");
      setSubject("");
      setBody("");
    }
    setError(null);
  }, [template, open]);

  async function handleSubmit(e: React.FormEvent): Promise<void> {
    e.preventDefault();
    setError(null);

    if (!key.trim()) {
      setError("Template key is required.");
      return;
    }
    if (!body.trim()) {
      setError("Template message body cannot be empty.");
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit({
        channel,
        key: key.trim(),
        subject: channel === "email" ? subject.trim() || null : null,
        body: body.trim(),
        isActive: true,
      });
      onOpenChange(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save template");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>
              {template ? `Customize Template (${template.key})` : "Create Message Template"}
            </DialogTitle>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="channel">Notification Channel</Label>
                <select
                  id="channel"
                  value={channel}
                  disabled={!!template}
                  onChange={(e) => setChannel(e.target.value as "email" | "whatsapp")}
                  className="border-input bg-background focus:ring-primary w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2"
                >
                  <option value="email">Email Notification</option>
                  <option value="whatsapp">WhatsApp Message</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="key">Template Identifier Key *</Label>
                <Input
                  id="key"
                  placeholder="e.g. employee_welcome, leave_approved"
                  value={key}
                  disabled={!!template}
                  onChange={(e) => setKey(e.target.value.toLowerCase().replace(/\s+/g, "_"))}
                  required
                />
              </div>
            </div>

            {channel === "email" && (
              <div className="space-y-1.5">
                <Label htmlFor="subject">Email Subject</Label>
                <Input
                  id="subject"
                  placeholder="e.g. Your leave request has been approved"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                />
              </div>
            )}

            <div className="space-y-1.5">
              <Label htmlFor="body">
                Message Body (Supports variables like `{"{{employee_name}}"}`) *
              </Label>
              <textarea
                id="body"
                rows={6}
                placeholder="Write your template message body here..."
                className="border-input bg-background focus:ring-primary w-full rounded-md border px-3 py-2 font-mono text-sm text-xs focus:outline-none focus:ring-2"
                value={body}
                onChange={(e) => setBody(e.target.value)}
                required
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
              {isSubmitting ? "Saving..." : "Save Template"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
