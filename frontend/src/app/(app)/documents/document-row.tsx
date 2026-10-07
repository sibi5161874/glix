import { Download, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import type { DocumentItem } from "@/lib/documents";

function ExpiryCell({
  expiryDate,
  daysUntilExpiry,
}: {
  expiryDate: string | null;
  daysUntilExpiry?: number | null | undefined;
}): React.JSX.Element {
  if (!expiryDate) return <span className="text-muted-foreground text-xs">No expiry</span>;
  const days = daysUntilExpiry;
  return (
    <div>
      <div>{expiryDate}</div>
      {days !== null && days !== undefined && (
        <div className="text-xs">
          {days < 0 ? (
            <span className="font-medium text-rose-600">Expired {Math.abs(days)}d ago</span>
          ) : days === 0 ? (
            <span className="font-medium text-rose-600">Expires today</span>
          ) : days <= 90 ? (
            <span className="font-medium text-amber-600">Expires in {days}d</span>
          ) : (
            <span className="text-muted-foreground">{days} days left</span>
          )}
        </div>
      )}
    </div>
  );
}

function StatusBadge({ status }: { status?: string | undefined }): React.JSX.Element {
  if (status === "expired") return <Badge variant="destructive">Expired</Badge>;
  if (status === "expiring")
    return <Badge className="bg-amber-500 text-white hover:bg-amber-600">Expiring Soon</Badge>;
  return <Badge className="bg-emerald-500 text-white hover:bg-emerald-600">Active</Badge>;
}

export function DocumentRow({
  doc,
  canWrite,
  isDeleting,
  onDelete,
  onDownload,
}: {
  doc: DocumentItem;
  canWrite: boolean;
  isDeleting: boolean;
  onDelete: (id: string) => void;
  onDownload: (doc: DocumentItem) => void;
}): React.JSX.Element {
  return (
    <TableRow>
      <TableCell>
        <div className="font-medium">{doc.employeeName || "—"}</div>
        <div className="text-muted-foreground text-xs">{doc.employeeCode}</div>
      </TableCell>
      <TableCell>
        <span className="font-medium">{doc.documentTypeName}</span>
      </TableCell>
      <TableCell className="font-mono text-xs">{doc.documentNumber || "—"}</TableCell>
      <TableCell>
        <ExpiryCell expiryDate={doc.expiryDate} daysUntilExpiry={doc.daysUntilExpiry} />
      </TableCell>
      <TableCell>
        <StatusBadge status={doc.status} />
      </TableCell>
      <TableCell>
        <div className="text-muted-foreground text-xs">
          {doc.mimeType.split("/")[1]?.toUpperCase() || "FILE"} &bull;{" "}
          {(doc.fileSize / 1024 / 1024).toFixed(2)} MB
        </div>
      </TableCell>
      <TableCell className="text-right">
        <div className="flex items-center justify-end gap-1">
          <Button
            variant="ghost"
            size="icon"
            title="Download document"
            onClick={() => onDownload(doc)}
          >
            <Download className="h-4 w-4" />
          </Button>
          {canWrite && (
            <Button
              variant="ghost"
              size="icon"
              title="Delete document"
              onClick={() => onDelete(doc.id)}
              disabled={isDeleting}
              className="text-destructive hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      </TableCell>
    </TableRow>
  );
}
