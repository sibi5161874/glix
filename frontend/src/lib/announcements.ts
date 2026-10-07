import type {
  CreateAnnouncementInput,
  UpdateAnnouncementInput,
  AnnouncementFilter,
} from "@app/shared/schemas";
import { apiFetch } from "./api";

export interface AnnouncementItem {
  id: string;
  orgId: string;
  title: string;
  body: string;
  priority: "normal" | "high" | "urgent";
  publishAt: string;
  expiresAt: string | null;
  attachmentUrl: string | null;
  createdBy: string;
  authorName?: string;
  createdAt: string;
  updatedAt: string;
}

function qs(params: Record<string, string | number | undefined>): string {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== "") search.set(key, String(value));
  }
  const str = search.toString();
  return str ? `?${str}` : "";
}

export interface AnnouncementListResponse {
  items: AnnouncementItem[];
  total: number;
  page: number;
  limit: number;
}

export async function listAnnouncements(
  accessToken: string,
  filter: Partial<AnnouncementFilter> = {},
): Promise<AnnouncementListResponse> {
  const query = qs(filter as Record<string, string | number | undefined>);
  return apiFetch<AnnouncementListResponse>(`/v1/announcements${query}`, { accessToken });
}

export async function getAnnouncement(accessToken: string, id: string): Promise<AnnouncementItem> {
  return apiFetch<AnnouncementItem>(`/v1/announcements/${id}`, { accessToken });
}

export async function createAnnouncement(
  accessToken: string,
  input: CreateAnnouncementInput,
): Promise<AnnouncementItem> {
  return apiFetch<AnnouncementItem>("/v1/announcements", {
    method: "POST",
    accessToken,
    body: JSON.stringify(input),
  });
}

export async function updateAnnouncement(
  accessToken: string,
  id: string,
  input: UpdateAnnouncementInput,
): Promise<AnnouncementItem> {
  return apiFetch<AnnouncementItem>(`/v1/announcements/${id}`, {
    method: "PUT",
    accessToken,
    body: JSON.stringify(input),
  });
}

export async function deleteAnnouncement(accessToken: string, id: string): Promise<void> {
  await apiFetch(`/v1/announcements/${id}`, {
    method: "DELETE",
    accessToken,
  });
}
