import type { FastifyRequest, FastifyReply } from "fastify";
import { AdjustLeaveBalanceInput, LeaveBalanceFilter } from "@app/shared/schemas";
import { leaveBalanceService } from "../services/leave-balance.service";
import { sendSuccess } from "../utils/http";
import { ValidationError } from "../utils/errors";
import { toRequestContext } from "../utils/request-context";

export const leaveBalanceController = {
  async list(req: FastifyRequest, reply: FastifyReply): Promise<FastifyReply> {
    const parsed = LeaveBalanceFilter.safeParse(req.query);
    if (!parsed.success) throw new ValidationError("Invalid query", parsed.error.flatten());
    const ctx = toRequestContext(req.auth!);
    const data = await leaveBalanceService.list(req.server, ctx, parsed.data);
    return sendSuccess(reply, data);
  },

  async adjust(req: FastifyRequest, reply: FastifyReply): Promise<FastifyReply> {
    const parsed = AdjustLeaveBalanceInput.safeParse(req.body);
    if (!parsed.success) throw new ValidationError("Invalid input", parsed.error.flatten());
    const ctx = toRequestContext(req.auth!);
    const row = await leaveBalanceService.adjust(req.server, ctx, parsed.data);
    return sendSuccess(reply, row);
  },
};
