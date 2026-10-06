import type { FastifyInstance } from "fastify";
import type { PoolClient } from "pg";
import { isWithinLimit } from "@app/shared/config";
import type { CreateEmployeeInput, UpdateEmployeeInput, EmployeeFilter } from "@app/shared/schemas";
import type { RequestContext } from "../plugins/db.plugin";
import { employeeRepository, type EmployeeRow } from "../repositories/employee.repository";
import { ConflictError, NotFoundError } from "../utils/errors";
import { importEmployeesFromCsv, type ImportSummary } from "./employee-import.service";
import { buildEmployeeWorkbook } from "./employee-export.service";

export const employeeService = {
  async list(
    fastify: FastifyInstance,
    ctx: RequestContext,
    filter: EmployeeFilter,
  ): Promise<{ rows: EmployeeRow[]; total: number; page: number; limit: number }> {
    const { rows, total } = await fastify.withTenant(ctx, (client) =>
      employeeRepository.list(client, filter),
    );
    return { rows, total, page: filter.page, limit: filter.limit };
  },

  async findById(fastify: FastifyInstance, ctx: RequestContext, id: string): Promise<EmployeeRow> {
    const row = await fastify.withTenant(ctx, (client) => employeeRepository.findById(client, id));
    if (!row || row.orgId !== ctx.orgId) throw new NotFoundError("Employee");
    return row;
  },

  async create(
    fastify: FastifyInstance,
    ctx: RequestContext,
    input: CreateEmployeeInput,
  ): Promise<EmployeeRow> {
    return fastify.withTenant(ctx, async (client) => {
      await assertWithinEmployeeLimit(client, ctx.orgId, 1);
      try {
        return await employeeRepository.create(client, ctx.orgId, input);
      } catch (err) {
        throw mapInsertError(err);
      }
    });
  },

  async update(
    fastify: FastifyInstance,
    ctx: RequestContext,
    id: string,
    input: UpdateEmployeeInput,
  ): Promise<EmployeeRow> {
    return fastify.withTenant(ctx, async (client) => {
      const existing = await employeeRepository.findById(client, id);
      if (!existing || existing.orgId !== ctx.orgId) throw new NotFoundError("Employee");
      try {
        return (await employeeRepository.update(client, id, input))!;
      } catch (err) {
        throw mapInsertError(err);
      }
    });
  },

  async remove(fastify: FastifyInstance, ctx: RequestContext, id: string): Promise<void> {
    await fastify.withTenant(ctx, async (client) => {
      const existing = await employeeRepository.findById(client, id);
      if (!existing || existing.orgId !== ctx.orgId) throw new NotFoundError("Employee");
      await employeeRepository.remove(client, id);
    });
  },

  async importCsv(
    fastify: FastifyInstance,
    ctx: RequestContext,
    csvText: string,
  ): Promise<ImportSummary> {
    return importEmployeesFromCsv(fastify, ctx, csvText);
  },

  async exportWorkbook(
    fastify: FastifyInstance,
    ctx: RequestContext,
    filter: EmployeeFilter,
  ): Promise<Buffer> {
    const { rows } = await fastify.withTenant(ctx, (client) =>
      employeeRepository.list(client, { ...filter, page: 1, limit: 10_000 }),
    );
    return buildEmployeeWorkbook(rows);
  },
};

/**
 * Tier limit (RULES.md §9 — enforced server-side, never trust the client).
 * Must run on the same tenant-scoped `client` as the insert — a separate
 * pool connection has no `app.org_id` session var set, so RLS would hide
 * every row and the count would silently read as zero.
 */
export async function assertWithinEmployeeLimit(
  client: PoolClient,
  orgId: string,
  aboutToAdd: number,
): Promise<void> {
  const { rows } = await client.query("select tier from public.organizations where id = $1", [
    orgId,
  ]);
  const tier = rows[0]?.tier ?? "free";
  const current = await employeeRepository.count(client, orgId);
  if (!isWithinLimit(tier, "employees", current + aboutToAdd - 1)) {
    throw new ConflictError(
      `Employee limit reached for the ${tier} plan. Upgrade to add more employees.`,
    );
  }
}

function mapInsertError(err: unknown): Error {
  const message = err instanceof Error ? err.message : String(err);
  if (message.includes("duplicate key") && message.includes("employee_code")) {
    return new ConflictError("Employee code already in use in this organization");
  }
  if (message.includes("duplicate key") && message.includes("email")) {
    return new ConflictError("Email already in use in this organization");
  }
  return err instanceof Error ? err : new Error(message);
}
