import type { FastifyRequest, FastifyReply } from "fastify";
import {
  CreateDesignationInput,
  UpdateDesignationInput,
  DesignationFilter,
} from "@app/shared/schemas";
import { designationService } from "../services/designation.service";
import { sendSuccess } from "../utils/http";
import { ValidationError } from "../utils/errors";
import { toRequestContext } from "../utils/request-context";

export const designationController = {
  async list(req: FastifyRequest, reply: FastifyReply): Promise<FastifyReply> {
    const parsed = DesignationFilter.safeParse(req.query);
    if (!parsed.success) throw new ValidationError("Invalid filter", parsed.error.flatten());
    const ctx = toRequestContext(req.auth!);
    const rows = await designationService.list(req.server, ctx, parsed.data);
    return sendSuccess(reply, rows);
  },

  async findById(req: FastifyRequest, reply: FastifyReply): Promise<FastifyReply> {
    const { id } = req.params as { id: string };
    const ctx = toRequestContext(req.auth!);
    const row = await designationService.findById(req.server, ctx, id);
    return sendSuccess(reply, row);
  },

  async create(req: FastifyRequest, reply: FastifyReply): Promise<FastifyReply> {
    const parsed = CreateDesignationInput.safeParse(req.body);
    if (!parsed.success) throw new ValidationError("Invalid input", parsed.error.flatten());
    const ctx = toRequestContext(req.auth!);
    const row = await designationService.create(req.server, ctx, parsed.data);
    return sendSuccess(reply, row, 201);
  },

  async update(req: FastifyRequest, reply: FastifyReply): Promise<FastifyReply> {
    const { id } = req.params as { id: string };
    const parsed = UpdateDesignationInput.safeParse(req.body);
    if (!parsed.success) throw new ValidationError("Invalid input", parsed.error.flatten());
    const ctx = toRequestContext(req.auth!);
    const row = await designationService.update(req.server, ctx, id, parsed.data);
    return sendSuccess(reply, row);
  },

  async remove(req: FastifyRequest, reply: FastifyReply): Promise<FastifyReply> {
    const { id } = req.params as { id: string };
    const ctx = toRequestContext(req.auth!);
    await designationService.remove(req.server, ctx, id);
    return sendSuccess(reply, { success: true });
  },
};
