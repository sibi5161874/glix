import type { FastifyRequest, FastifyReply } from "fastify";
import { CreateLeaveTypeInput, UpdateLeaveTypeInput } from "@app/shared/schemas";
import { leaveTypeService } from "../services/leave-type.service";
import { sendSuccess } from "../utils/http";
import { ValidationError } from "../utils/errors";
import { toRequestContext } from "../utils/request-context";

export const leaveTypeController = {
  async list(req: FastifyRequest, reply: FastifyReply): Promise<FastifyReply> {
    const ctx = toRequestContext(req.auth!);
    const data = await leaveTypeService.list(req.server, ctx);
    return sendSuccess(reply, data);
  },

  async create(req: FastifyRequest, reply: FastifyReply): Promise<FastifyReply> {
    const parsed = CreateLeaveTypeInput.safeParse(req.body);
    if (!parsed.success) throw new ValidationError("Invalid input", parsed.error.flatten());
    const ctx = toRequestContext(req.auth!);
    const row = await leaveTypeService.create(req.server, ctx, parsed.data);
    return sendSuccess(reply, row, 201);
  },

  async update(req: FastifyRequest, reply: FastifyReply): Promise<FastifyReply> {
    const { id } = req.params as { id: string };
    const parsed = UpdateLeaveTypeInput.safeParse(req.body);
    if (!parsed.success) throw new ValidationError("Invalid input", parsed.error.flatten());
    const ctx = toRequestContext(req.auth!);
    const row = await leaveTypeService.update(req.server, ctx, id, parsed.data);
    return sendSuccess(reply, row);
  },

  async remove(req: FastifyRequest, reply: FastifyReply): Promise<FastifyReply> {
    const { id } = req.params as { id: string };
    const ctx = toRequestContext(req.auth!);
    await leaveTypeService.remove(req.server, ctx, id);
    return sendSuccess(reply, { success: true });
  },
};
