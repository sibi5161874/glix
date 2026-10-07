"use client";

import { useState } from "react";
import { Download, Trash2, Upload, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { UploadDocumentDialog } from "../../documents/upload-document-dialog";
import {
  deleteDocument,
  uploadDocument,
  type DocumentItem,
  type DocumentType,
} from "@/lib/documents";
import type { EmployeeListItem } from "@/lib/employees";

export function EmployeeDocumentsTab({
  initialDocuments,
  documentTypes,
  employee,
  accessToken,
  canWrite,
}: {
  initialDocuments: DocumentItem[];
  documentTypes: DocumentType[];
  employee: EmployeeListItem;
  accessToken: string;
  canWrite: boolean;
}): React.JSX.Element {
  const [documents, setDocuments] = useState<DocumentItem[]>(initialDocuments);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  async function handleUpload(formData: FormData): Promise<void> {
    const newDoc = await uploadDocument(accessToken, formData);
    setDocuments((prev) => [newDoc, ...prev]);
  }

  async function handleDelete(id: string): Promise<void> {
    if (!confirm("Are you sure you want to delete this document?")) return;
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
    fetch(downloadUrl, {
      headers: { Authorization: `Bearer ${accessToken}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Download failed");
        return res.blob();
      })
      .then((blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        const ext = doc.filePath.split(".").pop() || "bin";
        a.download = `${employee.employeeCode}-${(doc.documentTypeName || "doc").toLowerCase()}.${ext}`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);
      })
      .catch((err) => alert(err.message || "Failed to download document"));
  }

  return (
    <div className="space-y-4">
      {canWrite && (
        <div className="flex justify-end">
          <Button onClick={() => setIsUploadOpen(true)} className="gap-2" size="sm">
            <Upload className="h-4 w-4" />
            Upload Document
          </Button>
        </div>
      )}

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Document Type</TableHead>
              <TableHead>Document No.</TableHead>
              <TableHead>Issue Date</TableHead>
              <TableHead>Expiry Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>File</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {documents.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-muted-foreground py-8 text-center">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <FileText className="h-8 w-8 opacity-40" />
                    <p>No documents uploaded for this employee yet.</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              documents.map((doc) => {
                const days = doc.daysUntilExpiry;

                return (
                  <TableRow key={doc.id}>
                    <TableCell className="font-medium">{doc.documentTypeName}</TableCell>
                    <TableCell className="font-mono text-xs">{doc.documentNumber || "—"}</TableCell>
                    <TableCell className="text-xs">{doc.issueDate || "—"}</TableCell>
                    <TableCell>
                      {doc.expiryDate ? (
                        <div>
                          <div>{doc.expiryDate}</div>
                          {days !== null && days !== undefined && (
                            <div className="text-xs">
                              {days < 0 ? (
                                <span className="font-medium text-rose-600">
                                  Expired {Math.abs(days)}d ago
                                </span>
                              ) : days === 0 ? (
                                <span className="font-medium text-rose-600">Expires today</span>
                              ) : days <= 90 ? (
                                <span className="font-medium text-amber-600">
                                  Expires in {days}d
                                </span>
                              ) : (
                                <span className="text-muted-foreground">{days} days left</span>
                              )}
                            </div>
                          )}
                        </div>
                      ) : (
                        <span className="text-muted-foreground text-xs">No expiry</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {doc.status === "expired" ? (
                        <Badge variant="destructive">Expired</Badge>
                      ) : doc.status === "expiring" ? (
                        <Badge className="bg-amber-500 text-white hover:bg-amber-600">
                          Expiring Soon
                        </Badge>
                      ) : (
                        <Badge className="bg-emerald-500 text-white hover:bg-emerald-600">
                          Active
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-muted-foreground text-xs">
                      {doc.mimeType.split("/")[1]?.toUpperCase() || "FILE"} &bull;{" "}
                      {(doc.fileSize / 1024 / 1024).toFixed(2)} MB
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          title="Download document"
                          onClick={() => handleDownload(doc)}
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                        {canWrite && (
                          <Button
                            variant="ghost"
                            size="icon"
                            title="Delete document"
                            onClick={() => handleDelete(doc.id)}
                            disabled={deletingId === doc.id}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      <UploadDocumentDialog
        open={isUploadOpen}
        onOpenChange={setIsUploadOpen}
        documentTypes={documentTypes}
        employees={[employee]}
        preselectedEmployeeId={employee.id}
        onUpload={handleUpload}
      />
    </div>
  );
}
