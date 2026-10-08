import { apiFetch } from "./api";

export interface BreakdownRow {
  label: string;
  count: number;
}

export interface EmployeeDemographicsReport {
  totalEmployees: number;
  byDepartment: BreakdownRow[];
  byDesignation: BreakdownRow[];
  byGender: BreakdownRow[];
  byEmploymentType: BreakdownRow[];
  byStatus: BreakdownRow[];
}

export interface LeaveTypeUtilization {
  leaveType: string;
  totalAllocated: number;
  totalUsed: number;
  totalCarriedOver: number;
  utilizationPercent: number;
}

export interface LeaveUtilizationReport {
  year: number;
  pendingRequests: number;
  approvedDaysThisYear: number;
  byLeaveType: LeaveTypeUtilization[];
}

export interface DocumentExpiryReport {
  summary: {
    total: number;
    active: number;
    expiring30: number;
    expiring60: number;
    expiring90: number;
    expired: number;
  };
  byType: BreakdownRow[];
}

export interface LoanBalancesReport {
  summary: {
    total: number;
    activeCount: number;
    pendingCount: number;
    totalOutstanding: string;
    totalRepaid: string;
  };
  byStatus: BreakdownRow[];
}

export async function getEmployeeReport(accessToken: string): Promise<EmployeeDemographicsReport> {
  return apiFetch<EmployeeDemographicsReport>("/v1/reports/employees", { accessToken });
}

export async function getLeaveReport(
  accessToken: string,
  year: number,
): Promise<LeaveUtilizationReport> {
  return apiFetch<LeaveUtilizationReport>(`/v1/reports/leaves?year=${year}`, { accessToken });
}

export async function getDocumentReport(accessToken: string): Promise<DocumentExpiryReport> {
  return apiFetch<DocumentExpiryReport>("/v1/reports/documents", { accessToken });
}

export async function getLoanReport(accessToken: string): Promise<LoanBalancesReport> {
  return apiFetch<LoanBalancesReport>("/v1/reports/loans", { accessToken });
}
