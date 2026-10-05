import type { FastifyRequest, FastifyReply } from "fastify";
import { RegisterOrgInput, LoginInput } from "@app/shared/schemas";
import { authService } from "../services/auth.service";
import { sendSuccess } from "../utils/http";
import { ValidationError } from "../utils/errors";

export const authController = {
  async register(req: FastifyRequest, reply: FastifyReply): Promise<FastifyReply> {
    const parsed = RegisterOrgInput.safeParse(req.body);
    if (!parsed.success) throw new ValidationError("Invalid input", parsed.error.flatten());
    const result = await authService.register(req.server, parsed.data);
    return sendSuccess(reply, result, 201);
  },

  async login(req: FastifyRequest, reply: FastifyReply): Promise<FastifyReply> {
    const parsed = LoginInput.safeParse(req.body);
    if (!parsed.success) throw new ValidationError("Invalid input", parsed.error.flatten());
    const result = await authService.login(req.server, parsed.data);
    return sendSuccess(reply, result);
  },

  async me(req: FastifyRequest, reply: FastifyReply): Promise<FastifyReply> {
    return sendSuccess(reply, req.auth);
  },
};
