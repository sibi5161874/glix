import type { FastifyInstance } from "fastify";
import type { CreateHolidayInput, UpdateHolidayInput, HolidayFilter } from "@app/shared/schemas";
import type { RequestContext } from "../plugins/db.plugin";
import { holidayRepository, type HolidayRow } from "../repositories/holiday.repository";
import { ConflictError, NotFoundError } from "../utils/errors";

export const holidayService = {
  async list(
    fastify: FastifyInstance,
    ctx: RequestContext,
    filter: HolidayFilter,
  ): Promise<HolidayRow[]> {
    return fastify.withTenant(ctx, (client) => holidayRepository.list(client, ctx.orgId, filter));
  },

  async create(
    fastify: FastifyInstance,
    ctx: RequestContext,
    input: CreateHolidayInput,
  ): Promise<HolidayRow> {
    return fastify.withTenant(ctx, async (client) => {
      try {
        return await holidayRepository.create(client, ctx.orgId, input);
      } catch (err) {
        throw mapDuplicateError(err);
      }
    });
  },

  async update(
    fastify: FastifyInstance,
    ctx: RequestContext,
    id: string,
    input: UpdateHolidayInput,
  ): Promise<HolidayRow> {
    return fastify.withTenant(ctx, async (client) => {
      const existing = await holidayRepository.findById(client, id);
      if (!existing || existing.orgId !== ctx.orgId) throw new NotFoundError("Holiday");
      try {
        return (await holidayRepository.update(client, id, input))!;
      } catch (err) {
        throw mapDuplicateError(err);
      }
    });
  },

  async remove(fastify: FastifyInstance, ctx: RequestContext, id: string): Promise<void> {
    await fastify.withTenant(ctx, async (client) => {
      const existing = await holidayRepository.findById(client, id);
      if (!existing || existing.orgId !== ctx.orgId) throw new NotFoundError("Holiday");
      await holidayRepository.remove(client, id);
    });
  },
};

function mapDuplicateError(err: unknown): Error {
  const message = err instanceof Error ? err.message : String(err);
  if (message.includes("duplicate key"))
    return new ConflictError("Holiday already exists on this date");
  return err instanceof Error ? err : new Error(message);
}
