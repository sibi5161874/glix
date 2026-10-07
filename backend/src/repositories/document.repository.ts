import type { PoolClient } from "pg";
import type { UploadDocumentInput, UpdateDocumentInput, DocumentFilter } from "@app/shared/schemas";
import { mapDocumentRow, type DocumentRow } from "./document-mapper";

export type { DocumentRow };

// Dates/timestamps cast to text in SQL — see document-mapper.ts's note on why
// `d.*` (raw `date`/`timestamptz` columns) must never be selected directly.
const DOCUMENT_COLUMNS = `
  d.id, d.org_id, d.employee_id, d.document_type_id, d.document_number,
  to_char(d.issue_date, 'YYYY-MM-DD') as issue_date,
  to_char(d.expiry_date, 'YYYY-MM-DD') as expiry_date,
  d.file_path, d.file_size, d.mime_type,
  d.alert_90_sent, d.alert_60_sent, d.alert_30_sent, d.uploaded_by,
  to_char(d.created_at at time zone 'utc', 'YYYY-MM-DD"T"HH24:MI:SS."000Z"') as created_at,
  to_char(d.updated_at at time zone 'utc', 'YYYY-MM-DD"T"HH24:MI:SS."000Z"') as updated_at
`;
const FROM = `from public.documents d
  join public.employees e on e.id = d.employee_id
  join public.document_types dt on dt.id = d.document_type_id`;
const JOINED_COLUMNS = `
  trim(concat(e.first_name, ' ', e.last_name)) as employee_name,
  e.employee_code as employee_code,
  dt.name as document_type_name,
  dt.code as document_type_code
`;

