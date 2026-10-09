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
import type { DepartmentItem } from "@/lib/departments";
import type { CreateDepartmentInput, UpdateDepartmentInput } from "@app/shared/schemas";

export function DepartmentDialog({
  open,
  onOpenChange,
  department,
  departments,
  onSubmit,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  department: DepartmentItem | null;
  departments: DepartmentItem[];
  onSubmit: (input: CreateDepartmentInput | UpdateDepartmentInput) => Promise<void>;
}): React.JSX.Element {
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [parentId, setParentId] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (department) {
      setName(department.name);
      setCode(department.code || "");
      setParentId(department.parentId || "");
    } else {
      setName("");
      setCode("");
      setParentId("");
    }
    setError(null);
  }, [department, open]);

  async function handleSubmit(e: React.FormEvent): Promise<void> {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError("Please enter a department name.");
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit({
        name: name.trim(),
        code: code.trim() || undefined,
        parentId: parentId || null,
      });
      onOpenChange(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save department");
    } finally {
      setIsSubmitting(false);
    }
  }

  const validParents = departments.filter((d) => !department || d.id !== department.id);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[450px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{department ? "Edit Department" : "Add Department"}</DialogTitle>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-1.5">
              <Label htmlFor="deptName">Department Name *</Label>
              <Input
                id="deptName"
                placeholder="e.g. Engineering, Sales, Human Resources"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="deptCode">Department Code</Label>
              <Input
                id="deptCode"
                placeholder="e.g. ENG, SLS, HR"
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="parentId">Parent Department (Optional Hierarchy)</Label>
              <select
                id="parentId"
                value={parentId}
                onChange={(e) => setParentId(e.target.value)}
                className="border-input bg-background focus:ring-primary w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2"
              >
                <option value="">None (Top-level Department)</option>
                {validParents.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name} {d.code ? `(${d.code})` : ""}
                  </option>
                ))}
              </select>
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
              {isSubmitting ? "Saving..." : department ? "Update Department" : "Create Department"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
