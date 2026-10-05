import type { FastifyInstance } from "fastify";

export interface UserCredentials {
  id: string;
  passwordHash: string | null;
  fullName: string | null;
}

export interface EmployeeLoginRow {
  userId: string;
  passwordHash: string | null;
  /** Formatted "YYYY-MM-DD" by the DB (find_employee_login) — never a Date. */
  dob: string | null;
  employeeId: string;
  orgId: string;
  role: "org_admin" | "org_staff" | "org_viewer" | null;
  employeeStatus: string;
}

export interface RegisteredOrg {
  userId: string;
  orgId: string;
}

/** All three calls go through SECURITY DEFINER functions (021_auth_functions.sql) —
 * pre-authentication, so RLS can't be satisfied directly. See that migration's comments. */
export const authRepository = {
  async findUserByEmail(fastify: FastifyInstance, email: string): Promise<UserCredentials | null> {
    const { rows } = await fastify.pg.query(
      "select id, password_hash, full_name from public.find_user_by_email($1)",
      [email],
    );
    const row = rows[0];
    if (!row) return null;
    return { id: row.id, passwordHash: row.password_hash, fullName: row.full_name };
  },

  async findEmployeeLogin(
    fastify: FastifyInstance,
    employeeCode: string,
  ): Promise<EmployeeLoginRow[]> {
    const { rows } = await fastify.pg.query(
      `select user_id, password_hash, dob, employee_id, org_id, role, employee_status
       from public.find_employee_login($1)`,
      [employeeCode],
    );
    return rows.map((r) => ({
      userId: r.user_id,
      passwordHash: r.password_hash,
      dob: r.dob,
      employeeId: r.employee_id,
      orgId: r.org_id,
      role: r.role,
      employeeStatus: r.employee_status,
    }));
  },

  async registerOrganization(
    fastify: FastifyInstance,
    input: {
      email: string;
      passwordHash: string;
      fullName: string;
      orgName: string;
      orgSlug: string;
      planSlug: string;
      currency: string;
      phone?: string | undefined;
      industry?: string | undefined;
    },
  ): Promise<RegisteredOrg> {
    const { rows } = await fastify.pg.query(
      `select user_id, org_id from public.register_organization($1,$2,$3,$4,$5,$6,$7,$8,$9)`,
      [
        input.email,
        input.passwordHash,
        input.fullName,
        input.orgName,
        input.orgSlug,
        input.planSlug,
        input.currency,
        input.phone ?? null,
        input.industry ?? null,
      ],
    );
    const row = rows[0];
    return { userId: row.user_id, orgId: row.org_id };
  },

  async findUserMemberships(
    fastify: FastifyInstance,
    userId: string,
  ): Promise<Array<{ orgId: string; role: string }>> {
    const { rows } = await fastify.pg.query(
      "select org_id, role from public.find_user_memberships($1)",
      [userId],
    );
    return rows.map((r) => ({ orgId: r.org_id, role: r.role }));
  },

  async isPlatformAdmin(fastify: FastifyInstance, userId: string): Promise<boolean> {
    const { rows } = await fastify.pg.query("select public.is_user_platform_admin($1) as v", [
      userId,
    ]);
    return rows[0]?.v === true;
  },
};
