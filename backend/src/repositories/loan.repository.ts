import type { PoolClient } from "pg";
import type { CreateLoanInput, LoanFilter } from "@app/shared/schemas";

export interface LoanRow {
  id: string;
  orgId: string;
  employeeId: string;
  principalAmount: string;
  monthlyInstallment: string;
  repaidAmount: string;
  startMonth: string;
  termMonths: number;
  status: "pending" | "active" | "paid_off" | "rejected";
  reason: string | null;
  approvedBy: string | null;
  approvedAt: string | null;
  createdAt: string;
  updatedAt: string;
  // Joined
  employeeName?: string | undefined;
  employeeCode?: string | undefined;
  remainingAmount?: string | undefined;
  progressPercent?: number | undefined;
}

function mapRow(r: Record<string, unknown>): LoanRow {
  const principal = Number(r["principal_amount"] ?? 0);
  const repaid = Number(r["repaid_amount"] ?? 0);
  const remaining = Math.max(0, principal - repaid);
  const progressPercent = principal > 0 ? Math.min(100, Math.round((repaid / principal) * 100)) : 0;

  // `start_month` must come pre-cast to text (`to_char(..., 'YYYY-MM-DD')`) by
  // the query — never select it as a raw `date` column. node-pg parses `date`
  // as a JS Date at *local* midnight; calling `.toISOString()` on it shifts
  // the date backward by one day in any positive-UTC-offset timezone (caught
  // here under IST: 2026-11-01 round-tripped as 2026-10-31). Same pitfall
  // already fixed for documents (document-mapper.ts) and auth
  // (023_employee_login_dob_text.sql).
  const startMonthStr = (r["start_month"] as string | null) ?? "";

  return {
    id: r["id"] as string,
    orgId: r["org_id"] as string,
    employeeId: r["employee_id"] as string,
    principalAmount: String(r["principal_amount"]),
    monthlyInstallment: String(r["monthly_installment"]),
    repaidAmount: String(r["repaid_amount"]),
    startMonth: startMonthStr,
    termMonths: Number(r["term_months"]),
    status: r["status"] as "pending" | "active" | "paid_off" | "rejected",
    reason: (r["reason"] as string | null) ?? null,
    approvedBy: (r["approved_by"] as string | null) ?? null,
    approvedAt: r["approved_at"] ? (r["approved_at"] as Date).toISOString() : null,
    createdAt: (r["created_at"] as Date).toISOString(),
    updatedAt: (r["updated_at"] as Date).toISOString(),
    employeeName: r["employee_name"] ? (r["employee_name"] as string) : undefined,
    employeeCode: r["employee_code"] ? (r["employee_code"] as string) : undefined,
    remainingAmount: remaining.toFixed(2),
    progressPercent,
  };
}

const LOAN_COLUMNS = `
  l.id, l.org_id, l.employee_id, l.principal_amount, l.monthly_installment,
  l.repaid_amount, to_char(l.start_month, 'YYYY-MM-DD') as start_month,
  l.term_months, l.status, l.reason, l.approved_by, l.approved_at,
  l.created_at, l.updated_at
`;

