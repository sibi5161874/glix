import type { CreateEmployeeInput, UpdateEmployeeInput, EmployeeFilter } from "@app/shared/schemas";
import { apiFetch } from "./api";

export interface EmployeeListItem {
  id: string;
  orgId: string;
  userId: string | null;
  employeeCode: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
  dob: string | null;
  gender: string | null;
  nationality: string | null;
  maritalStatus: string | null;
  departmentId: string | null;
  departmentName: string | null;
  designationId: string | null;
  designationTitle: string | null;
  reportingManagerId: string | null;
  joiningDate: string;
  employmentType: string;
  basicSalary: string;
  bankAccount: string | null;
  iban: string | null;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface EmployeeListResult {
  items: EmployeeListItem[];
  total: number;
  page: number;
  limit: number;
}

export interface Lookup {
  id: string;
  name?: string;
  title?: string;
}

function qs(params: Record<string, string | number | undefined>): string {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== "") search.set(key, String(value));
  }
  const str = search.toString();
  return str ? `?${str}` : "";
}

export function listEmployees(
  accessToken: string,
  filter: Partial<EmployeeFilter>,
): Promise<EmployeeListResult> {
  return apiFetch<EmployeeListResult>(`/v1/employees${qs(filter)}`, { accessToken });
}

export function getEmployee(accessToken: string, id: string): Promise<EmployeeListItem> {
  return apiFetch<EmployeeListItem>(`/v1/employees/${id}`, { accessToken });
}

export function createEmployee(
  accessToken: string,
  input: CreateEmployeeInput,
): Promise<EmployeeListItem> {
  return apiFetch<EmployeeListItem>("/v1/employees", {
    method: "POST",
    body: JSON.stringify(input),
    accessToken,
  });
}

export function updateEmployee(
  accessToken: string,
  id: string,
  input: UpdateEmployeeInput,
): Promise<EmployeeListItem> {
  return apiFetch<EmployeeListItem>(`/v1/employees/${id}`, {
    method: "PUT",
    body: JSON.stringify(input),
    accessToken,
  });
}

export function deleteEmployee(accessToken: string, id: string): Promise<{ success: boolean }> {
  return apiFetch<{ success: boolean }>(`/v1/employees/${id}`, {
    method: "DELETE",
    accessToken,
  });
}

export function listDepartments(accessToken: string): Promise<Lookup[]> {
  return apiFetch<Lookup[]>("/v1/departments", { accessToken });
}

export function listDesignations(accessToken: string): Promise<Lookup[]> {
  return apiFetch<Lookup[]>("/v1/designations", { accessToken });
}
