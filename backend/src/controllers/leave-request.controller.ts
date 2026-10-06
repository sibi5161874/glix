import type { FastifyRequest, FastifyReply } from "fastify";
import { CreateLeaveRequestInput, LeaveRequestFilter, RejectLeaveInput } from "@app/shared/schemas";
import { leaveRequestService } from "../services/leave-request.service";
import { sendSuccess } from "../utils/http";
import { ValidationError } from "../utils/errors";
import { toRequestContext } from "../utils/request-context";

export const leaveRequestController = {
  async list(req: FastifyRequest, reply: FastifyReply): Promise<FastifyReply> {
    const parsed = LeaveRequestFilter.safeParse(req.query);
    if (!parsed.success) throw new ValidationError("Invalid query", parsed.error.flatten());
    const ctx = toRequestContext(req.auth!);
    const data = await leaveRequestService.list(req.server, ctx, parsed.data);
    return sendSuccess(reply, data);
  },

  async create(req: FastifyRequest, reply: FastifyReply): Promise<FastifyReply> {
    const parsed = CreateLeaveRequestInput.safeParse(req.body);
    if (!parsed.success) throw new ValidationError("Invalid input", parsed.error.flatten());
    const ctx = toRequestContext(req.auth!);
    const row = await leaveRequestService.create(req.server, ctx, parsed.data);
    return sendSuccess(reply, row, 201);
  },

  async approve(req: FastifyRequest, reply: FastifyReply): Promise<FastifyReply> {
    const { id } = req.params as { id: string };
    const ctx = toRequestContext(req.auth!);
    const row = await leaveRequestService.approve(req.server, ctx, id);
    return sendSuccess(reply, row);
  },

  async reject(req: FastifyRequest, reply: FastifyReply): Promise<FastifyReply> {
    const { id } = req.params as { id: string };
    const body = (req.body as Record<string, unknown> | undefined) ?? {};
    const parsed = RejectLeaveInput.safeParse({ requestId: id, ...body });
    if (!parsed.success) throw new ValidationError("Invalid input", parsed.error.flatten());
    const ctx = toRequestContext(req.auth!);
    const row = await leaveRequestService.reject(req.server, ctx, id, parsed.data.rejectionReason);
    return sendSuccess(reply, row);
  },

  async cancel(req: FastifyRequest, reply: FastifyReply): Promise<FastifyReply> {
    const { id } = req.params as { id: string };
    const ctx = toRequestContext(req.auth!);
    await leaveRequestService.cancel(req.server, ctx, id);
    return sendSuccess(reply, { success: true });
  },
};
