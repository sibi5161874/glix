import type { PoolClient } from "pg";
import type {
  CreateAnnouncementInput,
  UpdateAnnouncementInput,
  AnnouncementFilter,
} from "@app/shared/schemas";

export interface AnnouncementRow {
  id: string;
  orgId: string;
  title: string;
  body: string;
  priority: "normal" | "high" | "urgent";
  publishAt: string;
  expiresAt: string | null;
  attachmentUrl: string | null;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  authorName?: string | undefined;
}

function mapRow(r: Record<string, unknown>): AnnouncementRow {
  return {
    id: r["id"] as string,
    orgId: r["org_id"] as string,
    title: r["title"] as string,
    body: r["body"] as string,
    priority: r["priority"] as "normal" | "high" | "urgent",
    publishAt: (r["publish_at"] as Date).toISOString(),
    expiresAt: r["expires_at"] ? (r["expires_at"] as Date).toISOString() : null,
    attachmentUrl: (r["attachment_url"] as string | null) ?? null,
    createdBy: r["created_by"] as string,
    createdAt: (r["created_at"] as Date).toISOString(),
    updatedAt: (r["updated_at"] as Date).toISOString(),
    authorName: r["author_name"] ? (r["author_name"] as string) : undefined,
  };
}

export const announcementRepository = {
  async list(
    client: PoolClient,
    orgId: string,
    filter: AnnouncementFilter,
    activeOnly: boolean = false,
  ): Promise<{ items: AnnouncementRow[]; total: number; page: number; limit: number }> {
    const where: string[] = ["a.org_id = $1"];
    const values: unknown[] = [orgId];
    let idx = 2;

    if (activeOnly) {
      where.push(`a.publish_at <= now() and (a.expires_at is null or a.expires_at > now())`);
    }

    if (filter.priority) {
      where.push(`a.priority = $${idx++}`);
      values.push(filter.priority);
    }

    if (filter.search) {
      where.push(`(a.title ilike $${idx} or a.body ilike $${idx})`);
      values.push(`%${filter.search}%`);
      idx++;
    }

    const whereClause = where.join(" and ");

    const countRes = await client.query(
      `select count(*)::int as total
       from public.announcements a
       where ${whereClause}`,
      values,
    );
    const total = Number(countRes.rows[0]?.["total"] ?? 0);

    const page = filter.page ?? 1;
    const limit = filter.limit ?? 20;
    const offset = (page - 1) * limit;

    const itemsRes = await client.query(
      `select a.*,
              u.full_name as author_name
       from public.announcements a
       left join public.users u on u.id = a.created_by
       where ${whereClause}
       order by
         case a.priority when 'urgent' then 1 when 'high' then 2 else 3 end,
         a.publish_at desc
       limit $${idx++} offset $${idx++}`,
      [...values, limit, offset],
    );

    return {
      items: itemsRes.rows.map(mapRow),
      total,
      page,
      limit,
    };
  },

  async findById(client: PoolClient, id: string): Promise<AnnouncementRow | null> {
    const res = await client.query(
      `select a.*, u.full_name as author_name
       from public.announcements a
       left join public.users u on u.id = a.created_by
       where a.id = $1`,
      [id],
    );
    return res.rows[0] ? mapRow(res.rows[0]) : null;
  },

  async create(
    client: PoolClient,
    orgId: string,
    createdBy: string,
    input: CreateAnnouncementInput,
  ): Promise<AnnouncementRow> {
    const res = await client.query(
      `insert into public.announcements (
         org_id, title, body, priority, publish_at, expires_at, attachment_url, created_by
       ) values ($1, $2, $3, $4, coalesce($5::timestamptz, now()), $6, $7, $8)
       returning *`,
      [
        orgId,
        input.title,
        input.body,
        input.priority ?? "normal",
        input.publishAt ?? null,
        input.expiresAt ?? null,
        input.attachmentUrl ?? null,
        createdBy,
      ],
    );
    return (await this.findById(client, res.rows[0]?.["id"] as string))!;
  },

  async update(
    client: PoolClient,
    id: string,
    input: UpdateAnnouncementInput,
  ): Promise<AnnouncementRow | null> {
    const sets: string[] = [];
    const values: unknown[] = [];
    let idx = 1;

    if (input.title !== undefined) {
      sets.push(`title = $${idx++}`);
      values.push(input.title);
    }
    if (input.body !== undefined) {
      sets.push(`body = $${idx++}`);
      values.push(input.body);
    }
    if (input.priority !== undefined) {
      sets.push(`priority = $${idx++}`);
      values.push(input.priority);
    }
    if (input.publishAt !== undefined) {
      sets.push(`publish_at = $${idx++}`);
      values.push(input.publishAt);
    }
    if (input.expiresAt !== undefined) {
      sets.push(`expires_at = $${idx++}`);
      values.push(input.expiresAt);
    }
    if (input.attachmentUrl !== undefined) {
      sets.push(`attachment_url = $${idx++}`);
      values.push(input.attachmentUrl);
    }

    if (sets.length === 0) {
      return this.findById(client, id);
    }

    values.push(id);
    await client.query(
      `update public.announcements set ${sets.join(", ")} where id = $${idx}`,
      values,
    );
    return this.findById(client, id);
  },

  async remove(client: PoolClient, id: string): Promise<void> {
    await client.query(`delete from public.announcements where id = $1`, [id]);
  },
};
