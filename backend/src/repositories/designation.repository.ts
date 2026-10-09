import type { PoolClient } from "pg";
import type {
  CreateDesignationInput,
  UpdateDesignationInput,
  DesignationFilter,
} from "@app/shared/schemas";

export interface DesignationRow {
  id: string;
  orgId: string;
  title: string;
  level: number | null;
  createdAt: string;
  updatedAt: string;
  employeeCount?: number | undefined;
}

function mapRow(r: Record<string, unknown>): DesignationRow {
  return {
    id: r["id"] as string,
    orgId: r["org_id"] as string,
    title: r["title"] as string,
    level: r["level"] ? Number(r["level"]) : null,
    createdAt: (r["created_at"] as Date).toISOString(),
    updatedAt: (r["updated_at"] as Date).toISOString(),
    employeeCount: r["employee_count"] ? Number(r["employee_count"]) : 0,
  };
}

export const designationRepository = {
  async list(
    client: PoolClient,
    orgId: string,
    filter: DesignationFilter = {},
  ): Promise<DesignationRow[]> {
    const where: string[] = ["d.org_id = $1"];
    const values: unknown[] = [orgId];
    let idx = 2;

    if (filter.search) {
      where.push(`d.title ilike $${idx}`);
      values.push(`%${filter.search}%`);
      idx++;
    }

    if (filter.level !== undefined) {
      where.push(`d.level = $${idx++}`);
      values.push(filter.level);
    }

    const res = await client.query(
      `select d.*,
              (select count(*)::int from public.employees e where e.designation_id = d.id and e.status != 'terminated') as employee_count
       from public.designations d
       where ${where.join(" and ")}
       order by d.level asc nulls last, d.title asc`,
      values,
    );

    return res.rows.map(mapRow);
  },

  async findById(client: PoolClient, id: string): Promise<DesignationRow | null> {
    const res = await client.query(
      `select d.*,
              (select count(*)::int from public.employees e where e.designation_id = d.id and e.status != 'terminated') as employee_count
       from public.designations d
       where d.id = $1`,
      [id],
    );
    return res.rows[0] ? mapRow(res.rows[0]) : null;
  },

  async create(
    client: PoolClient,
    orgId: string,
    input: CreateDesignationInput,
  ): Promise<DesignationRow> {
    const res = await client.query(
      `insert into public.designations (org_id, title, level)
       values ($1, $2, $3)
       returning *`,
      [orgId, input.title, input.level ?? null],
    );
    return (await this.findById(client, res.rows[0]?.["id"] as string))!;
  },

  async update(
    client: PoolClient,
    id: string,
    input: UpdateDesignationInput,
  ): Promise<DesignationRow | null> {
    const sets: string[] = [];
    const values: unknown[] = [];
    let idx = 1;

    if (input.title !== undefined) {
      sets.push(`title = $${idx++}`);
      values.push(input.title);
    }
    if (input.level !== undefined) {
      sets.push(`level = $${idx++}`);
      values.push(input.level);
    }

    if (sets.length === 0) return this.findById(client, id);

    values.push(id);
    await client.query(
      `update public.designations set ${sets.join(", ")} where id = $${idx}`,
      values,
    );
    return this.findById(client, id);
  },

  async delete(client: PoolClient, id: string): Promise<void> {
    await client.query(`delete from public.designations where id = $1`, [id]);
  },
};
