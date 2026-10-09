import type {
  CreateDesignationInput,
  UpdateDesignationInput,
  DesignationFilter,
} from "@app/shared/schemas";
import { apiFetch } from "./api";

export interface DesignationItem {
  id: string;
  orgId: string;
  title: string;
  level: number | null;
  createdAt: string;
  updatedAt: string;
  employeeCount?: number | undefined;
}

function qs(params: Record<string, string | number | undefined>): string {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== "") search.set(key, String(value));
  }
  const str = search.toString();
  return str ? `?${str}` : "";
}

export async function listDesignations(
  accessToken: string,
  filter: Partial<DesignationFilter> = {},
): Promise<DesignationItem[]> {
  const query = qs(filter as Record<string, string | number | undefined>);
  return apiFetch<DesignationItem[]>(`/v1/designations${query}`, { accessToken });
}

export async function getDesignation(accessToken: string, id: string): Promise<DesignationItem> {
  return apiFetch<DesignationItem>(`/v1/designations/${id}`, { accessToken });
}

export async function createDesignation(
  accessToken: string,
  input: CreateDesignationInput,
): Promise<DesignationItem> {
  return apiFetch<DesignationItem>("/v1/designations", {
    method: "POST",
    accessToken,
    body: JSON.stringify(input),
  });
}

export async function updateDesignation(
  accessToken: string,
  id: string,
  input: UpdateDesignationInput,
): Promise<DesignationItem> {
  return apiFetch<DesignationItem>(`/v1/designations/${id}`, {
    method: "PUT",
    accessToken,
    body: JSON.stringify(input),
  });
}

export async function deleteDesignation(accessToken: string, id: string): Promise<void> {
  await apiFetch(`/v1/designations/${id}`, {
    method: "DELETE",
    accessToken,
  });
}
