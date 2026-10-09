import type { FastifyInstance } from "fastify";
import type {
  CreateDesignationInput,
  UpdateDesignationInput,
  DesignationFilter,
} from "@app/shared/schemas";
import type { RequestContext } from "../plugins/db.plugin";
import { designationRepository, type DesignationRow } from "../repositories/designation.repository";
import { NotFoundError, ConflictError } from "../utils/errors";

export const designationService = {
  async list(
    fastify: FastifyInstance,
    ctx: RequestContext,
    filter: DesignationFilter = {},
  ): Promise<DesignationRow[]> {
    return fastify.withTenant(ctx, async (client) => {
      return designationRepository.list(client, ctx.orgId, filter);
    });
  },

  async findById(
    fastify: FastifyInstance,
    ctx: RequestContext,
    id: string,
  ): Promise<DesignationRow> {
    return fastify.withTenant(ctx, async (client) => {
      const row = await designationRepository.findById(client, id);
      if (!row) throw new NotFoundError("Designation not found");
      return row;
    });
  },

  async create(
    fastify: FastifyInstance,
    ctx: RequestContext,
    input: CreateDesignationInput,
  ): Promise<DesignationRow> {
    return fastify.withTenant(ctx, async (client) => {
      return designationRepository.create(client, ctx.orgId, input);
    });
  },

  async update(
    fastify: FastifyInstance,
    ctx: RequestContext,
    id: string,
    input: UpdateDesignationInput,
  ): Promise<DesignationRow> {
    return fastify.withTenant(ctx, async (client) => {
      const existing = await designationRepository.findById(client, id);
      if (!existing) throw new NotFoundError("Designation not found");
      const updated = await designationRepository.update(client, id, input);
      return updated!;
    });
  },

  async remove(fastify: FastifyInstance, ctx: RequestContext, id: string): Promise<void> {
    return fastify.withTenant(ctx, async (client) => {
      const existing = await designationRepository.findById(client, id);
      if (!existing) throw new NotFoundError("Designation not found");
      if (existing.employeeCount && existing.employeeCount > 0) {
        throw new ConflictError("Cannot delete designation with active assigned employees");
      }
      await designationRepository.delete(client, id);
    });
  },
};
