import type { FastifyRequest, FastifyReply } from "fastify";
import { CreateHolidayInput, UpdateHolidayInput, HolidayFilter } from "@app/shared/schemas";
import { holidayService } from "../services/holiday.service";
import { sendSuccess } from "../utils/http";
import { ValidationError } from "../utils/errors";
import { toRequestContext } from "../utils/request-context";

export const holidayController = {
  async list(req: FastifyRequest, reply: FastifyReply): Promise<FastifyReply> {
    const parsed = HolidayFilter.safeParse(req.query);
    if (!parsed.success) throw new ValidationError("Invalid query", parsed.error.flatten());
    const ctx = toRequestContext(req.auth!);
    const data = await holidayService.list(req.server, ctx, parsed.data);
    return sendSuccess(reply, data);
  },

  async create(req: FastifyRequest, reply: FastifyReply): Promise<FastifyReply> {
    const parsed = CreateHolidayInput.safeParse(req.body);
    if (!parsed.success) throw new ValidationError("Invalid input", parsed.error.flatten());
    const ctx = toRequestContext(req.auth!);
    const row = await holidayService.create(req.server, ctx, parsed.data);
    return sendSuccess(reply, row, 201);
  },

  async update(req: FastifyRequest, reply: FastifyReply): Promise<FastifyReply> {
    const { id } = req.params as { id: string };
    const parsed = UpdateHolidayInput.safeParse(req.body);
    if (!parsed.success) throw new ValidationError("Invalid input", parsed.error.flatten());
    const ctx = toRequestContext(req.auth!);
    const row = await holidayService.update(req.server, ctx, id, parsed.data);
    return sendSuccess(reply, row);
  },

  async remove(req: FastifyRequest, reply: FastifyReply): Promise<FastifyReply> {
    const { id } = req.params as { id: string };
    const ctx = toRequestContext(req.auth!);
    await holidayService.remove(req.server, ctx, id);
    return sendSuccess(reply, { success: true });
  },
};
