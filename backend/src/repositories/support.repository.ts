import type { PoolClient } from "pg";
import type { CreateTicketInput, UpdateTicketInput, TicketFilter } from "@app/shared/schemas";

export interface TicketRow {
  id: string;
  orgId: string | null;
  userId: string;
  subject: string;
  body: string;
  category: "billing" | "technical" | "hr_feature" | "bug";
  priority: "low" | "medium" | "high" | "urgent";
  status: "open" | "in_progress" | "resolved" | "closed";
  assignedTo: string | null;
  createdAt: string;
  updatedAt: string;
  submitterName?: string | undefined;
  submitterEmail?: string | undefined;
  orgName?: string | undefined;
  assigneeName?: string | undefined;
}

function mapRow(r: Record<string, unknown>): TicketRow {
  return {
    id: r["id"] as string,
    orgId: (r["org_id"] as string | null) ?? null,
    userId: r["user_id"] as string,
    subject: r["subject"] as string,
    body: r["body"] as string,
    category: r["category"] as TicketRow["category"],
    priority: r["priority"] as TicketRow["priority"],
    status: r["status"] as TicketRow["status"],
    assignedTo: (r["assigned_to"] as string | null) ?? null,
    createdAt: (r["created_at"] as Date).toISOString(),
    updatedAt: (r["updated_at"] as Date).toISOString(),
    submitterName: r["submitter_name"] ? (r["submitter_name"] as string) : undefined,
    submitterEmail: r["submitter_email"] ? (r["submitter_email"] as string) : undefined,
    orgName: r["org_name"] ? (r["org_name"] as string) : undefined,
    assigneeName: r["assignee_name"] ? (r["assignee_name"] as string) : undefined,
  };
}

const TICKET_SELECT = `
  select t.*,
         u.full_name as submitter_name,
         u.email as submitter_email,
         o.name as org_name,
         pu.full_name as assignee_name
  from public.support_tickets t
  join public.users u on u.id = t.user_id
  left join public.organizations o on o.id = t.org_id
  left join public.platform_users pu on pu.id = t.assigned_to
`;

function buildFilterClause(
  filter: TicketFilter,
  startIdx: number,
): { clause: string; values: unknown[]; nextIdx: number } {
  const where: string[] = [];
  const values: unknown[] = [];
  let idx = startIdx;

  if (filter.status) {
    where.push(`t.status = $${idx++}`);
    values.push(filter.status);
  }
  if (filter.category) {
    where.push(`t.category = $${idx++}`);
    values.push(filter.category);
  }
  if (filter.search) {
    where.push(`(t.subject ilike $${idx} or t.body ilike $${idx})`);
    values.push(`%${filter.search}%`);
    idx++;
  }

  return { clause: where.length > 0 ? ` and ${where.join(" and ")}` : "", values, nextIdx: idx };
}

export const supportRepository = {
  async create(
    client: PoolClient,
    orgId: string,
    userId: string,
    input: CreateTicketInput,
  ): Promise<TicketRow> {
    const res = await client.query(
      `insert into public.support_tickets (org_id, user_id, subject, body, category, priority)
       values ($1, $2, $3, $4, $5, $6)
       returning id`,
      [orgId, userId, input.subject, input.body, input.category, input.priority],
    );
    return (await this.findById(client, res.rows[0]?.["id"] as string))!;
  },

  async findById(client: PoolClient, id: string): Promise<TicketRow | null> {
    const res = await client.query(`${TICKET_SELECT} where t.id = $1`, [id]);
    return res.rows[0] ? mapRow(res.rows[0]) : null;
  },

  async listMine(
    client: PoolClient,
    userId: string,
    filter: TicketFilter,
  ): Promise<{ items: TicketRow[]; total: number; page: number; limit: number }> {
    const { clause, values, nextIdx } = buildFilterClause(filter, 2);
    const baseValues = [userId, ...values];

    const countRes = await client.query(
      `select count(*)::int as total from public.support_tickets t where t.user_id = $1${clause}`,
      baseValues,
    );
    const total = Number(countRes.rows[0]?.["total"] ?? 0);

    const page = filter.page ?? 1;
    const limit = filter.limit ?? 20;
    const offset = (page - 1) * limit;

    const itemsRes = await client.query(
      `${TICKET_SELECT} where t.user_id = $1${clause}
       order by t.created_at desc
       limit $${nextIdx} offset $${nextIdx + 1}`,
      [...baseValues, limit, offset],
    );

    return { items: itemsRes.rows.map(mapRow), total, page, limit };
  },

  async listForOrg(
    client: PoolClient,
    orgId: string,
    filter: TicketFilter,
  ): Promise<{ items: TicketRow[]; total: number; page: number; limit: number }> {
    const { clause, values, nextIdx } = buildFilterClause(filter, 2);
    const baseValues = [orgId, ...values];

    const countRes = await client.query(
      `select count(*)::int as total from public.support_tickets t where t.org_id = $1${clause}`,
      baseValues,
    );
    const total = Number(countRes.rows[0]?.["total"] ?? 0);

    const page = filter.page ?? 1;
    const limit = filter.limit ?? 20;
    const offset = (page - 1) * limit;

    const itemsRes = await client.query(
      `${TICKET_SELECT} where t.org_id = $1${clause}
       order by t.created_at desc
       limit $${nextIdx} offset $${nextIdx + 1}`,
      [...baseValues, limit, offset],
    );

    return { items: itemsRes.rows.map(mapRow), total, page, limit };
  },

  async listAllPlatform(
    client: PoolClient,
    filter: TicketFilter,
  ): Promise<{ items: TicketRow[]; total: number; page: number; limit: number }> {
    const { clause, values, nextIdx } = buildFilterClause(filter, 1);

    const countRes = await client.query(
      `select count(*)::int as total from public.support_tickets t where true${clause}`,
      values,
    );
    const total = Number(countRes.rows[0]?.["total"] ?? 0);

    const page = filter.page ?? 1;
    const limit = filter.limit ?? 20;
    const offset = (page - 1) * limit;

    const itemsRes = await client.query(
      `${TICKET_SELECT} where true${clause}
       order by t.created_at desc
       limit $${nextIdx} offset $${nextIdx + 1}`,
      [...values, limit, offset],
    );

    return { items: itemsRes.rows.map(mapRow), total, page, limit };
  },

  async update(
    client: PoolClient,
    id: string,
    input: UpdateTicketInput,
  ): Promise<TicketRow | null> {
    const sets: string[] = [];
    const values: unknown[] = [];
    let idx = 1;

    if (input.status !== undefined) {
      sets.push(`status = $${idx++}`);
      values.push(input.status);
    }
    if (input.priority !== undefined) {
      sets.push(`priority = $${idx++}`);
      values.push(input.priority);
    }
    if (input.assignedTo !== undefined) {
      sets.push(`assigned_to = $${idx++}`);
      values.push(input.assignedTo);
    }

    if (sets.length === 0) return this.findById(client, id);

    values.push(id);
    await client.query(
      `update public.support_tickets set ${sets.join(", ")} where id = $${idx}`,
      values,
    );
    return this.findById(client, id);
  },
};
