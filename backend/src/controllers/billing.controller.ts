import type { FastifyRequest, FastifyReply } from "fastify";
import { ChangeTierInput, InvoiceFilter } from "@app/shared/schemas";
import { billingService } from "../services/billing.service";
import { sendSuccess } from "../utils/http";
import { ValidationError } from "../utils/errors";
import { toRequestContext } from "../utils/request-context";

export const billingController = {
  async plans(req: FastifyRequest, reply: FastifyReply): Promise<FastifyReply> {
    const ctx = toRequestContext(req.auth!);
    const data = await billingService.listPlans(req.server, ctx);
    return sendSuccess(reply, data);
  },

  async subscription(req: FastifyRequest, reply: FastifyReply): Promise<FastifyReply> {
    const ctx = toRequestContext(req.auth!);
    const data = await billingService.getSubscription(req.server, ctx);
    return sendSuccess(reply, data);
  },

  async invoices(req: FastifyRequest, reply: FastifyReply): Promise<FastifyReply> {
    const parsed = InvoiceFilter.safeParse(req.query);
    if (!parsed.success) throw new ValidationError("Invalid filter", parsed.error.flatten());
    const ctx = toRequestContext(req.auth!);
    const data = await billingService.listInvoices(req.server, ctx, parsed.data);
    return sendSuccess(reply, data);
  },

  async changeTier(req: FastifyRequest, reply: FastifyReply): Promise<FastifyReply> {
    const parsed = ChangeTierInput.safeParse(req.body);
    if (!parsed.success) throw new ValidationError("Invalid input", parsed.error.flatten());
    const ctx = toRequestContext(req.auth!);
    const data = await billingService.changeTier(req.server, ctx, parsed.data.planId);
    return sendSuccess(reply, data);
  },
};
