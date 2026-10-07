export interface DocumentRow {
  id: string;
  orgId: string;
  employeeId: string;
  documentTypeId: string;
  documentNumber: string | null;
  issueDate: string | null;
  expiryDate: string | null;
  filePath: string;
  fileSize: number;
  mimeType: string;
  alert90Sent: boolean;
  alert60Sent: boolean;
  alert30Sent: boolean;
  uploadedBy: string;
  createdAt: string;
  updatedAt: string;
  // Joined fields
  employeeName?: string | undefined;
  employeeCode?: string | undefined;
  documentTypeName?: string | undefined;
  documentTypeCode?: string | undefined;
  daysUntilExpiry?: number | null | undefined;
  status?: "active" | "expiring" | "expired" | undefined;
}

/** `issue_date`/`expiry_date` must come pre-cast to text (`to_char(..., 'YYYY-MM-DD')`)
 * by the query — never select them as raw `date` columns. node-pg parses `date` as a
 * JS `Date` at *local* midnight; calling `.toISOString()` on it shifts the date
 * backward by one day in any positive-UTC-offset timezone (e.g. IST, where this was
 * caught: 2026-01-01 round-tripped as 2025-12-31). Same pitfall already documented
 * and fixed for auth in db/migrations/023_employee_login_dob_text.sql. */
export function mapDocumentRow(r: Record<string, unknown>): DocumentRow {
  const expiryDateStr = (r["expiry_date"] as string | null) ?? null;
  const issueDateStr = (r["issue_date"] as string | null) ?? null;

  let daysUntilExpiry: number | null = null;
  let status: "active" | "expiring" | "expired" = "active";

  if (expiryDateStr) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const exp = new Date(`${expiryDateStr}T00:00:00`);
    const diffTime = exp.getTime() - today.getTime();
    daysUntilExpiry = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (daysUntilExpiry < 0) status = "expired";
    else if (daysUntilExpiry <= 90) status = "expiring";
    else status = "active";
  }

  const rawDocNum = r["document_number"];

  return {
    id: r["id"] as string,
    orgId: r["org_id"] as string,
    employeeId: r["employee_id"] as string,
    documentTypeId: r["document_type_id"] as string,
    documentNumber: rawDocNum ? String(rawDocNum) : null,
    issueDate: issueDateStr,
    expiryDate: expiryDateStr,
    filePath: r["file_path"] as string,
    fileSize: Number(r["file_size"]),
    mimeType: r["mime_type"] as string,
    alert90Sent: Boolean(r["alert_90_sent"]),
    alert60Sent: Boolean(r["alert_60_sent"]),
    alert30Sent: Boolean(r["alert_30_sent"]),
    uploadedBy: r["uploaded_by"] as string,
    createdAt: r["created_at"] as string,
    updatedAt: r["updated_at"] as string,
    employeeName: r["employee_name"] ? (r["employee_name"] as string) : undefined,
    employeeCode: r["employee_code"] ? (r["employee_code"] as string) : undefined,
    documentTypeName: r["document_type_name"] ? (r["document_type_name"] as string) : undefined,
    documentTypeCode: r["document_type_code"] ? (r["document_type_code"] as string) : undefined,
    daysUntilExpiry,
    status,
  };
}
