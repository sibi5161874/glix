import type { PoolClient } from "pg";
import type { AdjustLeaveBalanceInput, LeaveBalanceFilter } from "@app/shared/schemas";

export interface LeaveBalanceRow {
  id: string;
  orgId: string;
  employeeId: string;
  employeeName: string;
  leaveTypeId: string;
  leaveTypeName: string;
  year: number;
  allocated: string;
  used: string;
  carriedOver: string;
}

const SELECT_COLUMNS = `
  b.id, b.org_id, b.employee_id, e.first_name || ' ' || e.last_name as employee_name,
  b.leave_type_id, lt.name as leave_type_name, b.year, b.allocated, b.used, b.carried_over
`;
const FROM = `from public.leave_balances b
  join public.employees e on e.id = b.employee_id
  join public.leave_types lt on lt.id = b.leave_type_id`;

export const leaveBalanceRepository = {
  async list(
    client: PoolClient,
    orgId: string,
    filter: LeaveBalanceFilter,
  ): Promise<LeaveBalanceRow[]> {
    const where = ["b.org_id = $1"];
    const params: unknown[] = [orgId];
    if (filter.employeeId) {
      params.push(filter.employeeId);
      where.push(`b.employee_id = $${params.length}`);
    }
    if (filter.year) {
      params.push(filter.year);
      where.push(`b.year = $${params.length}`);
    }
    const { rows } = await client.query(
      `select ${SELECT_COLUMNS} ${FROM} where ${where.join(" and ")}
       order by e.first_name, lt.name`,
      params,
    );
    return rows.map(mapRow);
  },

  async upsert(
    client: PoolClient,
    orgId: string,
    input: AdjustLeaveBalanceInput,
  ): Promise<LeaveBalanceRow> {
    const { rows } = await client.query(
      `insert into public.leave_balances (org_id, employee_id, leave_type_id, year, allocated, carried_over)
       values ($1,$2,$3,$4,$5,$6)
       on conflict (org_id, employee_id, leave_type_id, year)
       do update set allocated = excluded.allocated, carried_over = excluded.carried_over
       returning id`,
      [orgId, input.employeeId, input.leaveTypeId, input.year, input.allocated, input.carriedOver],
    );
    const { rows: full } = await client.query(`select ${SELECT_COLUMNS} ${FROM} where b.id = $1`, [
      rows[0].id,
    ]);
    return mapRow(full[0]);
  },
};

function mapRow(r: Record<string, unknown>): LeaveBalanceRow {
  return {
    id: r["id"] as string,
    orgId: r["org_id"] as string,
    employeeId: r["employee_id"] as string,
    employeeName: r["employee_name"] as string,
    leaveTypeId: r["leave_type_id"] as string,
    leaveTypeName: r["leave_type_name"] as string,
    year: r["year"] as number,
    allocated: r["allocated"] as string,
    used: r["used"] as string,
    carriedOver: r["carried_over"] as string,
  };
}
