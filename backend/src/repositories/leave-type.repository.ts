import type { PoolClient } from "pg";
import type { CreateLeaveTypeInput, UpdateLeaveTypeInput } from "@app/shared/schemas";

export interface LeaveTypeRow {
  id: string;
  orgId: string;
  name: string;
  code: string;
  daysPerYear: string;
  isPaid: boolean;
  requiresApproval: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

const SELECT_COLUMNS = `
  id, org_id, name, code, days_per_year, is_paid, requires_approval, is_active,
  to_char(created_at at time zone 'utc', 'YYYY-MM-DD"T"HH24:MI:SS."000Z"') as created_at,
  to_char(updated_at at time zone 'utc', 'YYYY-MM-DD"T"HH24:MI:SS."000Z"') as updated_at
`;

export const leaveTypeRepository = {
  async list(client: PoolClient, orgId: string): Promise<LeaveTypeRow[]> {
    const { rows } = await client.query(
      `select ${SELECT_COLUMNS} from public.leave_types where org_id = $1 order by name`,
      [orgId],
    );
    return rows.map(mapRow);
  },

  async findById(client: PoolClient, id: string): Promise<LeaveTypeRow | null> {
    const { rows } = await client.query(
      `select ${SELECT_COLUMNS} from public.leave_types where id = $1`,
      [id],
    );
    return rows[0] ? mapRow(rows[0]) : null;
  },

  async create(
    client: PoolClient,
    orgId: string,
    input: CreateLeaveTypeInput,
  ): Promise<LeaveTypeRow> {
    const { rows } = await client.query(
      `insert into public.leave_types (org_id, name, code, days_per_year, is_paid, requires_approval)
       values ($1,$2,$3,$4,$5,$6) returning id`,
      [orgId, input.name, input.code, input.daysPerYear, input.isPaid, input.requiresApproval],
    );
    return (await leaveTypeRepository.findById(client, rows[0].id))!;
  },

  async update(
    client: PoolClient,
    id: string,
    input: UpdateLeaveTypeInput,
  ): Promise<LeaveTypeRow | null> {
    const fields: Record<string, unknown> = {
      name: input.name,
      code: input.code,
      days_per_year: input.daysPerYear,
      is_paid: input.isPaid,
      requires_approval: input.requiresApproval,
      is_active: input.isActive,
    };
    const keys = Object.keys(fields).filter((k) => fields[k] !== undefined);
    if (keys.length === 0) return leaveTypeRepository.findById(client, id);

    const setSql = keys.map((k, i) => `${k} = $${i + 2}`).join(", ");
    await client.query(`update public.leave_types set ${setSql} where id = $1`, [
      id,
      ...keys.map((k) => fields[k]),
    ]);
    return leaveTypeRepository.findById(client, id);
  },

  async remove(client: PoolClient, id: string): Promise<boolean> {
    const result = await client.query("delete from public.leave_types where id = $1", [id]);
    return result.rowCount != null && result.rowCount > 0;
  },
};

function mapRow(r: Record<string, unknown>): LeaveTypeRow {
  return {
    id: r["id"] as string,
    orgId: r["org_id"] as string,
    name: r["name"] as string,
    code: r["code"] as string,
    daysPerYear: r["days_per_year"] as string,
    isPaid: r["is_paid"] as boolean,
    requiresApproval: r["requires_approval"] as boolean,
    isActive: r["is_active"] as boolean,
    createdAt: r["created_at"] as string,
    updatedAt: r["updated_at"] as string,
  };
}
