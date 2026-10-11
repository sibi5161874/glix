import type { FastifyRequest, FastifyReply } from "fastify";
import {
  PlatformOrgFilter,
  CreatePlatformOrgInput,
  UpdatePlanInput,
  PlatformTeamInput,
  UpdatePlatformSettingInput,
} from "@app/shared/schemas";
import { platformAdminService } from "../services/platform-admin.service";
import { sendSuccess } from "../utils/http";
import { ValidationError, UnauthorizedError } from "../utils/errors";

function toPlatformContext(auth: FastifyRequest["auth"]) {
  if (!auth?.sub) throw new UnauthorizedError();
  return { userId: auth.sub };
}

export const platformAdminController = {
  async overview(req: FastifyRequest, reply: FastifyReply): Promise<FastifyReply> {
    const ctx = toPlatformContext(req.auth);
    const data = await platformAdminService.getOverview(req.server, ctx);
    return sendSuccess(reply, data);
  },

  async listOrganizations(req: FastifyRequest, reply: FastifyReply): Promise<FastifyReply> {
    const parsed = PlatformOrgFilter.safeParse(req.query);
    if (!parsed.success) throw new ValidationError("Invalid filter", parsed.error.flatten());
    const ctx = toPlatformContext(req.auth);
    const data = await platformAdminService.listOrganizations(req.server, ctx, parsed.data);
    return sendSuccess(reply, data);
  },

  async createOrganization(req: FastifyRequest, reply: FastifyReply): Promise<FastifyReply> {
    const parsed = CreatePlatformOrgInput.safeParse(req.body);
    if (!parsed.success) throw new ValidationError("Invalid input", parsed.error.flatten());
    const ctx = toPlatformContext(req.auth);
    const data = await platformAdminService.createOrganization(req.server, ctx, parsed.data);
    return sendSuccess(reply, data, 201);
  },

  async listPlans(req: FastifyRequest, reply: FastifyReply): Promise<FastifyReply> {
    const ctx = toPlatformContext(req.auth);
    const data = await platformAdminService.listPlans(req.server, ctx);
    return sendSuccess(reply, data);
  },

  async updatePlan(
    req: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply,
  ): Promise<FastifyReply> {
    const parsed = UpdatePlanInput.safeParse(req.body);
    if (!parsed.success) throw new ValidationError("Invalid input", parsed.error.flatten());
    const ctx = toPlatformContext(req.auth);
    await platformAdminService.updatePlan(req.server, ctx, req.params.id, parsed.data);
    return sendSuccess(reply, { success: true });
  },

  async listSettings(req: FastifyRequest, reply: FastifyReply): Promise<FastifyReply> {
    const ctx = toPlatformContext(req.auth);
    const data = await platformAdminService.listSettings(req.server, ctx);
    return sendSuccess(reply, data);
  },

  async getSetting(
    req: FastifyRequest<{ Params: { key: string } }>,
    reply: FastifyReply,
  ): Promise<FastifyReply> {
    const ctx = toPlatformContext(req.auth);
    const data = await platformAdminService.getSetting(req.server, ctx, req.params.key);
    return sendSuccess(reply, data);
  },

  async upsertSetting(
    req: FastifyRequest<{ Params: { key: string } }>,
    reply: FastifyReply,
  ): Promise<FastifyReply> {
    const parsed = UpdatePlatformSettingInput.safeParse(req.body);
    if (!parsed.success) throw new ValidationError("Invalid input", parsed.error.flatten());
    const ctx = toPlatformContext(req.auth);
    await platformAdminService.upsertSetting(req.server, ctx, req.params.key, parsed.data.value);
    return sendSuccess(reply, { success: true });
  },

  async listTeam(req: FastifyRequest, reply: FastifyReply): Promise<FastifyReply> {
    const ctx = toPlatformContext(req.auth);
    const data = await platformAdminService.listTeam(req.server, ctx);
    return sendSuccess(reply, data);
  },

  async addTeamMember(req: FastifyRequest, reply: FastifyReply): Promise<FastifyReply> {
    const parsed = PlatformTeamInput.safeParse(req.body);
    if (!parsed.success) throw new ValidationError("Invalid input", parsed.error.flatten());
    const ctx = toPlatformContext(req.auth);
    const data = await platformAdminService.addTeamMember(req.server, ctx, ctx.userId, parsed.data);
    return sendSuccess(reply, data, 201);
  },

  async listLeads(req: FastifyRequest, reply: FastifyReply): Promise<FastifyReply> {
    const ctx = toPlatformContext(req.auth);
    const query = req.query as {
      search?: string;
      status?: string;
      limit?: string;
      offset?: string;
    };
    const filter: { search?: string; status?: string; limit?: number; offset?: number } = {
      limit: query.limit ? parseInt(query.limit, 10) : 50,
      offset: query.offset ? parseInt(query.offset, 10) : 0,
    };
    if (query.search) filter.search = query.search;
    if (query.status) filter.status = query.status;
    const data = await platformAdminService.listLeads(req.server, ctx, filter);
    return sendSuccess(reply, data);
  },

  async updateLead(
    req: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply,
  ): Promise<FastifyReply> {
    const ctx = toPlatformContext(req.auth);
    const body = req.body as {
      status?: "new" | "contacted" | "qualified" | "closed";
      notes?: string | null;
    };
    const data = await platformAdminService.updateLead(req.server, ctx, req.params.id, body);
    return sendSuccess(reply, data);
  },
};
