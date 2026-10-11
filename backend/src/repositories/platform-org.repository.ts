import type { PoolClient } from "pg";
import type {
  PlatformOrgFilter,
  CreatePlatformOrgInput,
  UpdatePlanInput,
} from "@app/shared/schemas";

export interface PlatformOrgRow {
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

export interface PlatformOverviewStats {
  orgCount: number;
  activeSubscriptionsCount: number;
  mrrAed: number;
  openTicketsCount: number;
  recentOrgs: { id: string; name: string; slug: string; tier: string; createdAt: string }[];
}

export const platformOrgRepository = {
  async getOverview(client: PoolClient): Promise<PlatformOverviewStats> {
    const orgsRes = await client.query(`select count(*)::int as total from public.organizations`);
    const orgCount = Number(orgsRes.rows[0]?.["total"] ?? 0);

    const subRes = await client.query(
      `select count(*)::int as count, coalesce(sum(amount), 0)::numeric as mrr
       from public.subscriptions where status in ('active', 'trialing')`,
    );
    const activeSubscriptionsCount = Number(subRes.rows[0]?.["count"] ?? 0);
    const mrrAed = Number(subRes.rows[0]?.["mrr"] ?? 0);

    const ticketRes = await client.query(
      `select count(*)::int as open from public.support_tickets where status in ('open', 'in_progress')`,
    );
    const openTicketsCount = Number(ticketRes.rows[0]?.["open"] ?? 0);

    const recentRes = await client.query(
      `select id, name, slug, tier,
              to_char(created_at at time zone 'utc', 'YYYY-MM-DD"T"HH24:MI:SS."000Z"') as created_at
       from public.organizations order by created_at desc limit 5`,
    );

    return {
      orgCount,
      activeSubscriptionsCount,
      mrrAed,
      openTicketsCount,
      recentOrgs: recentRes.rows.map((r) => ({
        id: r["id"] as string,
        name: r["name"] as string,
        slug: r["slug"] as string,
        tier: r["tier"] as string,
        createdAt: r["created_at"] as string,
      })),
    };
  },

  async listOrganizations(
    client: PoolClient,
    filter: PlatformOrgFilter,
  ): Promise<{ items: PlatformOrgRow[]; total: number; page: number; limit: number }> {
    const where: string[] = [];
    const values: unknown[] = [];
    let idx = 1;

    if (filter.search) {
      where.push(`(o.name ilike $${idx} or o.slug ilike $${idx})`);
      values.push(`%${filter.search}%`);
      idx++;
    }
    if (filter.planSlug) {
      where.push(`p.slug = $${idx++}`);
      values.push(filter.planSlug);
    }

    const whereClause = where.length > 0 ? `where ${where.join(" and ")}` : "";
    const countRes = await client.query(
      `select count(*)::int as total
       from public.organizations o
       join public.plans p on p.id = o.plan_id ${whereClause}`,
      values,
    );
    const total = Number(countRes.rows[0]?.["total"] ?? 0);

    const page = filter.page ?? 1;
    const limit = filter.limit ?? 20;
    const offset = (page - 1) * limit;

    const itemsRes = await client.query(
      `select o.id, o.name, o.slug, o.currency, o.tier, o.plan_id,
              p.name as plan_name,
              to_char(o.created_at at time zone 'utc', 'YYYY-MM-DD"T"HH24:MI:SS."000Z"') as created_at,
              to_char(o.updated_at at time zone 'utc', 'YYYY-MM-DD"T"HH24:MI:SS."000Z"') as updated_at,
              coalesce((select count(*)::int from public.employees e where e.org_id = o.id), 0) as employee_count,
              coalesce((select count(*)::int from public.memberships m where m.org_id = o.id), 0) as user_count
       from public.organizations o
       join public.plans p on p.id = o.plan_id
       ${whereClause}
       order by o.created_at desc
       limit $${idx} offset $${idx + 1}`,
      [...values, limit, offset],
    );

    const items = itemsRes.rows.map((r) => ({
      id: r["id"] as string,
      name: r["name"] as string,
      slug: r["slug"] as string,
      currency: r["currency"] as string,
      tier: r["tier"] as string,
      planId: r["plan_id"] as string,
      planName: r["plan_name"] as string,
      employeeCount: Number(r["employee_count"]),
      userCount: Number(r["user_count"]),
      createdAt: r["created_at"] as string,
      updatedAt: r["updated_at"] as string,
    }));

    return { items, total, page, limit };
  },

  async createOrganization(
    client: PoolClient,
    ownerId: string,
    input: CreatePlatformOrgInput,
  ): Promise<string> {
    const res = await client.query(
      `insert into public.organizations (name, slug, currency, plan_id, owner_id)
       values ($1, $2, $3, $4, $5)
       returning id`,
      [input.name, input.slug, input.currency, input.planId, ownerId],
    );
    return res.rows[0]?.["id"] as string;
  },

  async updatePlan(client: PoolClient, id: string, input: UpdatePlanInput): Promise<void> {
    const sets: string[] = [];
    const values: unknown[] = [];
    let idx = 1;

    if (input.name !== undefined) {
      sets.push(`name = $${idx++}`);
      values.push(input.name);
    }
    if (input.maxEmployees !== undefined) {
      sets.push(`max_employees = $${idx++}`);
      values.push(input.maxEmployees);
    }
    if (input.maxStorageMb !== undefined) {
      sets.push(`max_storage_mb = $${idx++}`);
      values.push(input.maxStorageMb);
    }
    if (input.priceAed !== undefined) {
      sets.push(`price_aed = $${idx++}`);
      values.push(input.priceAed);
    }
    if (input.priceUsd !== undefined) {
      sets.push(`price_usd = $${idx++}`);
      values.push(input.priceUsd);
    }
    if (input.priceSar !== undefined) {
      sets.push(`price_sar = $${idx++}`);
      values.push(input.priceSar);
    }
    if (input.features !== undefined) {
      sets.push(`features = $${idx++}`);
      values.push(JSON.stringify(input.features));
    }
    if (input.isActive !== undefined) {
      sets.push(`is_active = $${idx++}`);
      values.push(input.isActive);
    }

    if (sets.length === 0) return;
    values.push(id);
    await client.query(`update public.plans set ${sets.join(", ")} where id = $${idx}`, values);
  },
};
