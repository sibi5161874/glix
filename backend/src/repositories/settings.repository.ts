import type { PoolClient } from "pg";
import type {
  UpdateOrgProfileInput,
  CreateTemplateInput,
  UpdateTemplateInput,
  TemplateFilter,
} from "@app/shared/schemas";

export interface OrgProfileRow {
  id: string;
  name: string;
  slug: string;
  ownerId: string;
  tier: string;
  currency: string;
  phone: string | null;
  industry: string | null;
  logoUrl: string | null;
  createdAt: string;
  updatedAt: string;
  ownerEmail?: string | undefined;
  ownerName?: string | undefined;
}

export interface NotificationTemplateRow {
  id: string;
  orgId: string | null;
  channel: "email" | "whatsapp";
  key: string;
  subject: string | null;
  body: string;
  isActive: boolean;
  createdAt: string;
  isCustomOverride?: boolean;
}

function mapOrgRow(r: Record<string, unknown>): OrgProfileRow {
  return {
    id: r["id"] as string,
    name: r["name"] as string,
    slug: r["slug"] as string,
    ownerId: r["owner_id"] as string,
    tier: r["tier"] as string,
    currency: r["currency"] as string,
    phone: (r["phone"] as string | null) ?? null,
    industry: (r["industry"] as string | null) ?? null,
    logoUrl: (r["logo_url"] as string | null) ?? null,
    createdAt: (r["created_at"] as Date).toISOString(),
    updatedAt: (r["updated_at"] as Date).toISOString(),
    ownerEmail: r["owner_email"] ? (r["owner_email"] as string) : undefined,
    ownerName: r["owner_name"] ? (r["owner_name"] as string) : undefined,
  };
}

function mapTemplateRow(r: Record<string, unknown>): NotificationTemplateRow {
  return {
    id: r["id"] as string,
    orgId: (r["org_id"] as string | null) ?? null,
    channel: r["channel"] as "email" | "whatsapp",
    key: r["key"] as string,
    subject: (r["subject"] as string | null) ?? null,
    body: r["body"] as string,
    isActive: Boolean(r["is_active"]),
    createdAt: (r["created_at"] as Date).toISOString(),
    isCustomOverride: r["org_id"] !== null,
  };
}

export const settingsRepository = {
  async getOrgProfile(client: PoolClient, orgId: string): Promise<OrgProfileRow | null> {
    const res = await client.query(
      `select o.*, u.email as owner_email, u.full_name as owner_name
       from public.organizations o
       join public.users u on u.id = o.owner_id
       where o.id = $1 and o.deleted_at is null`,
      [orgId],
    );
    return res.rows[0] ? mapOrgRow(res.rows[0]) : null;
  },

  async updateOrgProfile(
    client: PoolClient,
    orgId: string,
    input: UpdateOrgProfileInput,
  ): Promise<OrgProfileRow | null> {
    const sets: string[] = [];
    const values: unknown[] = [];
    let idx = 1;

    if (input.name !== undefined) {
      sets.push(`name = $${idx++}`);
      values.push(input.name);
    }
    if (input.currency !== undefined) {
      sets.push(`currency = $${idx++}`);
      values.push(input.currency);
    }
    if (input.phone !== undefined) {
      sets.push(`phone = $${idx++}`);
      values.push(input.phone);
    }
    if (input.industry !== undefined) {
      sets.push(`industry = $${idx++}`);
      values.push(input.industry);
    }
    if (input.logoUrl !== undefined) {
      sets.push(`logo_url = $${idx++}`);
      values.push(input.logoUrl);
    }

    if (sets.length === 0) return this.getOrgProfile(client, orgId);

    values.push(orgId);
    await client.query(
      `update public.organizations set ${sets.join(", ")} where id = $${idx}`,
      values,
    );
    return this.getOrgProfile(client, orgId);
  },

  async listTemplates(
    client: PoolClient,
    orgId: string,
    filter: TemplateFilter = {},
  ): Promise<NotificationTemplateRow[]> {
    const where: string[] = ["(org_id is null or org_id = $1)"];
    const values: unknown[] = [orgId];
    let idx = 2;

    if (filter.channel) {
      where.push(`channel = $${idx++}`);
      values.push(filter.channel);
    }
    if (filter.search) {
      where.push(`(key ilike $${idx} or subject ilike $${idx} or body ilike $${idx})`);
      values.push(`%${filter.search}%`);
      idx++;
    }

    const res = await client.query(
      `select distinct on (channel, key) *
       from public.notification_templates
       where ${where.join(" and ")}
       order by channel, key, org_id desc nulls last`,
      values,
    );
    return res.rows.map(mapTemplateRow);
  },

  async findTemplateById(client: PoolClient, id: string): Promise<NotificationTemplateRow | null> {
    const res = await client.query(`select * from public.notification_templates where id = $1`, [
      id,
    ]);
    return res.rows[0] ? mapTemplateRow(res.rows[0]) : null;
  },

  async saveTemplateOverride(
    client: PoolClient,
    orgId: string,
    input: CreateTemplateInput,
  ): Promise<NotificationTemplateRow> {
    const res = await client.query(
      `insert into public.notification_templates (org_id, channel, key, subject, body, is_active)
       values ($1, $2, $3, $4, $5, $6)
       on conflict (org_id, channel, key) where org_id is not null
       do update set subject = excluded.subject, body = excluded.body, is_active = excluded.is_active
       returning *`,
      [orgId, input.channel, input.key, input.subject ?? null, input.body, input.isActive ?? true],
    );
    return mapTemplateRow(res.rows[0]!);
  },

  async updateTemplate(
    client: PoolClient,
    id: string,
    input: UpdateTemplateInput,
  ): Promise<NotificationTemplateRow | null> {
    const sets: string[] = [];
    const values: unknown[] = [];
    let idx = 1;

    if (input.subject !== undefined) {
      sets.push(`subject = $${idx++}`);
      values.push(input.subject);
    }
    if (input.body !== undefined) {
      sets.push(`body = $${idx++}`);
      values.push(input.body);
    }
    if (input.isActive !== undefined) {
      sets.push(`is_active = $${idx++}`);
      values.push(input.isActive);
    }

    if (sets.length === 0) return this.findTemplateById(client, id);

    values.push(id);
    await client.query(
      `update public.notification_templates set ${sets.join(", ")} where id = $${idx}`,
      values,
    );
    return this.findTemplateById(client, id);
  },

  async deleteTemplateOverride(client: PoolClient, id: string): Promise<void> {
    await client.query(
      `delete from public.notification_templates where id = $1 and org_id is not null`,
      [id],
    );
  },
};
