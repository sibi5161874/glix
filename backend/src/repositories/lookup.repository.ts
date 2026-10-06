import type { PoolClient } from "pg";

export interface DepartmentRow {
  id: string;
  name: string;
}

export interface DesignationRow {
  id: string;
  title: string;
}

export const lookupRepository = {
  async listDepartments(client: PoolClient, orgId: string): Promise<DepartmentRow[]> {
    const { rows } = await client.query(
      "select id, name from public.departments where org_id = $1 order by name",
      [orgId],
    );
    return rows;
  },

  async listDesignations(client: PoolClient, orgId: string): Promise<DesignationRow[]> {
    const { rows } = await client.query(
      "select id, title from public.designations where org_id = $1 order by title",
      [orgId],
    );
    return rows;
  },
};
