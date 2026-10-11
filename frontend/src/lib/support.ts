import { apiFetch } from "./api";
import type { CreateTicketInput, UpdateTicketInput, TicketFilter } from "@app/shared/schemas";

export interface TicketItem {
  id: string;
  orgId: string | null;
  userId: string;
  subject: string;
  body: string;
  category: "billing" | "technical" | "hr_feature" | "bug";
  priority: "low" | "medium" | "high" | "urgent";
  status: "open" | "in_progress" | "resolved" | "closed";
  assignedTo: string | null;
  createdAt: string;
  updatedAt: string;
  submitterName?: string | undefined;
  submitterEmail?: string | undefined;
  orgName?: string | undefined;
  assigneeName?: string | undefined;
}

export interface TicketsResponse {
  items: TicketItem[];
  total: number;
  page: number;
  limit: number;
}

function buildQueryString(filter?: TicketFilter): string {
  if (!filter) return "";
  const query = new URLSearchParams();
  if (filter.status) query.set("status", filter.status);
  if (filter.category) query.set("category", filter.category);
  if (filter.search) query.set("search", filter.search);
  if (filter.page) query.set("page", String(filter.page));
  if (filter.limit) query.set("limit", String(filter.limit));
  const str = query.toString();
  return str ? `?${str}` : "";
}

export async function createTicket(
  accessToken: string,
  input: CreateTicketInput,
): Promise<TicketItem> {
  return apiFetch<TicketItem>("/v1/support", {
    method: "POST",
    accessToken,
    body: JSON.stringify(input),
  });
}

export async function listMyTickets(
  accessToken: string,
  filter?: TicketFilter,
): Promise<TicketsResponse> {
  return apiFetch<TicketsResponse>(`/v1/support/mine${buildQueryString(filter)}`, { accessToken });
}

export async function listOrgTickets(
  accessToken: string,
  filter?: TicketFilter,
): Promise<TicketsResponse> {
  return apiFetch<TicketsResponse>(`/v1/support${buildQueryString(filter)}`, { accessToken });
}

export async function getTicket(accessToken: string, id: string): Promise<TicketItem> {
  return apiFetch<TicketItem>(`/v1/support/${id}`, { accessToken });
}

export async function listPlatformTickets(
  accessToken: string,
  filter?: TicketFilter,
): Promise<TicketsResponse> {
  return apiFetch<TicketsResponse>(`/v1/platform/support${buildQueryString(filter)}`, {
    accessToken,
  });
}

export async function updatePlatformTicket(
  accessToken: string,
  id: string,
  input: UpdateTicketInput,
): Promise<TicketItem> {
  return apiFetch<TicketItem>(`/v1/platform/support/${id}`, {
    method: "PUT",
    accessToken,
    body: JSON.stringify(input),
  });
}
