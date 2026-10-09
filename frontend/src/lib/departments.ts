import type {
  CreateDepartmentInput,
  UpdateDepartmentInput,
  DepartmentFilter,
} from "@app/shared/schemas";
import { apiFetch } from "./api";

export interface DepartmentItem {
  id: string;
  orgId: string;
  name: string;
  code: string | null;
  parentId: string | null;
  createdAt: string;
  updatedAt: string;
  parentName?: string | undefined;
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

export async function listDepartments(
  accessToken: string,
  filter: Partial<DepartmentFilter> = {},
): Promise<DepartmentItem[]> {
  const query = qs(filter as Record<string, string | number | undefined>);
  return apiFetch<DepartmentItem[]>(`/v1/departments${query}`, { accessToken });
}

export async function getDepartment(accessToken: string, id: string): Promise<DepartmentItem> {
  return apiFetch<DepartmentItem>(`/v1/departments/${id}`, { accessToken });
}

export async function createDepartment(
  accessToken: string,
  input: CreateDepartmentInput,
): Promise<DepartmentItem> {
  return apiFetch<DepartmentItem>("/v1/departments", {
    method: "POST",
    accessToken,
    body: JSON.stringify(input),
  });
}

export async function updateDepartment(
  accessToken: string,
  id: string,
  input: UpdateDepartmentInput,
): Promise<DepartmentItem> {
  return apiFetch<DepartmentItem>(`/v1/departments/${id}`, {
    method: "PUT",
    accessToken,
    body: JSON.stringify(input),
  });
}

export async function deleteDepartment(accessToken: string, id: string): Promise<void> {
  await apiFetch(`/v1/departments/${id}`, {
    method: "DELETE",
    accessToken,
  });
}
