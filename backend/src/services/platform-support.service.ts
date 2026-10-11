import type { FastifyInstance } from "fastify";
import type { TicketFilter, UpdateTicketInput } from "@app/shared/schemas";
import type { PlatformContext } from "../plugins/db.plugin";
import { supportRepository, type TicketRow } from "../repositories/support.repository";
import { NotFoundError } from "../utils/errors";

type TicketPage = { items: TicketRow[]; total: number; page: number; limit: number };

export const platformSupportService = {
  async listAll(
    fastify: FastifyInstance,
    ctx: PlatformContext,
    filter: TicketFilter,
  ): Promise<TicketPage> {
    return fastify.withPlatform(ctx, (client) => supportRepository.listAllPlatform(client, filter));
  },

  async findById(fastify: FastifyInstance, ctx: PlatformContext, id: string): Promise<TicketRow> {
    return fastify.withPlatform(ctx, async (client) => {
      const ticket = await supportRepository.findById(client, id);
      if (!ticket) throw new NotFoundError("Ticket not found");
      return ticket;
    });
  },

  async update(
    fastify: FastifyInstance,
    ctx: PlatformContext,
    id: string,
    input: UpdateTicketInput,
  ): Promise<TicketRow> {
    return fastify.withPlatform(ctx, async (client) => {
      const existing = await supportRepository.findById(client, id);
      if (!existing) throw new NotFoundError("Ticket not found");
      return (await supportRepository.update(client, id, input))!;
    });
  },
};
