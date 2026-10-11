import type { FastifyInstance } from "fastify";
import type { CreateTicketInput, TicketFilter } from "@app/shared/schemas";
import type { RequestContext } from "../plugins/db.plugin";
import { supportRepository, type TicketRow } from "../repositories/support.repository";
import { NotFoundError } from "../utils/errors";

type TicketPage = { items: TicketRow[]; total: number; page: number; limit: number };

export const supportService = {
  async create(
    fastify: FastifyInstance,
    ctx: RequestContext,
    input: CreateTicketInput,
  ): Promise<TicketRow> {
    return fastify.withTenant(ctx, (client) =>
      supportRepository.create(client, ctx.orgId, ctx.userId, input),
    );
  },

  async listMine(
    fastify: FastifyInstance,
    ctx: RequestContext,
    filter: TicketFilter,
  ): Promise<TicketPage> {
    return fastify.withTenant(ctx, (client) =>
      supportRepository.listMine(client, ctx.userId, filter),
    );
  },

  async listForOrg(
    fastify: FastifyInstance,
    ctx: RequestContext,
    filter: TicketFilter,
  ): Promise<TicketPage> {
    return fastify.withTenant(ctx, (client) =>
      supportRepository.listForOrg(client, ctx.orgId, filter),
    );
  },

  async findById(fastify: FastifyInstance, ctx: RequestContext, id: string): Promise<TicketRow> {
    return fastify.withTenant(ctx, async (client) => {
      // RLS (support_tickets_select_submitter_admin_or_superadmin, 016_support.sql)
      // is the actual visibility gate here: a ticket that isn't the caller's own
      // and isn't in an org they admin simply doesn't come back from this query —
      // not a 403, a 404, same as any other row RLS hides.
      const ticket = await supportRepository.findById(client, id);
      if (!ticket) throw new NotFoundError("Ticket not found");
      return ticket;
    });
  },
};
