import type { FastifyRequest, FastifyReply } from "fastify";
import { TicketFilter, UpdateTicketInput } from "@app/shared/schemas";
import { platformSupportService } from "../services/platform-support.service";
import { sendSuccess } from "../utils/http";
import { ValidationError } from "../utils/errors";

export const platformSupportController = {
  async list(req: FastifyRequest, reply: FastifyReply): Promise<FastifyReply> {
    const parsed = TicketFilter.safeParse(req.query);
    if (!parsed.success) throw new ValidationError("Invalid filter", parsed.error.flatten());
    const data = await platformSupportService.listAll(
      req.server,
      { userId: req.auth!.sub },
      parsed.data,
    );
    return sendSuccess(reply, data);
  },

  async findById(req: FastifyRequest, reply: FastifyReply): Promise<FastifyReply> {
    const { id } = req.params as { id: string };
    const data = await platformSupportService.findById(req.server, { userId: req.auth!.sub }, id);
    return sendSuccess(reply, data);
  },

  async update(req: FastifyRequest, reply: FastifyReply): Promise<FastifyReply> {
    const { id } = req.params as { id: string };
    const parsed = UpdateTicketInput.safeParse(req.body);
    if (!parsed.success) throw new ValidationError("Invalid input", parsed.error.flatten());
    const data = await platformSupportService.update(
      req.server,
      { userId: req.auth!.sub },
      id,
      parsed.data,
    );
    return sendSuccess(reply, data);
  },
};
