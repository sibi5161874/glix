import type { FastifyInstance } from "fastify";
import type {
  CreateDepartmentInput,
  UpdateDepartmentInput,
  DepartmentFilter,
} from "@app/shared/schemas";
import type { RequestContext } from "../plugins/db.plugin";
import { departmentRepository, type DepartmentRow } from "../repositories/department.repository";
import { NotFoundError, ConflictError } from "../utils/errors";

export const departmentService = {
  async list(
    fastify: FastifyInstance,
    ctx: RequestContext,
    filter: DepartmentFilter = {},
  ): Promise<DepartmentRow[]> {
    return fastify.withTenant(ctx, async (client) => {
      return departmentRepository.list(client, ctx.orgId, filter);
    });
  },

  async findById(
    fastify: FastifyInstance,
    ctx: RequestContext,
    id: string,
  ): Promise<DepartmentRow> {
    return fastify.withTenant(ctx, async (client) => {
      const row = await departmentRepository.findById(client, id);
      if (!row) throw new NotFoundError("Department not found");
      return row;
    });
  },

  async create(
    fastify: FastifyInstance,
    ctx: RequestContext,
    input: CreateDepartmentInput,
  ): Promise<DepartmentRow> {
    return fastify.withTenant(ctx, async (client) => {
      try {
        return await departmentRepository.create(client, ctx.orgId, input);
      } catch (err: unknown) {
        if (err && typeof err === "object" && "code" in err && err.code === "23505") {
          throw new ConflictError("A department with this name already exists");
        }
        throw err;
      }
    });
  },

  async update(
    fastify: FastifyInstance,
    ctx: RequestContext,
    id: string,
    input: UpdateDepartmentInput,
  ): Promise<DepartmentRow> {
    return fastify.withTenant(ctx, async (client) => {
      const existing = await departmentRepository.findById(client, id);
      if (!existing) throw new NotFoundError("Department not found");
      if (input.parentId === id) throw new ConflictError("A department cannot be its own parent");

      try {
        const updated = await departmentRepository.update(client, id, input);
        return updated!;
      } catch (err: unknown) {
        if (err && typeof err === "object" && "code" in err && err.code === "23505") {
          throw new ConflictError("A department with this name already exists");
        }
        throw err;
      }
    });
  },

  async remove(fastify: FastifyInstance, ctx: RequestContext, id: string): Promise<void> {
    return fastify.withTenant(ctx, async (client) => {
      const existing = await departmentRepository.findById(client, id);
      if (!existing) throw new NotFoundError("Department not found");
      if (existing.employeeCount && existing.employeeCount > 0) {
        throw new ConflictError("Cannot delete department with active assigned employees");
      }
      await departmentRepository.delete(client, id);
    });
  },
};
