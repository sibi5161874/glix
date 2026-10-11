import { apiFetch } from "./api";

export interface PlanItem {
  id: string;
  name: string;
  slug: string;
  maxEmployees: number;
  maxStorageMb: number;
  priceAed: string;
  priceUsd: string;
  priceSar: string;
  features: Record<string, boolean>;
  isActive: boolean;
  sortOrder: number;
}

export interface SubscriptionItem {
  id: string;
  orgId: string;
  planId: string;
  planName: string;
  planSlug: string;
  status: "active" | "trialing" | "past_due" | "canceled";
  currency: string;
  amount: string;
  currentPeriodStart: string;
  currentPeriodEnd: string;
  trialEndsAt: string | null;
  gateway: string | null;
  createdAt: string;
}

export interface InvoiceItem {
  id: string;
  orgId: string;
  invoiceNumber: string;
  amount: string;
  taxAmount: string;
  currency: string;
  status: "draft" | "open" | "paid" | "void";
  gateway: string | null;
  issuedAt: string;
  paidAt: string | null;
}

export interface InvoicesResponse {
  items: InvoiceItem[];
  total: number;
  page: number;
  limit: number;
}

export async function listPlans(accessToken: string): Promise<PlanItem[]> {
  return apiFetch<PlanItem[]>("/v1/billing/plans", { accessToken });
}

export async function getSubscription(accessToken: string): Promise<SubscriptionItem | null> {
  return apiFetch<SubscriptionItem | null>("/v1/billing/subscription", { accessToken });
}

export async function listInvoices(
  accessToken: string,
  params?: { page?: number; limit?: number },
): Promise<InvoicesResponse> {
  const query = new URLSearchParams();
  if (params?.page) query.set("page", String(params.page));
  if (params?.limit) query.set("limit", String(params.limit));
  const queryString = query.toString() ? `?${query.toString()}` : "";
  return apiFetch<InvoicesResponse>(`/v1/billing/invoices${queryString}`, { accessToken });
}

export async function changeTier(accessToken: string, planId: string): Promise<SubscriptionItem> {
  return apiFetch<SubscriptionItem>("/v1/billing/change-tier", {
    method: "POST",
    accessToken,
    body: JSON.stringify({ planId }),
  });
}
