import type { FastifyRequest, FastifyReply } from "fastify";
import { CreateLoanInput, LoanFilter, RecordLoanPaymentInput } from "@app/shared/schemas";
import { loanService } from "../services/loan.service";
import { sendSuccess } from "../utils/http";
import { ValidationError } from "../utils/errors";
import { toRequestContext } from "../utils/request-context";

export const loanController = {
  async list(req: FastifyRequest, reply: FastifyReply): Promise<FastifyReply> {
    const parsed = LoanFilter.safeParse(req.query);
    if (!parsed.success) throw new ValidationError("Invalid filter", parsed.error.flatten());
    const ctx = toRequestContext(req.auth!);
    const data = await loanService.list(req.server, ctx, parsed.data);
    return sendSuccess(reply, data);
  },

  async summary(req: FastifyRequest, reply: FastifyReply): Promise<FastifyReply> {
    const ctx = toRequestContext(req.auth!);
    const data = await loanService.getSummary(req.server, ctx);
    return sendSuccess(reply, data);
  },

  async findById(req: FastifyRequest, reply: FastifyReply): Promise<FastifyReply> {
    const { id } = req.params as { id: string };
    const ctx = toRequestContext(req.auth!);
    const data = await loanService.findById(req.server, ctx, id);
    return sendSuccess(reply, data);
  },

  async create(req: FastifyRequest, reply: FastifyReply): Promise<FastifyReply> {
    const parsed = CreateLoanInput.safeParse(req.body);
    if (!parsed.success) throw new ValidationError("Invalid input", parsed.error.flatten());
    const ctx = toRequestContext(req.auth!);
    const row = await loanService.create(req.server, ctx, parsed.data);
    return sendSuccess(reply, row, 201);
  },

  async approve(req: FastifyRequest, reply: FastifyReply): Promise<FastifyReply> {
    const { id } = req.params as { id: string };
    const ctx = toRequestContext(req.auth!);
    const row = await loanService.approve(req.server, ctx, id);
    return sendSuccess(reply, row);
  },

  async reject(req: FastifyRequest, reply: FastifyReply): Promise<FastifyReply> {
    const { id } = req.params as { id: string };
    const ctx = toRequestContext(req.auth!);
    const row = await loanService.reject(req.server, ctx, id);
    return sendSuccess(reply, row);
  },

  async recordPayment(req: FastifyRequest, reply: FastifyReply): Promise<FastifyReply> {
    const { id } = req.params as { id: string };
    const parsed = RecordLoanPaymentInput.safeParse(req.body);
    if (!parsed.success) throw new ValidationError("Invalid payment input", parsed.error.flatten());
    const ctx = toRequestContext(req.auth!);
    const row = await loanService.recordPayment(req.server, ctx, id, parsed.data.amount);
    return sendSuccess(reply, row);
  },
};
