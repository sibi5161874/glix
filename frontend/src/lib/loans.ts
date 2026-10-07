import type {
  CreateLoanInput,
  RecordLoanPaymentInput,
  RejectLoanInput,
  LoanFilter,
} from "@app/shared/schemas";
import { apiFetch } from "./api";

export interface LoanItem {
  id: string;
  orgId: string;
  employeeId: string;
  principalAmount: string;
  monthlyInstallment: string;
  repaidAmount: string;
  startMonth: string;
  termMonths: number;
  status: "pending" | "active" | "paid_off" | "rejected";
  approvedBy: string | null;
  approvedAt: string | null;
  reason: string | null;
  createdAt: string;
  updatedAt: string;
  employeeName?: string | undefined;
  employeeCode?: string | undefined;
  remainingAmount?: string | undefined;
  progressPercent?: number | undefined;
}

export interface LoanListResponse {
  items: LoanItem[];
  total: number;
  page: number;
  limit: number;
}

export interface LoanSummary {
  total: number;
  activeCount: number;
  pendingCount: number;
  totalOutstanding: string;
  totalRepaid: string;
}

function qs(params: Record<string, string | number | undefined>): string {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== "") search.set(key, String(value));
  }
  const str = search.toString();
  return str ? `?${str}` : "";
}

export async function listLoans(
  accessToken: string,
  filter: Partial<LoanFilter> = {},
): Promise<LoanListResponse> {
  const query = qs(filter as Record<string, string | number | undefined>);
  return apiFetch<LoanListResponse>(`/v1/loans${query}`, { accessToken });
}

export async function getLoanSummary(accessToken: string): Promise<LoanSummary> {
  return apiFetch<LoanSummary>("/v1/loans/summary", { accessToken });
}

export async function getLoan(accessToken: string, id: string): Promise<LoanItem> {
  return apiFetch<LoanItem>(`/v1/loans/${id}`, { accessToken });
}

export async function createLoan(accessToken: string, input: CreateLoanInput): Promise<LoanItem> {
  return apiFetch<LoanItem>("/v1/loans", {
    method: "POST",
    accessToken,
    body: JSON.stringify(input),
  });
}

export async function approveLoan(accessToken: string, id: string): Promise<LoanItem> {
  return apiFetch<LoanItem>(`/v1/loans/${id}/approve`, {
    method: "POST",
    accessToken,
  });
}

export async function rejectLoan(
  accessToken: string,
  id: string,
  input: RejectLoanInput = { loanId: id },
): Promise<LoanItem> {
  return apiFetch<LoanItem>(`/v1/loans/${id}/reject`, {
    method: "POST",
    accessToken,
    body: JSON.stringify(input),
  });
}

export async function recordLoanPayment(
  accessToken: string,
  loanId: string,
  input: RecordLoanPaymentInput,
): Promise<LoanItem> {
  return apiFetch<LoanItem>(`/v1/loans/${loanId}/payments`, {
    method: "POST",
    accessToken,
    body: JSON.stringify(input),
  });
}
