import type { PoolClient } from "pg";
import type { CreateDocumentTypeInput, UpdateDocumentTypeInput } from "@app/shared/schemas";

export interface DocumentTypeRow {
  id: string;
  orgId: string;
  name: string;
  code: string;
  requiresExpiry: boolean;
  alertDays: number[];
  retentionDays: number | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

function mapRow(r: Record<string, unknown>): DocumentTypeRow {
  return {
    id: r["id"] as string,
    orgId: r["org_id"] as string,
    name: r["name"] as string,
    code: r["code"] as string,
    requiresExpiry: Boolean(r["requires_expiry"]),
    alertDays: (r["alert_days"] as number[]) ?? [90, 60, 30],
    retentionDays: (r["retention_days"] as number | null) ?? null,
    isActive: Boolean(r["is_active"]),
    createdAt: (r["created_at"] as Date).toISOString(),
    updatedAt: (r["updated_at"] as Date).toISOString(),
  };
}

export const documentTypeRepository = {
  async list(client: PoolClient, orgId: string): Promise<DocumentTypeRow[]> {
    const res = await client.query(
      `select * from public.document_types
       where org_id = $1
       order by name asc`,
      [orgId],
    );
    return res.rows.map(mapRow);
  },

  async findById(client: PoolClient, id: string): Promise<DocumentTypeRow | null> {
    const res = await client.query(`select * from public.document_types where id = $1`, [id]);
    return res.rows[0] ? mapRow(res.rows[0]) : null;
  },

  async findByCode(
    client: PoolClient,
    orgId: string,
    code: string,
  ): Promise<DocumentTypeRow | null> {
    const res = await client.query(
      `select * from public.document_types where org_id = $1 and code = $2`,
      [orgId, code],
    );
    return res.rows[0] ? mapRow(res.rows[0]) : null;
  },

  async create(
    client: PoolClient,
    orgId: string,
    input: CreateDocumentTypeInput,
  ): Promise<DocumentTypeRow> {
    const res = await client.query(
      `insert into public.document_types (
         org_id, name, code, requires_expiry, alert_days, retention_days, is_active
       ) values ($1, $2, $3, $4, $5, $6, $7)
       returning *`,
      [
        orgId,
        input.name,
        input.code,
        input.requiresExpiry ?? true,
        input.alertDays ?? [90, 60, 30],
        input.retentionDays ?? null,
        input.isActive ?? true,
      ],
    );
    return mapRow(res.rows[0]);
  },

  async update(
    client: PoolClient,
    id: string,
    input: UpdateDocumentTypeInput,
  ): Promise<DocumentTypeRow | null> {
    const sets: string[] = [];
    const values: unknown[] = [];
    let idx = 1;

    if (input.name !== undefined) {
      sets.push(`name = $${idx++}`);
      values.push(input.name);
    }
    if (input.code !== undefined) {
      sets.push(`code = $${idx++}`);
      values.push(input.code);
    }
    if (input.requiresExpiry !== undefined) {
      sets.push(`requires_expiry = $${idx++}`);
      values.push(input.requiresExpiry);
    }
    if (input.alertDays !== undefined) {
      sets.push(`alert_days = $${idx++}`);
      values.push(input.alertDays);
    }
    if (input.retentionDays !== undefined) {
      sets.push(`retention_days = $${idx++}`);
      values.push(input.retentionDays);
    }
    if (input.isActive !== undefined) {
      sets.push(`is_active = $${idx++}`);
      values.push(input.isActive);
    }

    if (sets.length === 0) {
      return this.findById(client, id);
    }

    values.push(id);
    const res = await client.query(
      `update public.document_types set ${sets.join(", ")} where id = $${idx} returning *`,
      values,
    );
    return res.rows[0] ? mapRow(res.rows[0]) : null;
  },

  async remove(client: PoolClient, id: string): Promise<void> {
    await client.query(`delete from public.document_types where id = $1`, [id]);
  },
};
