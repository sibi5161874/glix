import type { FastifyRequest, FastifyReply } from "fastify";
import { CreateTicketInput, TicketFilter } from "@app/shared/schemas";
import { supportService } from "../services/support.service";
import { sendSuccess } from "../utils/http";
import { ValidationError } from "../utils/errors";
import { toRequestContext } from "../utils/request-context";

export const supportController = {
  async create(req: FastifyRequest, reply: FastifyReply): Promise<FastifyReply> {
    const parsed = CreateTicketInput.safeParse(req.body);
    if (!parsed.success) throw new ValidationError("Invalid input", parsed.error.flatten());
    const ctx = toRequestContext(req.auth!);
    const data = await supportService.create(req.server, ctx, parsed.data);
    return sendSuccess(reply, data, 201);
  },

  async listMine(req: FastifyRequest, reply: FastifyReply): Promise<FastifyReply> {
    const parsed = TicketFilter.safeParse(req.query);
    if (!parsed.success) throw new ValidationError("Invalid filter", parsed.error.flatten());
    const ctx = toRequestContext(req.auth!);
    const data = await supportService.listMine(req.server, ctx, parsed.data);
    return sendSuccess(reply, data);
  },

  async listForOrg(req: FastifyRequest, reply: FastifyReply): Promise<FastifyReply> {
    const parsed = TicketFilter.safeParse(req.query);
    if (!parsed.success) throw new ValidationError("Invalid filter", parsed.error.flatten());
    const ctx = toRequestContext(req.auth!);
    const data = await supportService.listForOrg(req.server, ctx, parsed.data);
    return sendSuccess(reply, data);
  },

  async findById(req: FastifyRequest, reply: FastifyReply): Promise<FastifyReply> {
    const { id } = req.params as { id: string };
    const ctx = toRequestContext(req.auth!);
    const data = await supportService.findById(req.server, ctx, id);
    return sendSuccess(reply, data);
  },
};
