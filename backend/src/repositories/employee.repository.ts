import type { PoolClient } from "pg";
import type { EmployeeFilter, CreateEmployeeInput, UpdateEmployeeInput } from "@app/shared/schemas";

export interface EmployeeRow {
  id: string;
  orgId: string;
  userId: string | null;
  employeeCode: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
  dob: string | null;
  gender: string | null;
  nationality: string | null;
  maritalStatus: string | null;
  departmentId: string | null;
  departmentName: string | null;
  designationId: string | null;
  designationTitle: string | null;
  reportingManagerId: string | null;
  joiningDate: string;
  employmentType: string;
  basicSalary: string;
  bankAccount: string | null;
  iban: string | null;
  status: string;
  createdAt: string;
  updatedAt: string;
}

// Dates/timestamps are cast to text in SQL — node-pg maps `date`/`timestamptz`
// to JS `Date` otherwise, which silently shifts by the server's local offset
// (same pitfall fixed for auth in db/migrations/023_employee_login_dob_text.sql).
const SELECT_COLUMNS = `
  e.id, e.org_id, e.user_id, e.employee_code, e.first_name, e.last_name, e.email, e.phone,
  to_char(e.dob, 'YYYY-MM-DD') as dob, e.gender, e.nationality, e.marital_status,
  e.department_id, d.name as department_name, e.designation_id, g.title as designation_title,
  e.reporting_manager_id, to_char(e.joining_date, 'YYYY-MM-DD') as joining_date,
  e.employment_type, e.basic_salary, e.bank_account, e.iban, e.status,
  to_char(e.created_at at time zone 'utc', 'YYYY-MM-DD"T"HH24:MI:SS."000Z"') as created_at,
  to_char(e.updated_at at time zone 'utc', 'YYYY-MM-DD"T"HH24:MI:SS."000Z"') as updated_at
`;
const FROM = `from public.employees e
  left join public.departments d on d.id = e.department_id
  left join public.designations g on g.id = e.designation_id`;

