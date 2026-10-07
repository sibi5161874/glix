import type {
  CreateDocumentTypeInput,
  UpdateDocumentTypeInput,
  UpdateDocumentInput,
  DocumentFilter,
} from "@app/shared/schemas";
import { apiFetch } from "./api";

export interface DocumentType {
  id: string;
  orgId: string;
  name: string;
  code: string;
  requiresExpiry: boolean;
  alertDays: number[];
  retentionDays: number | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface DocumentItem {
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
  employeeName?: string;
  employeeCode?: string;
  documentTypeName?: string;
  documentTypeCode?: string;
  daysUntilExpiry?: number | null;
  status?: "active" | "expiring" | "expired";
}

export interface DocumentListResponse {
  items: DocumentItem[];
  total: number;
  page: number;
  limit: number;
}

export interface DocumentSummary {
  total: number;
  active: number;
  expiring30: number;
  expiring60: number;
  expiring90: number;
  expired: number;
}

function qs(params: Record<string, string | number | undefined>): string {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== "") search.set(key, String(value));
  }
  const str = search.toString();
  return str ? `?${str}` : "";
}

export async function listDocumentTypes(accessToken: string): Promise<DocumentType[]> {
  return apiFetch<DocumentType[]>("/v1/document-types", { accessToken });
}

export async function createDocumentType(
  accessToken: string,
  input: CreateDocumentTypeInput,
): Promise<DocumentType> {
  return apiFetch<DocumentType>("/v1/document-types", {
    method: "POST",
    accessToken,
    body: JSON.stringify(input),
  });
}

export async function updateDocumentType(
  accessToken: string,
  id: string,
  input: UpdateDocumentTypeInput,
): Promise<DocumentType> {
  return apiFetch<DocumentType>(`/v1/document-types/${id}`, {
    method: "PUT",
    accessToken,
    body: JSON.stringify(input),
  });
}

export async function deleteDocumentType(accessToken: string, id: string): Promise<void> {
  await apiFetch(`/v1/document-types/${id}`, { method: "DELETE", accessToken });
}

export async function listDocuments(
  accessToken: string,
  filter: Partial<DocumentFilter> = {},
): Promise<DocumentListResponse> {
  const query = qs(filter as Record<string, string | number | undefined>);
  return apiFetch<DocumentListResponse>(`/v1/documents${query}`, { accessToken });
}

export async function getDocumentSummary(accessToken: string): Promise<DocumentSummary> {
  return apiFetch<DocumentSummary>("/v1/documents/summary", { accessToken });
}

export async function getDocument(accessToken: string, id: string): Promise<DocumentItem> {
  return apiFetch<DocumentItem>(`/v1/documents/${id}`, { accessToken });
}

export async function uploadDocument(
  accessToken: string,
  formData: FormData,
): Promise<DocumentItem> {
  return apiFetch<DocumentItem>("/v1/documents", {
    method: "POST",
    accessToken,
    body: formData,
  });
}

export async function updateDocument(
  accessToken: string,
  id: string,
  input: UpdateDocumentInput,
): Promise<DocumentItem> {
  return apiFetch<DocumentItem>(`/v1/documents/${id}`, {
    method: "PUT",
    accessToken,
    body: JSON.stringify(input),
  });
}

export async function deleteDocument(accessToken: string, id: string): Promise<void> {
  await apiFetch(`/v1/documents/${id}`, { method: "DELETE", accessToken });
}
