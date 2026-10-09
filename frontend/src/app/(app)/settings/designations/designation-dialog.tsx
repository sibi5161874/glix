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
import type { DesignationItem } from "@/lib/designations";
import type { CreateDesignationInput, UpdateDesignationInput } from "@app/shared/schemas";

export function DesignationDialog({
  open,
  onOpenChange,
  designation,
  onSubmit,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  designation: DesignationItem | null;
  onSubmit: (input: CreateDesignationInput | UpdateDesignationInput) => Promise<void>;
}): React.JSX.Element {
  const [title, setTitle] = useState("");
  const [level, setLevel] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (designation) {
      setTitle(designation.title);
      setLevel(designation.level !== null ? String(designation.level) : "");
    } else {
      setTitle("");
      setLevel("");
    }
    setError(null);
  }, [designation, open]);

  async function handleSubmit(e: React.FormEvent): Promise<void> {
    e.preventDefault();
    setError(null);

    if (!title.trim()) {
      setError("Please enter a job title / designation.");
      return;
    }

    const lvl = level ? parseInt(level, 10) : undefined;
    if (level && (isNaN(lvl!) || lvl! < 1 || lvl! > 20)) {
      setError("Level must be a number between 1 and 20.");
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit({
        title: title.trim(),
        level: lvl,
      });
      onOpenChange(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save designation");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[450px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>
              {designation ? "Edit Job Title" : "Add Designation / Job Title"}
            </DialogTitle>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-1.5">
              <Label htmlFor="jobTitle">Job Title / Designation *</Label>
              <Input
                id="jobTitle"
                placeholder="e.g. Senior Software Engineer, Operations Lead"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="jobLevel">Seniority / Job Level (1 to 20)</Label>
              <Input
                id="jobLevel"
                type="number"
                min="1"
                max="20"
                placeholder="e.g. 1 (Junior) - 10 (Director)"
                value={level}
                onChange={(e) => setLevel(e.target.value)}
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
              {isSubmitting ? "Saving..." : designation ? "Update Title" : "Create Title"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