export const loanRepository = {
  async list(
    client: PoolClient,
    orgId: string,
    filter: LoanFilter,
    selfEmployeeId?: string,
  ): Promise<{ items: LoanRow[]; total: number; page: number; limit: number }> {
    const where: string[] = ["l.org_id = $1"];
    const values: unknown[] = [orgId];
    let idx = 2;

    if (selfEmployeeId) {
      where.push(`l.employee_id = $${idx++}`);
      values.push(selfEmployeeId);
    } else if (filter.employeeId) {
      where.push(`l.employee_id = $${idx++}`);
      values.push(filter.employeeId);
    }

    if (filter.status) {
      where.push(`l.status = $${idx++}`);
      values.push(filter.status);
    }

    if (filter.search) {
      where.push(`(
        e.first_name ilike $${idx} or
        e.last_name ilike $${idx} or
        e.employee_code ilike $${idx} or
        l.reason ilike $${idx}
      )`);
      values.push(`%${filter.search}%`);
      idx++;
    }

    const whereClause = where.join(" and ");

    const countRes = await client.query(
      `select count(*)::int as total
       from public.loans l
       join public.employees e on e.id = l.employee_id
       where ${whereClause}`,
      values,
    );
    const total = Number(countRes.rows[0]?.["total"] ?? 0);

    const page = filter.page ?? 1;
    const limit = filter.limit ?? 20;
    const offset = (page - 1) * limit;

    const itemsRes = await client.query(
      `select ${LOAN_COLUMNS},
              trim(concat(e.first_name, ' ', e.last_name)) as employee_name,
              e.employee_code as employee_code
       from public.loans l
       join public.employees e on e.id = l.employee_id
       where ${whereClause}
       order by l.created_at desc
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

  async findById(client: PoolClient, id: string): Promise<LoanRow | null> {
    const res = await client.query(
      `select ${LOAN_COLUMNS},
              trim(concat(e.first_name, ' ', e.last_name)) as employee_name,
              e.employee_code as employee_code
       from public.loans l
       join public.employees e on e.id = l.employee_id
       where l.id = $1`,
      [id],
    );
    return res.rows[0] ? mapRow(res.rows[0]) : null;
  },

  async create(client: PoolClient, orgId: string, input: CreateLoanInput): Promise<LoanRow> {
    const res = await client.query(
      `insert into public.loans (
         org_id, employee_id, principal_amount, monthly_installment,
         start_month, term_months, reason, status
       ) values ($1, $2, $3, $4, $5, $6, $7, 'pending')
       returning *`,
      [
        orgId,
        input.employeeId,
        input.principalAmount,
        input.monthlyInstallment,
        input.startMonth,
        input.termMonths,
        input.reason ?? null,
      ],
    );
    return (await this.findById(client, res.rows[0]?.["id"] as string))!;
  },

  async approve(client: PoolClient, id: string, approvedBy: string): Promise<LoanRow | null> {
    await client.query(
      `update public.loans
       set status = 'active', approved_by = $1, approved_at = now()
       where id = $2 and status = 'pending'`,
      [approvedBy, id],
    );
    return this.findById(client, id);
  },

  async reject(client: PoolClient, id: string): Promise<LoanRow | null> {
    await client.query(
      `update public.loans
       set status = 'rejected'
       where id = $1 and status = 'pending'`,
      [id],
    );
    return this.findById(client, id);
  },

  async recordPayment(client: PoolClient, id: string, amount: number): Promise<LoanRow | null> {
    const res = await client.query(
      `update public.loans
       set repaid_amount = repaid_amount + $1,
           status = case when (repaid_amount + $1) >= principal_amount then 'paid_off' else status end
       where id = $2
       returning *`,
      [amount, id],
    );
    return res.rows[0] ? await this.findById(client, id) : null;
  },

  async getSummary(client: PoolClient, orgId: string, selfEmployeeId?: string) {
    const filterSelf = selfEmployeeId ? "and employee_id = $2" : "";
    const params = selfEmployeeId ? [orgId, selfEmployeeId] : [orgId];

    const res = await client.query(
      `select
         count(*)::int as total,
         count(case when status = 'active' then 1 end)::int as active_count,
         count(case when status = 'pending' then 1 end)::int as pending_count,
         coalesce(sum(case when status = 'active' then principal_amount - repaid_amount else 0 end), 0) as total_outstanding,
         coalesce(sum(repaid_amount), 0) as total_repaid
       from public.loans
       where org_id = $1 ${filterSelf}`,
      params,
    );

    const r = res.rows[0] || {};
    return {
      total: Number(r["total"] ?? 0),
      activeCount: Number(r["active_count"] ?? 0),
      pendingCount: Number(r["pending_count"] ?? 0),
      totalOutstanding: Number(r["total_outstanding"] ?? 0).toFixed(2),
      totalRepaid: Number(r["total_repaid"] ?? 0).toFixed(2),
    };
  },
};
