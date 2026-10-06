import type {
  CreateLeaveTypeInput,
  UpdateLeaveTypeInput,
  CreateHolidayInput,
  CreateLeaveRequestInput,
  LeaveRequestFilter,
  AdjustLeaveBalanceInput,
} from "@app/shared/schemas";
import { apiFetch } from "./api";

export interface LeaveType {
  id: string;
  orgId: string;
  name: string;
  code: string;
  daysPerYear: string;
  isPaid: boolean;
  requiresApproval: boolean;
  isActive: boolean;
}

export interface Holiday {
  id: string;
  orgId: string;
  name: string;
  date: string;
  isRecurring: boolean;
}

export interface LeaveRequestItem {
  id: string;
  employeeId: string;
  employeeName: string;
  leaveTypeId: string;
  leaveTypeName: string;
  startDate: string;
  endDate: string;
  totalDays: string;
  reason: string | null;
  status: string;
  rejectionReason: string | null;
  createdAt: string;
}

export interface LeaveBalanceItem {
  id: string;
  employeeId: string;
  employeeName: string;
  leaveTypeId: string;
  leaveTypeName: string;
  year: number;
  allocated: string;
  used: string;
  carriedOver: string;
}

function qs(params: Record<string, string | number | undefined>): string {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== "") search.set(key, String(value));
  }
  const str = search.toString();
  return str ? `?${str}` : "";
}

export const listLeaveTypes = (token: string): Promise<LeaveType[]> =>
  apiFetch("/v1/leave-types", { accessToken: token });

export const createLeaveType = (token: string, input: CreateLeaveTypeInput): Promise<LeaveType> =>
  apiFetch("/v1/leave-types", { method: "POST", body: JSON.stringify(input), accessToken: token });

export const updateLeaveType = (
  token: string,
  id: string,
  input: UpdateLeaveTypeInput,
): Promise<LeaveType> =>
  apiFetch(`/v1/leave-types/${id}`, {
    method: "PUT",
    body: JSON.stringify(input),
    accessToken: token,
  });

export const deleteLeaveType = (token: string, id: string): Promise<{ success: boolean }> =>
  apiFetch(`/v1/leave-types/${id}`, { method: "DELETE", accessToken: token });

export const listHolidays = (token: string, year?: number): Promise<Holiday[]> =>
  apiFetch(`/v1/holidays${qs({ year })}`, { accessToken: token });

export const createHoliday = (token: string, input: CreateHolidayInput): Promise<Holiday> =>
  apiFetch("/v1/holidays", { method: "POST", body: JSON.stringify(input), accessToken: token });

export const deleteHoliday = (token: string, id: string): Promise<{ success: boolean }> =>
  apiFetch(`/v1/holidays/${id}`, { method: "DELETE", accessToken: token });

export const listLeaveRequests = (
  token: string,
  filter: Partial<LeaveRequestFilter> = {},
): Promise<LeaveRequestItem[]> =>
  apiFetch(`/v1/leave-requests${qs(filter)}`, { accessToken: token });

export const createLeaveRequest = (
  token: string,
  input: CreateLeaveRequestInput,
): Promise<LeaveRequestItem> =>
  apiFetch("/v1/leave-requests", {
    method: "POST",
    body: JSON.stringify(input),
    accessToken: token,
  });

export const approveLeaveRequest = (token: string, id: string): Promise<LeaveRequestItem> =>
  apiFetch(`/v1/leave-requests/${id}/approve`, { method: "POST", accessToken: token });

export const rejectLeaveRequest = (
  token: string,
  id: string,
  rejectionReason: string,
): Promise<LeaveRequestItem> =>
  apiFetch(`/v1/leave-requests/${id}/reject`, {
    method: "POST",
    body: JSON.stringify({ rejectionReason }),
    accessToken: token,
  });

export const cancelLeaveRequest = (token: string, id: string): Promise<{ success: boolean }> =>
  apiFetch(`/v1/leave-requests/${id}/cancel`, { method: "POST", accessToken: token });

export const listLeaveBalances = (
  token: string,
  employeeId?: string,
  year?: number,
): Promise<LeaveBalanceItem[]> =>
  apiFetch(`/v1/leave-balances${qs({ employeeId, year })}`, { accessToken: token });

export const adjustLeaveBalance = (
  token: string,
  input: AdjustLeaveBalanceInput,
): Promise<LeaveBalanceItem> =>
  apiFetch("/v1/leave-balances/adjust", {
    method: "POST",
    body: JSON.stringify(input),
    accessToken: token,
  });
