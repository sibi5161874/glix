import type { PoolClient } from "pg";
import type { CreateLeadInput, UpdateLeadStatusInput } from "@app/shared/schemas";

export interface LeadRow {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  subject: string | null;
  message: string;
  status: "new" | "contacted" | "qualified" | "closed";
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

export const leadsRepository = {
  async createLead(client: PoolClient, input: CreateLeadInput): Promise<LeadRow> {
    const res = await client.query(
      `insert into public.leads (name, email, phone, subject, message)
       values ($1, $2, $3, $4, $5)
       returning id, name, email, phone, subject, message, status, notes,
         to_char(created_at at time zone 'utc', 'YYYY-MM-DD"T"HH24:MI:SS."000Z"') as created_at,
         to_char(updated_at at time zone 'utc', 'YYYY-MM-DD"T"HH24:MI:SS."000Z"') as updated_at`,
      [input.name, input.email, input.phone ?? null, input.subject ?? null, input.message],
    );
    const r = res.rows[0]!;
    return {
      id: r["id"] as string,
      name: r["name"] as string,
      email: r["email"] as string,
      phone: (r["phone"] as string | null) ?? null,
      subject: (r["subject"] as string | null) ?? null,
      message: r["message"] as string,
      status: r["status"] as "new" | "contacted" | "qualified" | "closed",
      notes: (r["notes"] as string | null) ?? null,
      createdAt: r["created_at"] as string,
      updatedAt: r["updated_at"] as string,
    };
  },

  async listLeads(
    client: PoolClient,
    filter: { search?: string; status?: string; limit?: number; offset?: number },
  ): Promise<{ items: LeadRow[]; total: number }> {
    const conditions: string[] = [];
    const params: unknown[] = [];

    if (filter.status) {
      params.push(filter.status);
      conditions.push(`status = $${params.length}`);
    }

    if (filter.search) {
      params.push(`%${filter.search}%`);
      const idx = params.length;
      conditions.push(`(name ilike $${idx} or email ilike $${idx} or subject ilike $${idx})`);
    }

    const where = conditions.length > 0 ? `where ${conditions.join(" and ")}` : "";

    const countRes = await client.query(
      `select count(*)::int as cnt from public.leads ${where}`,
      params,
    );
    const total = (countRes.rows[0]?.["cnt"] as number) ?? 0;

    const limit = filter.limit ?? 50;
    const offset = filter.offset ?? 0;
    params.push(limit);
    const limitIdx = params.length;
    params.push(offset);
    const offsetIdx = params.length;

    const query = `
      select id, name, email, phone, subject, message, status, notes,
        to_char(created_at at time zone 'utc', 'YYYY-MM-DD"T"HH24:MI:SS."000Z"') as created_at,
        to_char(updated_at at time zone 'utc', 'YYYY-MM-DD"T"HH24:MI:SS."000Z"') as updated_at
      from public.leads
      ${where}
      order by created_at desc
      limit $${limitIdx} offset $${offsetIdx}
    `;

    const res = await client.query(query, params);
    const items: LeadRow[] = res.rows.map((r) => ({
      id: r["id"] as string,
      name: r["name"] as string,
      email: r["email"] as string,
      phone: (r["phone"] as string | null) ?? null,
      subject: (r["subject"] as string | null) ?? null,
      message: r["message"] as string,
      status: r["status"] as "new" | "contacted" | "qualified" | "closed",
      notes: (r["notes"] as string | null) ?? null,
      createdAt: r["created_at"] as string,
      updatedAt: r["updated_at"] as string,
    }));

    return { items, total };
  },

  async updateLead(
    client: PoolClient,
    id: string,
    input: UpdateLeadStatusInput,
  ): Promise<LeadRow | null> {
    const fields: string[] = [];
    const params: unknown[] = [id];

    if (input.status !== undefined) {
      params.push(input.status);
      fields.push(`status = $${params.length}`);
    }
    if (input.notes !== undefined) {
      params.push(input.notes);
      fields.push(`notes = $${params.length}`);
    }

    if (fields.length === 0) return null;

    const res = await client.query(
      `update public.leads set ${fields.join(", ")}, updated_at = now()
       where id = $1
       returning id, name, email, phone, subject, message, status, notes,
         to_char(created_at at time zone 'utc', 'YYYY-MM-DD"T"HH24:MI:SS."000Z"') as created_at,
         to_char(updated_at at time zone 'utc', 'YYYY-MM-DD"T"HH24:MI:SS."000Z"') as updated_at`,
      params,
    );

    const r = res.rows[0];
    if (!r) return null;
    return {
      id: r["id"] as string,
      name: r["name"] as string,
      email: r["email"] as string,
      phone: (r["phone"] as string | null) ?? null,
      subject: (r["subject"] as string | null) ?? null,
      message: r["message"] as string,
      status: r["status"] as "new" | "contacted" | "qualified" | "closed",
      notes: (r["notes"] as string | null) ?? null,
      createdAt: r["created_at"] as string,
      updatedAt: r["updated_at"] as string,
    };
  },
};
