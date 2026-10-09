import type { PoolClient } from "pg";
import type {
  CreateDepartmentInput,
  UpdateDepartmentInput,
  DepartmentFilter,
} from "@app/shared/schemas";

export interface DepartmentRow {
  id: string;
  orgId: string;
  name: string;
  code: string | null;
  parentId: string | null;
  createdAt: string;
  updatedAt: string;
  parentName?: string | undefined;
  employeeCount?: number | undefined;
}

function mapRow(r: Record<string, unknown>): DepartmentRow {
  return {
    id: r["id"] as string,
    orgId: r["org_id"] as string,
    name: r["name"] as string,
    code: (r["code"] as string | null) ?? null,
    parentId: (r["parent_id"] as string | null) ?? null,
    createdAt: (r["created_at"] as Date).toISOString(),
    updatedAt: (r["updated_at"] as Date).toISOString(),
    parentName: r["parent_name"] ? (r["parent_name"] as string) : undefined,
    employeeCount: r["employee_count"] ? Number(r["employee_count"]) : 0,
  };
}

export const departmentRepository = {
  async list(
    client: PoolClient,
    orgId: string,
    filter: DepartmentFilter = {},
  ): Promise<DepartmentRow[]> {
    const where: string[] = ["d.org_id = $1"];
    const values: unknown[] = [orgId];
    let idx = 2;

    if (filter.search) {
      where.push(`(d.name ilike $${idx} or d.code ilike $${idx})`);
      values.push(`%${filter.search}%`);
      idx++;
    }

    if (filter.parentId !== undefined) {
      where.push(`d.parent_id = $${idx++}`);
      values.push(filter.parentId);
    }

    const res = await client.query(
      `select d.*,
              p.name as parent_name,
              (select count(*)::int from public.employees e where e.department_id = d.id and e.status != 'terminated') as employee_count
       from public.departments d
       left join public.departments p on p.id = d.parent_id
       where ${where.join(" and ")}
       order by d.name asc`,
      values,
    );

    return res.rows.map(mapRow);
  },

  async findById(client: PoolClient, id: string): Promise<DepartmentRow | null> {
    const res = await client.query(
      `select d.*,
              p.name as parent_name,
              (select count(*)::int from public.employees e where e.department_id = d.id and e.status != 'terminated') as employee_count
       from public.departments d
       left join public.departments p on p.id = d.parent_id
       where d.id = $1`,
      [id],
    );
    return res.rows[0] ? mapRow(res.rows[0]) : null;
  },

  async create(
    client: PoolClient,
    orgId: string,
    input: CreateDepartmentInput,
  ): Promise<DepartmentRow> {
    const res = await client.query(
      `insert into public.departments (org_id, name, code, parent_id)
       values ($1, $2, $3, $4)
       returning *`,
      [orgId, input.name, input.code ?? null, input.parentId ?? null],
    );
    return (await this.findById(client, res.rows[0]?.["id"] as string))!;
  },

  async update(
    client: PoolClient,
    id: string,
    input: UpdateDepartmentInput,
  ): Promise<DepartmentRow | null> {
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
    if (input.parentId !== undefined) {
      sets.push(`parent_id = $${idx++}`);
      values.push(input.parentId);
    }

    if (sets.length === 0) return this.findById(client, id);

    values.push(id);
    await client.query(
      `update public.departments set ${sets.join(", ")} where id = $${idx}`,
      values,
    );
    return this.findById(client, id);
  },

  async delete(client: PoolClient, id: string): Promise<void> {
    await client.query(`delete from public.departments where id = $1`, [id]);
  },
};