export const documentRepository = {
  async list(
    client: PoolClient,
    orgId: string,
    filter: DocumentFilter,
    selfEmployeeId?: string,
  ): Promise<{ items: DocumentRow[]; total: number; page: number; limit: number }> {
    const where: string[] = ["d.org_id = $1"];
    const values: unknown[] = [orgId];
    let idx = 2;

    if (selfEmployeeId) {
      where.push(`d.employee_id = $${idx++}`);
      values.push(selfEmployeeId);
    } else if (filter.employeeId) {
      where.push(`d.employee_id = $${idx++}`);
      values.push(filter.employeeId);
    }

    if (filter.documentTypeId) {
      where.push(`d.document_type_id = $${idx++}`);
      values.push(filter.documentTypeId);
    }

    if (filter.expiryWithinDays !== undefined) {
      where.push(
        `d.expiry_date is not null and d.expiry_date <= (current_date + ($${idx++} * interval '1 day')) and d.expiry_date >= current_date`,
      );
      values.push(filter.expiryWithinDays);
    }

    if (filter.status === "expired") {
      where.push(`d.expiry_date is not null and d.expiry_date < current_date`);
    } else if (filter.status === "expiring") {
      where.push(
        `d.expiry_date is not null and d.expiry_date >= current_date and d.expiry_date <= (current_date + interval '90 days')`,
      );
    } else if (filter.status === "active") {
      where.push(`d.expiry_date is null or d.expiry_date > (current_date + interval '90 days')`);
    }

    if (filter.search) {
      where.push(`(
        e.first_name ilike $${idx} or
        e.last_name ilike $${idx} or
        e.employee_code ilike $${idx} or
        dt.name ilike $${idx} or
        d.document_number ilike $${idx}
      )`);
      values.push(`%${filter.search}%`);
      idx++;
    }

    const whereClause = where.join(" and ");

    const countRes = await client.query(
      `select count(*)::int as total ${FROM} where ${whereClause}`,
      values,
    );
    const total = Number(countRes.rows[0]?.["total"] ?? 0);

    const page = filter.page ?? 1;
    const limit = filter.limit ?? 20;
    const offset = (page - 1) * limit;

    const itemsRes = await client.query(
      `select ${DOCUMENT_COLUMNS}, ${JOINED_COLUMNS} ${FROM}
       where ${whereClause}
       order by d.created_at desc
       limit $${idx++} offset $${idx++}`,
      [...values, limit, offset],
    );

    return {
      items: itemsRes.rows.map(mapDocumentRow),
      total,
      page,
      limit,
    };
  },

  async findById(client: PoolClient, id: string): Promise<DocumentRow | null> {
    const res = await client.query(
      `select ${DOCUMENT_COLUMNS}, ${JOINED_COLUMNS} ${FROM} where d.id = $1`,
      [id],
    );
    return res.rows[0] ? mapDocumentRow(res.rows[0]) : null;
  },

  async create(
    client: PoolClient,
    orgId: string,
    uploadedBy: string,
    input: UploadDocumentInput,
  ): Promise<DocumentRow> {
    const res = await client.query(
      `insert into public.documents (
         org_id, employee_id, document_type_id, document_number,
         issue_date, expiry_date, file_path, file_size, mime_type, uploaded_by
       ) values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
       returning id`,
      [
        orgId,
        input.employeeId,
        input.documentTypeId,
        input.documentNumber ?? null,
        input.issueDate ?? null,
        input.expiryDate ?? null,
        input.filePath,
        input.fileSize,
        input.mimeType,
        uploadedBy,
      ],
    );
    return (await documentRepository.findById(client, res.rows[0]?.["id"] as string))!;
  },

  async update(
    client: PoolClient,
    id: string,
    input: UpdateDocumentInput,
  ): Promise<DocumentRow | null> {
    const sets: string[] = [];
    const values: unknown[] = [];
    let idx = 1;

    if (input.documentNumber !== undefined) {
      sets.push(`document_number = $${idx++}`);
      values.push(input.documentNumber);
    }
    if (input.issueDate !== undefined) {
      sets.push(`issue_date = $${idx++}`);
      values.push(input.issueDate);
    }
    if (input.expiryDate !== undefined) {
      sets.push(`expiry_date = $${idx++}`);
      values.push(input.expiryDate);
    }

    if (sets.length === 0) return documentRepository.findById(client, id);

    values.push(id);
    await client.query(`update public.documents set ${sets.join(", ")} where id = $${idx}`, values);
    return documentRepository.findById(client, id);
  },

  async remove(client: PoolClient, id: string): Promise<void> {
    await client.query(`delete from public.documents where id = $1`, [id]);
  },

  async getSummary(
    client: PoolClient,
    orgId: string,
    selfEmployeeId?: string,
  ): Promise<{
    total: number;
    active: number;
    expiring30: number;
    expiring60: number;
    expiring90: number;
    expired: number;
  }> {
    const filterSelf = selfEmployeeId ? "and employee_id = $2" : "";
    const params = selfEmployeeId ? [orgId, selfEmployeeId] : [orgId];

    const res = await client.query(
      `select
         count(*)::int as total,
         count(case when expiry_date is not null and expiry_date < current_date then 1 end)::int as expired,
         count(case when expiry_date is not null and expiry_date >= current_date and expiry_date <= (current_date + interval '30 days') then 1 end)::int as expiring_30,
         count(case when expiry_date is not null and expiry_date > (current_date + interval '30 days') and expiry_date <= (current_date + interval '60 days') then 1 end)::int as expiring_60,
         count(case when expiry_date is not null and expiry_date > (current_date + interval '60 days') and expiry_date <= (current_date + interval '90 days') then 1 end)::int as expiring_90,
         count(case when expiry_date is null or expiry_date > (current_date + interval '90 days') then 1 end)::int as active
       from public.documents
       where org_id = $1 ${filterSelf}`,
      params,
    );

    const row = res.rows[0] || {};
    return {
      total: Number(row["total"] ?? 0),
      active: Number(row["active"] ?? 0),
      expiring30: Number(row["expiring_30"] ?? 0),
      expiring60: Number(row["expiring_60"] ?? 0),
      expiring90: Number(row["expiring_90"] ?? 0),
      expired: Number(row["expired"] ?? 0),
    };
  },
};
