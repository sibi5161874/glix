import fp from "fastify-plugin";
import type { FastifyPluginAsync } from "fastify";
import type { Pool, PoolClient } from "pg";

export interface RequestContext {
  userId: string;
  orgId: string;
  role: string;
  employeeId?: string;
  isPlatformAdmin: boolean;
}

export interface PlatformContext {
  userId: string;
}

declare module "fastify" {
  interface FastifyInstance {
    withTenant<T>(ctx: RequestContext, fn: (client: PoolClient) => Promise<T>): Promise<T>;
    withPlatform<T>(ctx: PlatformContext, fn: (client: PoolClient) => Promise<T>): Promise<T>;
  }
}

const dbPlugin: FastifyPluginAsync = async (fastify) => {
  fastify.decorate("withTenant", async function withTenant<
    T,
  >(ctx: RequestContext, fn: (client: PoolClient) => Promise<T>): Promise<T> {
    const pool = (fastify.pg as unknown as { pool: Pool }).pool;
    const client = await pool.connect();
    try {
      await client.query("begin");
      await client.query("select set_config('app.user_id', $1, true)", [ctx.userId]);
      await client.query("select set_config('app.org_id', $1, true)", [ctx.orgId]);
      await client.query("select set_config('app.role', $1, true)", [ctx.role]);
      await client.query("select set_config('app.employee_id', $1, true)", [ctx.employeeId ?? ""]);
      await client.query("select set_config('app.is_platform_admin', $1, true)", [
        String(ctx.isPlatformAdmin),
      ]);
      const result = await fn(client);
      await client.query("commit");
      return result;
    } catch (err) {
      await client.query("rollback");
      throw err;
    } finally {
      client.release();
    }
  });

  // For platform-admin-only routes with no org to scope by (e.g. cross-org
  // support ticket management) — sets only `app.is_platform_admin`, which is
  // all the RLS policies' `is_platform_admin()` bypass checks for. `org_id`
  // is deliberately left unset so a query can't accidentally rely on it.
  fastify.decorate("withPlatform", async function withPlatform<
    T,
  >(ctx: PlatformContext, fn: (client: PoolClient) => Promise<T>): Promise<T> {
    const pool = (fastify.pg as unknown as { pool: Pool }).pool;
    const client = await pool.connect();
    try {
      await client.query("begin");
      await client.query("select set_config('app.user_id', $1, true)", [ctx.userId]);
      await client.query("select set_config('app.is_platform_admin', 'true', true)");
      const result = await fn(client);
      await client.query("commit");
      return result;
    } catch (err) {
      await client.query("rollback");
      throw err;
    } finally {
      client.release();
    }
  });
};

export default fp(dbPlugin);
