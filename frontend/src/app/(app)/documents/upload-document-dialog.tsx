"use client";

import { useState } from "react";
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
import type { DocumentType } from "@/lib/documents";
import type { EmployeeListItem } from "@/lib/employees";

export function UploadDocumentDialog({
  open,
  onOpenChange,
  documentTypes,
  employees,
  preselectedEmployeeId,
  onUpload,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  documentTypes: DocumentType[];
  employees: EmployeeListItem[];
  preselectedEmployeeId?: string;
  onUpload: (formData: FormData) => Promise<void>;
}): React.JSX.Element {
  const [employeeId, setEmployeeId] = useState(preselectedEmployeeId || "");
  const [documentTypeId, setDocumentTypeId] = useState("");
  const [documentNumber, setDocumentNumber] = useState("");
  const [issueDate, setIssueDate] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const selectedType = documentTypes.find((t) => t.id === documentTypeId);

  async function handleSubmit(e: React.FormEvent): Promise<void> {
    e.preventDefault();
    setError(null);

    const targetEmpId = preselectedEmployeeId || employeeId;
    if (!targetEmpId) {
      setError("Please select an employee.");
      return;
    }
    if (!documentTypeId) {
      setError("Please select a document type.");
      return;
    }
    if (selectedType?.requiresExpiry && !expiryDate) {
      setError(`Document type '${selectedType.name}' requires an expiry date.`);
      return;
    }
    if (!file) {
      setError("Please select a document file to upload.");
      return;
    }

    const formData = new FormData();
    formData.append("employeeId", targetEmpId);
    formData.append("documentTypeId", documentTypeId);
    if (documentNumber) formData.append("documentNumber", documentNumber);
    if (issueDate) formData.append("issueDate", issueDate);
    if (expiryDate) formData.append("expiryDate", expiryDate);
    formData.append("file", file);

    setIsUploading(true);
    try {
      await onUpload(formData);
      onOpenChange(false);
      // Reset fields
      setEmployeeId(preselectedEmployeeId || "");
      setDocumentTypeId("");
      setDocumentNumber("");
      setIssueDate("");
      setExpiryDate("");
      setFile(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to upload document");
    } finally {
      setIsUploading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Upload Document</DialogTitle>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {!preselectedEmployeeId && (
              <div className="space-y-1.5">
                <Label htmlFor="employeeId">Employee *</Label>
                <select
                  id="employeeId"
                  value={employeeId}
                  onChange={(e) => setEmployeeId(e.target.value)}
                  className="border-input bg-background focus:ring-primary w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2"
                  required
                >
                  <option value="">Select an employee...</option>
                  {employees.map((emp) => (
                    <option key={emp.id} value={emp.id}>
                      {emp.employeeCode} — {emp.firstName} {emp.lastName}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div className="space-y-1.5">
              <Label htmlFor="documentTypeId">Document Type *</Label>
              <select
                id="documentTypeId"
                value={documentTypeId}
                onChange={(e) => setDocumentTypeId(e.target.value)}
                className="border-input bg-background focus:ring-primary w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2"
                required
              >
                <option value="">Select document category...</option>
                {documentTypes.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name} {t.requiresExpiry ? "(Requires Expiry)" : ""}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="documentNumber">Document / ID Number</Label>
              <Input
                id="documentNumber"
                placeholder="e.g. 784-1990-1234567-1 or P1234567"
                value={documentNumber}
                onChange={(e) => setDocumentNumber(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="issueDate">Issue Date</Label>
                <Input
                  id="issueDate"
                  type="date"
                  value={issueDate}
                  onChange={(e) => setIssueDate(e.target.value)}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="expiryDate">
                  Expiry Date {selectedType?.requiresExpiry ? "*" : ""}
                </Label>
                <Input
                  id="expiryDate"
                  type="date"
                  value={expiryDate}
                  onChange={(e) => setExpiryDate(e.target.value)}
                  required={selectedType?.requiresExpiry}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="file">Document File (PDF, PNG, JPG, WebP - max 50MB) *</Label>
              <Input
                id="file"
                type="file"
                accept=".pdf,.png,.jpg,.jpeg,.webp"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                required
              />
              {file && (
                <p className="text-muted-foreground text-xs">
                  Selected: {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
                </p>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isUploading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isUploading}>
              {isUploading ? "Uploading..." : "Upload Document"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
