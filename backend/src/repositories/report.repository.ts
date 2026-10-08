import type { PoolClient } from "pg";

export interface BreakdownRow {
  label: string;
  count: number;
}

export interface EmployeeDemographicsReport {
  totalEmployees: number;
  byDepartment: BreakdownRow[];
  byDesignation: BreakdownRow[];
  byGender: BreakdownRow[];
  byEmploymentType: BreakdownRow[];
  byStatus: BreakdownRow[];
}

export interface LeaveTypeUtilization {
  leaveType: string;
  totalAllocated: number;
  totalUsed: number;
  totalCarriedOver: number;
  utilizationPercent: number;
}

export interface LeaveUtilizationReport {
  year: number;
  pendingRequests: number;
  approvedDaysThisYear: number;
  byLeaveType: LeaveTypeUtilization[];
}

async function groupCount(
  client: PoolClient,
  orgId: string,
  table: string,
  column: string,
  joinName?: { table: string; idCol: string; nameCol: string },
): Promise<BreakdownRow[]> {
  const selectLabel = joinName ? `coalesce(j.${joinName.nameCol}, 'Unassigned')` : `e.${column}`;
  const joinSql = joinName ? `left join public.${joinName.table} j on j.id = e.${column}` : "";
  const { rows } = await client.query(
    `select ${selectLabel} as label, count(*)::int as count
     from public.${table} e ${joinSql}
     where e.org_id = $1
     group by ${selectLabel}
     order by count desc`,
    [orgId],
  );
  return rows.map((r) => ({ label: r.label ?? "Unspecified", count: r.count }));
}

export const reportRepository = {
  async documentsByType(client: PoolClient, orgId: string): Promise<BreakdownRow[]> {
    const { rows } = await client.query(
      `select dt.name as label, count(d.id)::int as count
       from public.document_types dt
       left join public.documents d on d.document_type_id = dt.id and d.org_id = dt.org_id
       where dt.org_id = $1
       group by dt.name
       order by count desc`,
      [orgId],
    );
    return rows.map((r) => ({ label: r.label, count: r.count }));
  },

  async loansByStatus(client: PoolClient, orgId: string): Promise<BreakdownRow[]> {
    const { rows } = await client.query(
      `select status as label, count(*)::int as count
       from public.loans where org_id = $1
       group by status
       order by count desc`,
      [orgId],
    );
    return rows.map((r) => ({ label: r.label, count: r.count }));
  },

  async employeeDemographics(
    client: PoolClient,
    orgId: string,
  ): Promise<EmployeeDemographicsReport> {
    const { rows: totalRows } = await client.query(
      "select count(*)::int as total from public.employees where org_id = $1",
      [orgId],
    );
    // Sequential, not Promise.all — these all run on the same tenant-scoped
    // `client`, and a single `pg` connection can't have two queries in
    // flight concurrently. `pg` currently queues them internally and just
    // warns ("Calling client.query() when the client is already executing a
    // query is deprecated"); a future major version removes that queuing.
    const byDepartment = await groupCount(client, orgId, "employees", "department_id", {
      table: "departments",
      idCol: "id",
      nameCol: "name",
    });
    const byDesignation = await groupCount(client, orgId, "employees", "designation_id", {
      table: "designations",
      idCol: "id",
      nameCol: "title",
    });
    const byGender = await groupCount(client, orgId, "employees", "gender");
    const byEmploymentType = await groupCount(client, orgId, "employees", "employment_type");
    const byStatus = await groupCount(client, orgId, "employees", "status");
    return {
      totalEmployees: totalRows[0]?.total ?? 0,
      byDepartment,
      byDesignation,
      byGender,
      byEmploymentType,
      byStatus,
    };
  },

  async leaveUtilization(
    client: PoolClient,
    orgId: string,
    year: number,
  ): Promise<LeaveUtilizationReport> {
    const { rows: byType } = await client.query(
      `select lt.name as leave_type,
              coalesce(sum(b.allocated), 0) as total_allocated,
              coalesce(sum(b.used), 0) as total_used,
              coalesce(sum(b.carried_over), 0) as total_carried_over
       from public.leave_types lt
       left join public.leave_balances b
         on b.leave_type_id = lt.id and b.org_id = lt.org_id and b.year = $2
       where lt.org_id = $1
       group by lt.name
       order by lt.name`,
      [orgId, year],
    );

    const { rows: pendingRows } = await client.query(
      "select count(*)::int as total from public.leave_requests where org_id = $1 and status = 'pending'",
      [orgId],
    );
    const { rows: approvedRows } = await client.query(
      `select coalesce(sum(total_days), 0) as total from public.leave_requests
       where org_id = $1 and status = 'approved' and extract(year from start_date) = $2`,
      [orgId, year],
    );

    return {
      year,
      pendingRequests: pendingRows[0]?.total ?? 0,
      approvedDaysThisYear: Number(approvedRows[0]?.total ?? 0),
      byLeaveType: byType.map((r) => {
        const allocated = Number(r.total_allocated);
        const used = Number(r.total_used);
        return {
          leaveType: r.leave_type,
          totalAllocated: allocated,
          totalUsed: used,
          totalCarriedOver: Number(r.total_carried_over),
          utilizationPercent: allocated > 0 ? Math.round((used / allocated) * 100) : 0,
        };
      }),
    };
  },
};
