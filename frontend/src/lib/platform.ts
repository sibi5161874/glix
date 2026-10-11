import { apiFetch } from "./api";
import type {
  PlatformOrgFilter,
  CreatePlatformOrgInput,
  UpdatePlanInput,
  PlatformTeamInput,
} from "@app/shared/schemas";
import type { PlanItem } from "./billing";

export interface PlatformOrgItem {
  id: string;
  name: string;
  slug: string;
  currency: string;
  tier: string;
  planId: string;
  planName: string;
  employeeCount: number;
  userCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface PlatformOrgsResponse {
  items: PlatformOrgItem[];
  total: number;
  page: number;
  limit: number;
}

export interface PlatformOverviewStats {
  orgCount: number;
  activeSubscriptionsCount: number;
  mrrAed: number;
  openTicketsCount: number;
  recentOrgs: { id: string; name: string; slug: string; tier: string; createdAt: string }[];
}

export interface PlatformTeamMember {
  id: string;
  email: string;
  fullName: string;
  role: "owner" | "admin" | "support";
  createdAt: string;
}

export interface PlatformSettingItem {
  key: string;
  value: Record<string, unknown>;
  updatedBy: string | null;
  updatedAt: string;
}

export async function getPlatformOverview(accessToken: string): Promise<PlatformOverviewStats> {
  return apiFetch<PlatformOverviewStats>("/v1/platform/overview", { accessToken });
}

export async function listPlatformOrgs(
  accessToken: string,
  filter?: PlatformOrgFilter,
): Promise<PlatformOrgsResponse> {
  const query = new URLSearchParams();
  if (filter?.search) query.set("search", filter.search);
  if (filter?.planSlug) query.set("planSlug", filter.planSlug);
  if (filter?.page) query.set("page", String(filter.page));
  if (filter?.limit) query.set("limit", String(filter.limit));
  const queryString = query.toString() ? `?${query.toString()}` : "";
  return apiFetch<PlatformOrgsResponse>(`/v1/platform/organizations${queryString}`, {
    accessToken,
  });
}

export async function createPlatformOrg(
  accessToken: string,
  input: CreatePlatformOrgInput,
): Promise<{ id: string }> {
  return apiFetch<{ id: string }>("/v1/platform/organizations", {
    method: "POST",
    accessToken,
    body: JSON.stringify(input),
  });
}

export async function listPlatformPlans(accessToken: string): Promise<PlanItem[]> {
  return apiFetch<PlanItem[]>("/v1/platform/plans", { accessToken });
}

export async function updatePlatformPlan(
  accessToken: string,
  id: string,
  input: UpdatePlanInput,
): Promise<void> {
  await apiFetch(`/v1/platform/plans/${id}`, {
    method: "PUT",
    accessToken,
    body: JSON.stringify(input),
  });
}

export async function listPlatformSettings(accessToken: string): Promise<PlatformSettingItem[]> {
  return apiFetch<PlatformSettingItem[]>("/v1/platform/settings", { accessToken });
}

export async function getPlatformSetting(
  accessToken: string,
  key: string,
): Promise<Record<string, unknown> | null> {
  return apiFetch<Record<string, unknown> | null>(`/v1/platform/settings/${key}`, { accessToken });
}

export async function updatePlatformSetting(
  accessToken: string,
  key: string,
  value: Record<string, unknown>,
): Promise<void> {
  await apiFetch(`/v1/platform/settings/${key}`, {
    method: "PUT",
    accessToken,
    body: JSON.stringify({ value }),
  });
}

export async function listPlatformTeam(accessToken: string): Promise<PlatformTeamMember[]> {
  return apiFetch<PlatformTeamMember[]>("/v1/platform/team", { accessToken });
}

export async function addPlatformTeamMember(
  accessToken: string,
  input: PlatformTeamInput,
): Promise<PlatformTeamMember> {
  return apiFetch<PlatformTeamMember>("/v1/platform/team", {
    method: "POST",
    accessToken,
    body: JSON.stringify(input),
  });
}

export interface PlatformLeadItem {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  subject: string | null;
  message: string;
  status: "new" | "contacted" | "qualified" | "closed";
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

export async function submitContactLead(input: {
  name: string;
  email: string;
  phone?: string | null;
  subject?: string | null;
  message: string;
}): Promise<{ id: string; message: string }> {
  return apiFetch<{ id: string; message: string }>("/v1/public/contact", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export async function listPlatformLeads(
  accessToken: string,
  filter?: { search?: string; status?: string; limit?: number; offset?: number },
): Promise<{ items: PlatformLeadItem[]; total: number }> {
  const query = new URLSearchParams();
  if (filter?.search) query.set("search", filter.search);
  if (filter?.status) query.set("status", filter.status);
  if (filter?.limit) query.set("limit", String(filter.limit));
  if (filter?.offset) query.set("offset", String(filter.offset));
  const qs = query.toString() ? `?${query.toString()}` : "";
  return apiFetch<{ items: PlatformLeadItem[]; total: number }>(`/v1/platform/leads${qs}`, {
    accessToken,
  });
}

export async function updatePlatformLead(
  accessToken: string,
  id: string,
  input: { status?: "new" | "contacted" | "qualified" | "closed"; notes?: string | null },
): Promise<PlatformLeadItem> {
  return apiFetch<PlatformLeadItem>(`/v1/platform/leads/${id}`, {
    method: "PATCH",
    accessToken,
    body: JSON.stringify(input),
  });
}