export const employeeRepository = {
  async list(
    client: PoolClient,
    filter: EmployeeFilter,
  ): Promise<{ rows: EmployeeRow[]; total: number }> {
    const where: string[] = [];
    const params: unknown[] = [];

    if (filter.search) {
      params.push(`%${filter.search}%`);
      where.push(
        `(e.first_name ilike $${params.length} or e.last_name ilike $${params.length} or e.employee_code ilike $${params.length} or e.email ilike $${params.length})`,
      );
    }
    if (filter.departmentId) {
      params.push(filter.departmentId);
      where.push(`e.department_id = $${params.length}`);
    }
    if (filter.designationId) {
      params.push(filter.designationId);
      where.push(`e.designation_id = $${params.length}`);
    }
    if (filter.status) {
      params.push(filter.status);
      where.push(`e.status = $${params.length}`);
    }
    const whereSql = where.length > 0 ? `where ${where.join(" and ")}` : "";

    const { rows: countRows } = await client.query(
      `select count(*)::int as total ${FROM} ${whereSql}`,
      params,
    );

    const sortColumn = `e.${filter.sort}`;
    const limitIdx = params.length + 1;
    const offsetIdx = params.length + 2;
    const { rows } = await client.query(
      `select ${SELECT_COLUMNS} ${FROM} ${whereSql}
       order by ${sortColumn} ${filter.order} limit $${limitIdx} offset $${offsetIdx}`,
      [...params, filter.limit, (filter.page - 1) * filter.limit],
    );
    return { rows: rows.map(mapRow), total: countRows[0]?.total ?? 0 };
  },

  async count(client: PoolClient, orgId: string): Promise<number> {
    const { rows } = await client.query(
      "select count(*)::int as total from public.employees where org_id = $1",
      [orgId],
    );
    return rows[0]?.total ?? 0;
  },

  async findById(client: PoolClient, id: string): Promise<EmployeeRow | null> {
    const { rows } = await client.query(`select ${SELECT_COLUMNS} ${FROM} where e.id = $1`, [id]);
    return rows[0] ? mapRow(rows[0]) : null;
  },

  async create(
    client: PoolClient,
    orgId: string,
    input: CreateEmployeeInput,
  ): Promise<EmployeeRow> {
    const { rows } = await client.query(
      `insert into public.employees
        (org_id, employee_code, first_name, last_name, email, phone, dob, gender, nationality,
         marital_status, department_id, designation_id, reporting_manager_id, joining_date,
         employment_type, basic_salary, bank_account, iban)
       values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18)
       returning id`,
      [
        orgId,
        input.employeeCode,
        input.firstName,
        input.lastName,
        input.email,
        input.phone ?? null,
        input.dob ?? null,
        input.gender ?? null,
        input.nationality ?? null,
        input.maritalStatus ?? null,
        input.departmentId ?? null,
        input.designationId ?? null,
        input.reportingManagerId ?? null,
        input.joiningDate,
        input.employmentType,
        input.basicSalary,
        input.bankAccount ?? null,
        input.iban ?? null,
      ],
    );
    return (await employeeRepository.findById(client, rows[0].id))!;
  },

  async update(
    client: PoolClient,
    id: string,
    input: UpdateEmployeeInput,
  ): Promise<EmployeeRow | null> {
    const fields: Record<string, unknown> = {
      employee_code: input.employeeCode,
      first_name: input.firstName,
      last_name: input.lastName,
      email: input.email,
      phone: input.phone,
      dob: input.dob,
      gender: input.gender,
      nationality: input.nationality,
      marital_status: input.maritalStatus,
      department_id: input.departmentId,
      designation_id: input.designationId,
      reporting_manager_id: input.reportingManagerId,
      joining_date: input.joiningDate,
      employment_type: input.employmentType,
      basic_salary: input.basicSalary,
      bank_account: input.bankAccount,
      iban: input.iban,
      status: input.status,
    };
    const keys = Object.keys(fields).filter((k) => fields[k] !== undefined);
    if (keys.length === 0) return employeeRepository.findById(client, id);

    const setSql = keys.map((k, i) => `${k} = $${i + 2}`).join(", ");
    await client.query(`update public.employees set ${setSql} where id = $1`, [
      id,
      ...keys.map((k) => fields[k]),
    ]);
    return employeeRepository.findById(client, id);
  },

  async remove(client: PoolClient, id: string): Promise<boolean> {
    const result = await client.query("delete from public.employees where id = $1", [id]);
    return result.rowCount != null && result.rowCount > 0;
  },

  async findDepartmentByName(
    client: PoolClient,
    orgId: string,
    name: string,
  ): Promise<string | null> {
    const { rows } = await client.query(
      "select id from public.departments where org_id = $1 and name ilike $2",
      [orgId, name],
    );
    return rows[0]?.id ?? null;
  },

  async findDesignationByTitle(
    client: PoolClient,
    orgId: string,
    title: string,
  ): Promise<string | null> {
    const { rows } = await client.query(
      "select id from public.designations where org_id = $1 and title ilike $2",
      [orgId, title],
    );
    return rows[0]?.id ?? null;
  },
};

function mapRow(r: Record<string, unknown>): EmployeeRow {
  return {
    id: r["id"] as string,
    orgId: r["org_id"] as string,
    userId: r["user_id"] as string | null,
    employeeCode: r["employee_code"] as string,
    firstName: r["first_name"] as string,
    lastName: r["last_name"] as string,
    email: r["email"] as string,
    phone: r["phone"] as string | null,
    dob: r["dob"] as string | null,
    gender: r["gender"] as string | null,
    nationality: r["nationality"] as string | null,
    maritalStatus: r["marital_status"] as string | null,
    departmentId: r["department_id"] as string | null,
    departmentName: r["department_name"] as string | null,
    designationId: r["designation_id"] as string | null,
    designationTitle: r["designation_title"] as string | null,
    reportingManagerId: r["reporting_manager_id"] as string | null,
    joiningDate: r["joining_date"] as string,
    employmentType: r["employment_type"] as string,
    basicSalary: r["basic_salary"] as string,
    bankAccount: r["bank_account"] as string | null,
    iban: r["iban"] as string | null,
    status: r["status"] as string,
    createdAt: r["created_at"] as string,
    updatedAt: r["updated_at"] as string,
  };
}
