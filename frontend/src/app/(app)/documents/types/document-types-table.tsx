"use client";

import { useState } from "react";
import { Plus, Edit2, Trash2 } from "lucide-react";
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
import { DocumentTypeDialog, type DocumentTypeFormValues } from "./document-type-dialog";
import {
  createDocumentType,
  updateDocumentType,
  deleteDocumentType,
  type DocumentType,
} from "@/lib/documents";

export function DocumentTypesTable({
  initialDocumentTypes,
  accessToken,
  canWrite,
}: {
  initialDocumentTypes: DocumentType[];
  accessToken: string;
  canWrite: boolean;
}): React.JSX.Element {
  const [types, setTypes] = useState<DocumentType[]>(initialDocumentTypes);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingType, setEditingType] = useState<DocumentType | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  async function handleSave(values: DocumentTypeFormValues): Promise<void> {
    if (editingType) {
      const updated = await updateDocumentType(accessToken, editingType.id, values);
      setTypes((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
    } else {
      const created = await createDocumentType(accessToken, values);
      setTypes((prev) => [...prev, created]);
    }
  }

  async function handleDelete(id: string): Promise<void> {
    if (!confirm("Are you sure you want to delete this document type?")) return;
    setDeletingId(id);
    try {
      await deleteDocumentType(accessToken, id);
      setTypes((prev) => prev.filter((t) => t.id !== id));
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="space-y-4">
      {canWrite && (
        <div className="flex justify-end">
          <Button
            onClick={() => {
              setEditingType(null);
              setDialogOpen(true);
            }}
            className="gap-2"
          >
            <Plus className="h-4 w-4" />
            Add Document Type
          </Button>
        </div>
      )}

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Code</TableHead>
              <TableHead>Requires Expiry</TableHead>
              <TableHead>Alert Trigger Days</TableHead>
              <TableHead>Retention</TableHead>
              <TableHead>Status</TableHead>
              {canWrite && <TableHead className="text-right">Actions</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {types.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={canWrite ? 7 : 6}
                  className="text-muted-foreground py-8 text-center"
                >
                  No document types configured.
                </TableCell>
              </TableRow>
            ) : (
              types.map((type) => (
                <TableRow key={type.id}>
                  <TableCell className="font-medium">{type.name}</TableCell>
                  <TableCell className="text-muted-foreground font-mono text-xs">
                    {type.code}
                  </TableCell>
                  <TableCell>
                    {type.requiresExpiry ? (
                      <Badge variant="outline">Mandatory</Badge>
                    ) : (
                      <span className="text-muted-foreground text-xs">Optional</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {type.alertDays?.length > 0 ? (
                      <div className="flex flex-wrap gap-1">
                        {type.alertDays.map((d) => (
                          <span
                            key={d}
                            className="bg-secondary text-secondary-foreground rounded px-1.5 py-0.5 text-xs"
                          >
                            {d}d
                          </span>
                        ))}
                      </div>
                    ) : (
                      <span className="text-muted-foreground text-xs">None</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {type.retentionDays ? (
                      <span className="text-xs">
                        {type.retentionDays} days ({(type.retentionDays / 365).toFixed(1)} yrs)
                      </span>
                    ) : (
                      <span className="text-muted-foreground text-xs">Indefinite</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {type.isActive ? (
                      <Badge className="bg-emerald-500 text-white hover:bg-emerald-600">
                        Active
                      </Badge>
                    ) : (
                      <Badge variant="secondary">Inactive</Badge>
                    )}
                  </TableCell>
                  {canWrite && (
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setEditingType(type);
                            setDialogOpen(true);
                          }}
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(type.id)}
                          disabled={deletingId === type.id}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  )}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <DocumentTypeDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        documentType={editingType}
        onSave={handleSave}
      />
    </div>
  );
}
