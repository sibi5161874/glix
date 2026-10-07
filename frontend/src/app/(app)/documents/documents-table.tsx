"use client";

import { useState } from "react";
import { Upload, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { UploadDocumentDialog } from "./upload-document-dialog";
import { DocumentSummaryCards } from "./document-summary-cards";
import { DocumentRow } from "./document-row";
import {
  deleteDocument,
  uploadDocument,
  type DocumentItem,
  type DocumentSummary,
  type DocumentType,
} from "@/lib/documents";
import type { EmployeeListItem } from "@/lib/employees";

export function DocumentsTable({
  initialDocuments,
  summary,
  documentTypes,
  employees,
  accessToken,
  canWrite,
}: {
  initialDocuments: DocumentItem[];
  summary: DocumentSummary;
  documentTypes: DocumentType[];
  employees: EmployeeListItem[];
  accessToken: string;
  canWrite: boolean;
}): React.JSX.Element {
  const [documents, setDocuments] = useState<DocumentItem[]>(initialDocuments);
  const [search, setSearch] = useState("");
  const [selectedType, setSelectedType] = useState<string>("");
  const [selectedStatus, setSelectedStatus] = useState<string>("");
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const filteredDocs = documents.filter((doc) => {
    if (selectedType && doc.documentTypeId !== selectedType) return false;
    if (selectedStatus && doc.status !== selectedStatus) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      const matchNumber = doc.documentNumber?.toLowerCase().includes(q);
      const matchType = doc.documentTypeName?.toLowerCase().includes(q);
      const matchEmp = doc.employeeName?.toLowerCase().includes(q);
      const matchCode = doc.employeeCode?.toLowerCase().includes(q);
      if (!matchNumber && !matchType && !matchEmp && !matchCode) return false;
    }
    return true;
  });

  async function handleUpload(formData: FormData): Promise<void> {
    const newDoc = await uploadDocument(accessToken, formData);
    setDocuments((prev) => [newDoc, ...prev]);
  }

  async function handleDelete(id: string): Promise<void> {
    if (!confirm("Are you sure you want to delete this document? This action cannot be undone.")) {
      return;
    }
    setDeletingId(id);
    try {
      await deleteDocument(accessToken, id);
      setDocuments((prev) => prev.filter((d) => d.id !== id));
    } finally {
      setDeletingId(null);
    }
  }

  function handleDownload(doc: DocumentItem): void {
    const downloadUrl = `${process.env["NEXT_PUBLIC_API_URL"] ?? "http://localhost:5000"}/v1/documents/${doc.id}/download`;
    fetch(downloadUrl, { headers: { Authorization: `Bearer ${accessToken}` } })
      .then((res) => {
        if (!res.ok) throw new Error("Download failed");
        return res.blob();
      })
      .then((blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        const ext = doc.filePath.split(".").pop() || "bin";
        a.download = `${doc.employeeCode || "emp"}-${(doc.documentTypeName || "doc").toLowerCase()}.${ext}`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);
      })
      .catch((err) => alert(err.message || "Failed to download document"));
  }

  return (
    <div className="space-y-6">
      <DocumentSummaryCards summary={summary} />

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 flex-wrap items-center gap-3">
          <div className="relative min-w-[240px] flex-1 sm:max-w-xs">
            <Search className="text-muted-foreground absolute left-3 top-2.5 h-4 w-4" />
            <Input
              placeholder="Search by ID, name, code..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 text-sm"
            />
          </div>

          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="border-input bg-background focus:ring-primary rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2"
          >
            <option value="">All Document Types</option>
            {documentTypes.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="border-input bg-background focus:ring-primary rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2"
          >
            <option value="">All Statuses</option>
            <option value="active">Active</option>
            <option value="expiring">Expiring Soon</option>
            <option value="expired">Expired</option>
          </select>
        </div>

        {canWrite && (
          <Button onClick={() => setIsUploadOpen(true)} className="gap-2">
            <Upload className="h-4 w-4" />
            Upload Document
          </Button>
        )}
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Employee</TableHead>
              <TableHead>Document Type</TableHead>
              <TableHead>Document No.</TableHead>
              <TableHead>Expiry Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>File</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredDocs.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-muted-foreground py-8 text-center">
                  No documents found matching your criteria.
                </TableCell>
              </TableRow>
            ) : (
              filteredDocs.map((doc) => (
                <DocumentRow
                  key={doc.id}
                  doc={doc}
                  canWrite={canWrite}
                  isDeleting={deletingId === doc.id}
                  onDelete={handleDelete}
                  onDownload={handleDownload}
                />
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <UploadDocumentDialog
        open={isUploadOpen}
        onOpenChange={setIsUploadOpen}
        documentTypes={documentTypes}
        employees={employees}
        onUpload={handleUpload}
      />
    </div>
  );
}
