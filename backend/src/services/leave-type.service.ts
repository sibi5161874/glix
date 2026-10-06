import type { FastifyInstance } from "fastify";
import type { CreateLeaveTypeInput, UpdateLeaveTypeInput } from "@app/shared/schemas";
import type { RequestContext } from "../plugins/db.plugin";
import { leaveTypeRepository, type LeaveTypeRow } from "../repositories/leave-type.repository";
import { ConflictError, NotFoundError } from "../utils/errors";

export const leaveTypeService = {
  async list(fastify: FastifyInstance, ctx: RequestContext): Promise<LeaveTypeRow[]> {
    return fastify.withTenant(ctx, (client) => leaveTypeRepository.list(client, ctx.orgId));
  },

  async create(
    fastify: FastifyInstance,
    ctx: RequestContext,
    input: CreateLeaveTypeInput,
  ): Promise<LeaveTypeRow> {
    return fastify.withTenant(ctx, async (client) => {
      try {
        return await leaveTypeRepository.create(client, ctx.orgId, input);
      } catch (err) {
        throw mapDuplicateError(err);
      }
    });
  },

  async update(
    fastify: FastifyInstance,
    ctx: RequestContext,
    id: string,
    input: UpdateLeaveTypeInput,
  ): Promise<LeaveTypeRow> {
    return fastify.withTenant(ctx, async (client) => {
      const existing = await leaveTypeRepository.findById(client, id);
      if (!existing || existing.orgId !== ctx.orgId) throw new NotFoundError("Leave type");
      try {
        return (await leaveTypeRepository.update(client, id, input))!;
      } catch (err) {
        throw mapDuplicateError(err);
      }
    });
  },

  async remove(fastify: FastifyInstance, ctx: RequestContext, id: string): Promise<void> {
    await fastify.withTenant(ctx, async (client) => {
      const existing = await leaveTypeRepository.findById(client, id);
      if (!existing || existing.orgId !== ctx.orgId) throw new NotFoundError("Leave type");
      await leaveTypeRepository.remove(client, id);
    });
  },
};

function mapDuplicateError(err: unknown): Error {
  const message = err instanceof Error ? err.message : String(err);
  if (message.includes("duplicate key")) return new ConflictError("Leave type code already in use");
  return err instanceof Error ? err : new Error(message);
}
