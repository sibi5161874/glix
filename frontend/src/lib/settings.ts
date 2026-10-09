import type {
  UpdateOrgProfileInput,
  CreateTemplateInput,
  UpdateTemplateInput,
  TemplateFilter,
} from "@app/shared/schemas";
import type { Role, Permission } from "@app/shared/config";
import { apiFetch } from "./api";

export interface OrgProfile {
  id: string;
  name: string;
  slug: string;
  ownerId: string;
  tier: string;
  currency: string;
  phone: string | null;
  industry: string | null;
  logoUrl: string | null;
  createdAt: string;
  updatedAt: string;
  ownerEmail?: string | undefined;
  ownerName?: string | undefined;
}

export interface NotificationTemplateItem {
  id: string;
  orgId: string | null;
  channel: "email" | "whatsapp";
  key: string;
  subject: string | null;
  body: string;
  isActive: boolean;
  createdAt: string;
  isCustomOverride?: boolean;
}

export interface RoleMatrixItem {
  role: Role;
  permissions: Permission[];
}

function qs(params: Record<string, string | number | undefined>): string {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== "") search.set(key, String(value));
  }
  const str = search.toString();
  return str ? `?${str}` : "";
}

export async function getOrgProfile(accessToken: string): Promise<OrgProfile> {
  return apiFetch<OrgProfile>("/v1/settings/profile", { accessToken });
}

export async function updateOrgProfile(
  accessToken: string,
  input: UpdateOrgProfileInput,
): Promise<OrgProfile> {
  return apiFetch<OrgProfile>("/v1/settings/profile", {
    method: "PUT",
    accessToken,
    body: JSON.stringify(input),
  });
}

export async function listTemplates(
  accessToken: string,
  filter: Partial<TemplateFilter> = {},
): Promise<NotificationTemplateItem[]> {
  const query = qs(filter as Record<string, string | number | undefined>);
  return apiFetch<NotificationTemplateItem[]>(`/v1/settings/templates${query}`, { accessToken });
}

export async function saveTemplateOverride(
  accessToken: string,
  input: CreateTemplateInput,
): Promise<NotificationTemplateItem> {
  return apiFetch<NotificationTemplateItem>("/v1/settings/templates", {
    method: "POST",
    accessToken,
    body: JSON.stringify(input),
  });
}

export async function updateTemplate(
  accessToken: string,
  id: string,
  input: UpdateTemplateInput,
): Promise<NotificationTemplateItem> {
  return apiFetch<NotificationTemplateItem>(`/v1/settings/templates/${id}`, {
    method: "PUT",
    accessToken,
    body: JSON.stringify(input),
  });
}

export async function deleteTemplateOverride(accessToken: string, id: string): Promise<void> {
  await apiFetch(`/v1/settings/templates/${id}`, {
    method: "DELETE",
    accessToken,
  });
}

export async function getRolePermissionsMatrix(accessToken: string): Promise<RoleMatrixItem[]> {
  return apiFetch<RoleMatrixItem[]>("/v1/settings/roles", { accessToken });
}
