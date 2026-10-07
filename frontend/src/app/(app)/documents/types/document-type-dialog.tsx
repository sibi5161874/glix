"use client";

import { useEffect, useState } from "react";
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
import type { DocumentType } from "@/lib/documents";

export interface DocumentTypeFormValues {
  name: string;
  code: string;
  requiresExpiry: boolean;
  alertDays: number[];
  retentionDays: number | null;
  isActive: boolean;
}

const EMPTY: DocumentTypeFormValues = {
  name: "",
  code: "",
  requiresExpiry: true,
  alertDays: [90, 60, 30],
  retentionDays: 3650,
  isActive: true,
};

export function DocumentTypeDialog({
  open,
  onOpenChange,
  documentType,
  onSave,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  documentType: DocumentType | null;
  onSave: (values: DocumentTypeFormValues) => Promise<void>;
}): React.JSX.Element {
  const [values, setValues] = useState<DocumentTypeFormValues>(EMPTY);
  const [alertDaysInput, setAlertDaysInput] = useState("90, 60, 30");
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (documentType) {
      setValues({
        name: documentType.name,
        code: documentType.code,
        requiresExpiry: documentType.requiresExpiry,
        alertDays: documentType.alertDays,
        retentionDays: documentType.retentionDays,
        isActive: documentType.isActive,
      });
      setAlertDaysInput(documentType.alertDays.join(", "));
    } else {
      setValues(EMPTY);
      setAlertDaysInput("90, 60, 30");
    }
    setError(null);
  }, [documentType, open]);

  async function handleSubmit(e: React.FormEvent): Promise<void> {
    e.preventDefault();
    setError(null);

    const parsedAlertDays = alertDaysInput
      .split(",")
      .map((s) => parseInt(s.trim(), 10))
      .filter((n) => !isNaN(n) && n > 0);

    const payload = {
      ...values,
      alertDays: parsedAlertDays,
    };

    setIsSaving(true);
    try {
      await onSave(payload);
      onOpenChange(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save document type");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{documentType ? "Edit Document Type" : "Add Document Type"}</DialogTitle>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            {error && <p className="text-destructive text-sm font-medium">{error}</p>}

            <div className="space-y-1.5">
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                placeholder="e.g. Health Insurance"
                value={values.name}
                onChange={(e) => setValues({ ...values, name: e.target.value })}
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="code">Code Identifier *</Label>
              <Input
                id="code"
                placeholder="e.g. health_insurance"
                value={values.code}
                onChange={(e) =>
                  setValues({
                    ...values,
                    code: e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, "_"),
                  })
                }
                disabled={Boolean(documentType)}
                required
              />
              <p className="text-muted-foreground text-xs">
                Unique lowercase slug used for system exports.
              </p>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="alertDays">Alert Trigger Days (comma separated)</Label>
              <Input
                id="alertDays"
                placeholder="90, 60, 30"
                value={alertDaysInput}
                onChange={(e) => setAlertDaysInput(e.target.value)}
              />
              <p className="text-muted-foreground text-xs">
                Days before expiry to issue automated compliance alerts.
              </p>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="retentionDays">Retention Period (Days)</Label>
              <Input
                id="retentionDays"
                type="number"
                placeholder="e.g. 1825 (5 years)"
                value={values.retentionDays ?? ""}
                onChange={(e) =>
                  setValues({
                    ...values,
                    retentionDays: e.target.value ? Number(e.target.value) : null,
                  })
                }
              />
            </div>

            <div className="flex flex-col gap-2 pt-2">
              <label className="flex items-center gap-2 text-sm font-medium">
                <input
                  type="checkbox"
                  checked={values.requiresExpiry}
                  onChange={(e) => setValues({ ...values, requiresExpiry: e.target.checked })}
                  className="rounded border-gray-300"
                />
                Requires Expiry Date Tracking
              </label>

              <label className="flex items-center gap-2 text-sm font-medium">
                <input
                  type="checkbox"
                  checked={values.isActive}
                  onChange={(e) => setValues({ ...values, isActive: e.target.checked })}
                  className="rounded border-gray-300"
                />
                Active (Enabled for uploads)
              </label>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSaving}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSaving}>
              {isSaving ? "Saving..." : "Save"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
