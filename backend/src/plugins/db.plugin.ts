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

declare module "fastify" {
  interface FastifyInstance {
    withTenant<T>(ctx: RequestContext, fn: (client: PoolClient) => Promise<T>): Promise<T>;
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
};

export default fp(dbPlugin);
