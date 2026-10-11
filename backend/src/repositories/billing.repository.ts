import type { PoolClient } from "pg";
import type { InvoiceFilter } from "@app/shared/schemas";

export interface PlanRow {
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

export interface SubscriptionRow {
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

export interface InvoiceRow {
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

function mapPlan(r: Record<string, unknown>): PlanRow {
  return {
    id: r["id"] as string,
    name: r["name"] as string,
    slug: r["slug"] as string,
    maxEmployees: Number(r["max_employees"]),
    maxStorageMb: Number(r["max_storage_mb"]),
    priceAed: String(r["price_aed"]),
    priceUsd: String(r["price_usd"]),
    priceSar: String(r["price_sar"]),
    features: r["features"] as Record<string, boolean>,
    isActive: Boolean(r["is_active"]),
    sortOrder: Number(r["sort_order"]),
  };
}

function mapSubscription(r: Record<string, unknown>): SubscriptionRow {
  return {
    id: r["id"] as string,
    orgId: r["org_id"] as string,
    planId: r["plan_id"] as string,
    planName: r["plan_name"] as string,
    planSlug: r["plan_slug"] as string,
    status: r["status"] as SubscriptionRow["status"],
    currency: r["currency"] as string,
    amount: String(r["amount"]),
    // Cast to text in SQL, not left as a raw timestamptz — see loan.repository.ts's
    // start_month comment for why node-pg's JS-Date parsing is never trusted here.
    currentPeriodStart: r["current_period_start"] as string,
    currentPeriodEnd: r["current_period_end"] as string,
    trialEndsAt: (r["trial_ends_at"] as string | null) ?? null,
    gateway: (r["gateway"] as string | null) ?? null,
    createdAt: r["created_at"] as string,
  };
}

function mapInvoice(r: Record<string, unknown>): InvoiceRow {
  return {
    id: r["id"] as string,
    orgId: r["org_id"] as string,
    invoiceNumber: r["invoice_number"] as string,
    amount: String(r["amount"]),
    taxAmount: String(r["tax_amount"]),
    currency: r["currency"] as string,
    status: r["status"] as InvoiceRow["status"],
    gateway: (r["gateway"] as string | null) ?? null,
    issuedAt: r["issued_at"] as string,
    paidAt: (r["paid_at"] as string | null) ?? null,
  };
}

const SUBSCRIPTION_COLUMNS = `
  s.id, s.org_id, s.plan_id, p.name as plan_name, p.slug as plan_slug,
  s.status, s.currency, s.amount,
  to_char(s.current_period_start at time zone 'utc', 'YYYY-MM-DD"T"HH24:MI:SS."000Z"') as current_period_start,
  to_char(s.current_period_end at time zone 'utc', 'YYYY-MM-DD"T"HH24:MI:SS."000Z"') as current_period_end,
  to_char(s.trial_ends_at at time zone 'utc', 'YYYY-MM-DD"T"HH24:MI:SS."000Z"') as trial_ends_at,
  s.gateway, s.created_at
`;

export const billingRepository = {
  async getOrgCurrency(client: PoolClient, orgId: string): Promise<string> {
    const res = await client.query(`select currency from public.organizations where id = $1`, [
      orgId,
    ]);
    return (res.rows[0]?.["currency"] as string | undefined) ?? "AED";
  },

  async setOrgPlan(client: PoolClient, orgId: string, planId: string): Promise<void> {
    await client.query(`update public.organizations set plan_id = $1 where id = $2`, [
      planId,
      orgId,
    ]);
  },

  async listActivePlans(client: PoolClient): Promise<PlanRow[]> {
    const res = await client.query(
      `select * from public.plans where is_active = true order by sort_order asc`,
    );
    return res.rows.map(mapPlan);
  },

  async findPlanById(client: PoolClient, id: string): Promise<PlanRow | null> {
    const res = await client.query(`select * from public.plans where id = $1`, [id]);
    return res.rows[0] ? mapPlan(res.rows[0]) : null;
  },

  async getCurrentSubscription(client: PoolClient, orgId: string): Promise<SubscriptionRow | null> {
    const res = await client.query(
      `select ${SUBSCRIPTION_COLUMNS}
       from public.subscriptions s
       join public.plans p on p.id = s.plan_id
       where s.org_id = $1 and s.status in ('active', 'trialing')
       order by s.created_at desc
       limit 1`,
      [orgId],
    );
    return res.rows[0] ? mapSubscription(res.rows[0]) : null;
  },

  async cancelActiveSubscriptions(client: PoolClient, orgId: string): Promise<void> {
    await client.query(
      `update public.subscriptions
       set status = 'canceled'
       where org_id = $1 and status in ('active', 'trialing')`,
      [orgId],
    );
  },

  async createSubscription(
    client: PoolClient,
    orgId: string,
    planId: string,
    currency: string,
    amount: string,
  ): Promise<SubscriptionRow> {
    await client.query(
      `insert into public.subscriptions (
         org_id, plan_id, status, currency, amount,
         current_period_start, current_period_end, gateway
       ) values ($1, $2, 'active', $3, $4, now(), now() + interval '30 days', 'manual')`,
      [orgId, planId, currency, amount],
    );
    const subscription = await this.getCurrentSubscription(client, orgId);
    if (!subscription) throw new Error("Subscription vanished immediately after insert");
    return subscription;
  },

  async createInvoice(
    client: PoolClient,
    orgId: string,
    currency: string,
    amount: string,
  ): Promise<InvoiceRow> {
    const invoiceNumber = `INV-${Date.now()}-${Math.floor(Math.random() * 10_000)}`;
    const res = await client.query(
      `insert into public.invoices (
         org_id, invoice_number, amount, currency, status, gateway, paid_at
       ) values ($1, $2, $3, $4, 'paid', 'manual', now())
       returning id, org_id, invoice_number, amount, tax_amount, currency, status, gateway,
                 to_char(issued_at at time zone 'utc', 'YYYY-MM-DD"T"HH24:MI:SS."000Z"') as issued_at,
                 to_char(paid_at at time zone 'utc', 'YYYY-MM-DD"T"HH24:MI:SS."000Z"') as paid_at`,
      [orgId, invoiceNumber, amount, currency],
    );
    return mapInvoice(res.rows[0]!);
  },

  async listInvoices(
    client: PoolClient,
    orgId: string,
    filter: InvoiceFilter,
  ): Promise<{ items: InvoiceRow[]; total: number; page: number; limit: number }> {
    const countRes = await client.query(
      `select count(*)::int as total from public.invoices where org_id = $1`,
      [orgId],
    );
    const total = Number(countRes.rows[0]?.["total"] ?? 0);

    const page = filter.page ?? 1;
    const limit = filter.limit ?? 20;
    const offset = (page - 1) * limit;

    const itemsRes = await client.query(
      `select id, org_id, invoice_number, amount, tax_amount, currency, status, gateway,
              to_char(issued_at at time zone 'utc', 'YYYY-MM-DD"T"HH24:MI:SS."000Z"') as issued_at,
              to_char(paid_at at time zone 'utc', 'YYYY-MM-DD"T"HH24:MI:SS."000Z"') as paid_at
       from public.invoices
       where org_id = $1
       order by issued_at desc
       limit $2 offset $3`,
      [orgId, limit, offset],
    );

    return { items: itemsRes.rows.map(mapInvoice), total, page, limit };
  },
};
