import type { FastifyRequest, FastifyReply } from "fastify";
import { lookupService } from "../services/lookup.service";
import { sendSuccess } from "../utils/http";
import { toRequestContext } from "../utils/request-context";

export const lookupController = {
  async departments(req: FastifyRequest, reply: FastifyReply): Promise<FastifyReply> {
    const ctx = toRequestContext(req.auth!);
    const data = await lookupService.departments(req.server, ctx);
    return sendSuccess(reply, data);
  },

  async designations(req: FastifyRequest, reply: FastifyReply): Promise<FastifyReply> {
    const ctx = toRequestContext(req.auth!);
    const data = await lookupService.designations(req.server, ctx);
    return sendSuccess(reply, data);
  },
};
