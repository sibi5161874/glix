import type { FastifyInstance } from "fastify";
import type {
  UpdateOrgProfileInput,
  CreateTemplateInput,
  UpdateTemplateInput,
  TemplateFilter,
} from "@app/shared/schemas";
import { permissions, roles, type Role, type Permission } from "@app/shared/config";
import type { RequestContext } from "../plugins/db.plugin";
import {
  settingsRepository,
  type OrgProfileRow,
  type NotificationTemplateRow,
} from "../repositories/settings.repository";
import { NotFoundError, ConflictError } from "../utils/errors";

export interface RoleMatrixEntry {
  role: Role;
  permissions: Permission[];
}

export const settingsService = {
  async getOrgProfile(fastify: FastifyInstance, ctx: RequestContext): Promise<OrgProfileRow> {
    return fastify.withTenant(ctx, async (client) => {
      const org = await settingsRepository.getOrgProfile(client, ctx.orgId);
      if (!org) throw new NotFoundError("Organization not found");
      return org;
    });
  },

  async updateOrgProfile(
    fastify: FastifyInstance,
    ctx: RequestContext,
    input: UpdateOrgProfileInput,
  ): Promise<OrgProfileRow> {
    return fastify.withTenant(ctx, async (client) => {
      const updated = await settingsRepository.updateOrgProfile(client, ctx.orgId, input);
      if (!updated) throw new NotFoundError("Organization not found");
      return updated;
    });
  },

  async listTemplates(
    fastify: FastifyInstance,
    ctx: RequestContext,
    filter: TemplateFilter = {},
  ): Promise<NotificationTemplateRow[]> {
    return fastify.withTenant(ctx, async (client) => {
      return settingsRepository.listTemplates(client, ctx.orgId, filter);
    });
  },

  async findTemplateById(
    fastify: FastifyInstance,
    ctx: RequestContext,
    id: string,
  ): Promise<NotificationTemplateRow> {
    return fastify.withTenant(ctx, async (client) => {
      const template = await settingsRepository.findTemplateById(client, id);
      if (!template) throw new NotFoundError("Template not found");
      return template;
    });
  },

  async saveTemplateOverride(
    fastify: FastifyInstance,
    ctx: RequestContext,
    input: CreateTemplateInput,
  ): Promise<NotificationTemplateRow> {
    return fastify.withTenant(ctx, async (client) => {
      return settingsRepository.saveTemplateOverride(client, ctx.orgId, input);
    });
  },

  async updateTemplate(
    fastify: FastifyInstance,
    ctx: RequestContext,
    id: string,
    input: UpdateTemplateInput,
  ): Promise<NotificationTemplateRow> {
    return fastify.withTenant(ctx, async (client) => {
      const existing = await settingsRepository.findTemplateById(client, id);
      if (!existing) throw new NotFoundError("Template not found");
      if (existing.orgId === null) {
        throw new ConflictError(
          "Cannot directly update platform default. Create an override instead.",
        );
      }
      const updated = await settingsRepository.updateTemplate(client, id, input);
      return updated!;
    });
  },

  async deleteTemplateOverride(
    fastify: FastifyInstance,
    ctx: RequestContext,
    id: string,
  ): Promise<void> {
    return fastify.withTenant(ctx, async (client) => {
      const existing = await settingsRepository.findTemplateById(client, id);
      if (!existing) throw new NotFoundError("Template not found");
      if (existing.orgId === null) {
        throw new ConflictError("Cannot delete platform default template");
      }
      await settingsRepository.deleteTemplateOverride(client, id);
    });
  },

  getRolePermissionsMatrix(): RoleMatrixEntry[] {
    const matrix: RoleMatrixEntry[] = [];
    for (const role of roles) {
      const rolePerms: Permission[] = [];
      for (const [permKey, allowedRoles] of Object.entries(permissions)) {
        if ((allowedRoles as readonly Role[]).includes(role)) {
          rolePerms.push(permKey as Permission);
        }
      }
      matrix.push({ role, permissions: rolePerms });
    }
    return matrix;
  },
};
