import type { FastifyRequest, FastifyReply } from "fastify";
import {
  UpdateOrgProfileInput,
  CreateTemplateInput,
  UpdateTemplateInput,
  TemplateFilter,
} from "@app/shared/schemas";
import { settingsService } from "../services/settings.service";
import { sendSuccess } from "../utils/http";
import { ValidationError } from "../utils/errors";
import { toRequestContext } from "../utils/request-context";

export const settingsController = {
  async getProfile(req: FastifyRequest, reply: FastifyReply): Promise<FastifyReply> {
    const ctx = toRequestContext(req.auth!);
    const org = await settingsService.getOrgProfile(req.server, ctx);
    return sendSuccess(reply, org);
  },

  async updateProfile(req: FastifyRequest, reply: FastifyReply): Promise<FastifyReply> {
    const parsed = UpdateOrgProfileInput.safeParse(req.body);
    if (!parsed.success) throw new ValidationError("Invalid profile data", parsed.error.flatten());
    const ctx = toRequestContext(req.auth!);
    const updated = await settingsService.updateOrgProfile(req.server, ctx, parsed.data);
    return sendSuccess(reply, updated);
  },

  async listTemplates(req: FastifyRequest, reply: FastifyReply): Promise<FastifyReply> {
    const parsed = TemplateFilter.safeParse(req.query);
    if (!parsed.success) throw new ValidationError("Invalid filter", parsed.error.flatten());
    const ctx = toRequestContext(req.auth!);
    const rows = await settingsService.listTemplates(req.server, ctx, parsed.data);
    return sendSuccess(reply, rows);
  },

  async findTemplateById(req: FastifyRequest, reply: FastifyReply): Promise<FastifyReply> {
    const { id } = req.params as { id: string };
    const ctx = toRequestContext(req.auth!);
    const row = await settingsService.findTemplateById(req.server, ctx, id);
    return sendSuccess(reply, row);
  },

  async saveTemplateOverride(req: FastifyRequest, reply: FastifyReply): Promise<FastifyReply> {
    const parsed = CreateTemplateInput.safeParse(req.body);
    if (!parsed.success)
      throw new ValidationError("Invalid template input", parsed.error.flatten());
    const ctx = toRequestContext(req.auth!);
    const row = await settingsService.saveTemplateOverride(req.server, ctx, parsed.data);
    return sendSuccess(reply, row, 201);
  },

  async updateTemplate(req: FastifyRequest, reply: FastifyReply): Promise<FastifyReply> {
    const { id } = req.params as { id: string };
    const parsed = UpdateTemplateInput.safeParse(req.body);
    if (!parsed.success)
      throw new ValidationError("Invalid template input", parsed.error.flatten());
    const ctx = toRequestContext(req.auth!);
    const row = await settingsService.updateTemplate(req.server, ctx, id, parsed.data);
    return sendSuccess(reply, row);
  },

  async deleteTemplateOverride(req: FastifyRequest, reply: FastifyReply): Promise<FastifyReply> {
    const { id } = req.params as { id: string };
    const ctx = toRequestContext(req.auth!);
    await settingsService.deleteTemplateOverride(req.server, ctx, id);
    return sendSuccess(reply, { success: true });
  },

  async getRolePermissionsMatrix(_req: FastifyRequest, reply: FastifyReply): Promise<FastifyReply> {
    const matrix = settingsService.getRolePermissionsMatrix();
    return sendSuccess(reply, matrix);
  },
};
