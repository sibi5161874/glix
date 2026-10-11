import type { PoolClient } from "pg";
import type { PlatformTeamInput } from "@app/shared/schemas";

export interface PlatformTeamRow {
  id: string;
  email: string;
  fullName: string;
  role: "owner" | "admin" | "support";
  createdAt: string;
}

export interface PlatformSettingRow {
  key: string;
  value: Record<string, unknown>;
  updatedBy: string | null;
  updatedAt: string;
}

export const platformSettingsRepository = {
  async listSettings(client: PoolClient): Promise<PlatformSettingRow[]> {
    const res = await client.query(
      `select key, value, updated_by,
              to_char(updated_at at time zone 'utc', 'YYYY-MM-DD"T"HH24:MI:SS."000Z"') as updated_at
       from public.platform_settings order by key asc`,
    );
    return res.rows.map((r) => ({
      key: r["key"] as string,
      value: r["value"] as Record<string, unknown>,
      updatedBy: (r["updated_by"] as string | null) ?? null,
      updatedAt: r["updated_at"] as string,
    }));
  },

  async getSetting(client: PoolClient, key: string): Promise<Record<string, unknown> | null> {
    const res = await client.query(`select value from public.platform_settings where key = $1`, [
      key,
    ]);
    return res.rows[0] ? (res.rows[0]["value"] as Record<string, unknown>) : null;
  },

  async upsertSetting(
    client: PoolClient,
    key: string,
    value: Record<string, unknown>,
    userId: string,
  ): Promise<void> {
    await client.query(
      `insert into public.platform_settings (key, value, updated_by, updated_at)
       values ($1, $2, (select id from public.platform_users where id = $3), now())
       on conflict (key) do update
       set value = $2, updated_by = (select id from public.platform_users where id = $3), updated_at = now()`,
      [key, JSON.stringify(value), userId],
    );
  },

  async listTeam(client: PoolClient): Promise<PlatformTeamRow[]> {
    const res = await client.query(
      `select id, email, full_name, role,
              to_char(created_at at time zone 'utc', 'YYYY-MM-DD"T"HH24:MI:SS."000Z"') as created_at
       from public.platform_users order by created_at desc`,
    );
    return res.rows.map((r) => ({
      id: r["id"] as string,
      email: r["email"] as string,
      fullName: r["full_name"] as string,
      role: r["role"] as PlatformTeamRow["role"],
      createdAt: r["created_at"] as string,
    }));
  },

  async addTeamMember(
    client: PoolClient,
    userId: string,
    input: PlatformTeamInput,
  ): Promise<PlatformTeamRow> {
    await client.query(
      `insert into public.platform_users (id, email, full_name, role)
       values ($1, $2, $3, $4)
       on conflict (id) do update set role = $4, full_name = $3`,
      [userId, input.email, input.fullName, input.role],
    );
    const res = await client.query(
      `select id, email, full_name, role,
              to_char(created_at at time zone 'utc', 'YYYY-MM-DD"T"HH24:MI:SS."000Z"') as created_at
       from public.platform_users where id = $1`,
      [userId],
    );
    const r = res.rows[0]!;
    return {
      id: r["id"] as string,
      email: r["email"] as string,
      fullName: r["full_name"] as string,
      role: r["role"] as PlatformTeamRow["role"],
      createdAt: r["created_at"] as string,
    };
  },
};
