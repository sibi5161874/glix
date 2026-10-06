import type { PoolClient } from "pg";
import type { CreateLeaveRequestInput, LeaveRequestFilter } from "@app/shared/schemas";

export interface LeaveRequestRow {
  id: string;
  orgId: string;
  employeeId: string;
  employeeName: string;
  leaveTypeId: string;
  leaveTypeName: string;
  startDate: string;
  endDate: string;
  totalDays: string;
  reason: string | null;
  status: string;
  approvedBy: string | null;
  approvedAt: string | null;
  rejectionReason: string | null;
  createdAt: string;
}

const SELECT_COLUMNS = `
  r.id, r.org_id, r.employee_id,
  e.first_name || ' ' || e.last_name as employee_name,
  r.leave_type_id, lt.name as leave_type_name,
  to_char(r.start_date, 'YYYY-MM-DD') as start_date,
  to_char(r.end_date, 'YYYY-MM-DD') as end_date,
  r.total_days, r.reason, r.status, r.approved_by,
  to_char(r.approved_at at time zone 'utc', 'YYYY-MM-DD"T"HH24:MI:SS."000Z"') as approved_at,
  r.rejection_reason,
  to_char(r.created_at at time zone 'utc', 'YYYY-MM-DD"T"HH24:MI:SS."000Z"') as created_at
`;
const FROM = `from public.leave_requests r
  join public.employees e on e.id = r.employee_id
  join public.leave_types lt on lt.id = r.leave_type_id`;

export const leaveRequestRepository = {
  async list(client: PoolClient, filter: LeaveRequestFilter): Promise<LeaveRequestRow[]> {
    const where: string[] = [];
    const params: unknown[] = [];
    if (filter.status) {
      params.push(filter.status);
      where.push(`r.status = $${params.length}`);
    }
    if (filter.employeeId) {
      params.push(filter.employeeId);
      where.push(`r.employee_id = $${params.length}`);
    }
    if (filter.leaveTypeId) {
      params.push(filter.leaveTypeId);
      where.push(`r.leave_type_id = $${params.length}`);
    }
    if (filter.fromDate) {
      params.push(filter.fromDate);
      where.push(`r.end_date >= $${params.length}`);
    }
    if (filter.toDate) {
      params.push(filter.toDate);
      where.push(`r.start_date <= $${params.length}`);
    }
    const whereSql = where.length > 0 ? `where ${where.join(" and ")}` : "";
    const limitIdx = params.length + 1;
    const offsetIdx = params.length + 2;
    const { rows } = await client.query(
      `select ${SELECT_COLUMNS} ${FROM} ${whereSql}
       order by r.created_at desc limit $${limitIdx} offset $${offsetIdx}`,
      [...params, filter.limit, (filter.page - 1) * filter.limit],
    );
    return rows.map(mapRow);
  },

  async findById(client: PoolClient, id: string): Promise<LeaveRequestRow | null> {
    const { rows } = await client.query(`select ${SELECT_COLUMNS} ${FROM} where r.id = $1`, [id]);
    return rows[0] ? mapRow(rows[0]) : null;
  },

  async create(
    client: PoolClient,
    orgId: string,
    totalDays: number,
    input: CreateLeaveRequestInput,
  ): Promise<LeaveRequestRow> {
    const { rows } = await client.query(
      `insert into public.leave_requests
        (org_id, employee_id, leave_type_id, start_date, end_date, total_days, reason, attachment_url)
       values ($1,$2,$3,$4,$5,$6,$7,$8) returning id`,
      [
        orgId,
        input.employeeId,
        input.leaveTypeId,
        input.startDate,
        input.endDate,
        totalDays,
        input.reason ?? null,
        input.attachmentUrl ?? null,
      ],
    );
    return (await leaveRequestRepository.findById(client, rows[0].id))!;
  },

  async remove(client: PoolClient, id: string): Promise<boolean> {
    const result = await client.query("delete from public.leave_requests where id = $1", [id]);
    return result.rowCount != null && result.rowCount > 0;
  },

  async setStatus(
    client: PoolClient,
    id: string,
    status: "approved" | "rejected" | "cancelled",
    opts: { approvedBy?: string; rejectionReason?: string } = {},
  ): Promise<LeaveRequestRow | null> {
    await client.query(
      `update public.leave_requests
       set status = $2,
           approved_by = case when $2 = 'approved' then $3 else approved_by end,
           approved_at = case when $2 = 'approved' then now() else approved_at end,
           rejection_reason = coalesce($4, rejection_reason)
       where id = $1`,
      [id, status, opts.approvedBy ?? null, opts.rejectionReason ?? null],
    );
    return leaveRequestRepository.findById(client, id);
  },
};

function mapRow(r: Record<string, unknown>): LeaveRequestRow {
  return {
    id: r["id"] as string,
    orgId: r["org_id"] as string,
    employeeId: r["employee_id"] as string,
    employeeName: r["employee_name"] as string,
    leaveTypeId: r["leave_type_id"] as string,
    leaveTypeName: r["leave_type_name"] as string,
    startDate: r["start_date"] as string,
    endDate: r["end_date"] as string,
    totalDays: r["total_days"] as string,
    reason: r["reason"] as string | null,
    status: r["status"] as string,
    approvedBy: r["approved_by"] as string | null,
    approvedAt: r["approved_at"] as string | null,
    rejectionReason: r["rejection_reason"] as string | null,
    createdAt: r["created_at"] as string,
  };
}
