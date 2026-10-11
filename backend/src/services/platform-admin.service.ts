import type { FastifyInstance } from "fastify";
import type { PlatformContext } from "../plugins/db.plugin";
import {
  platformOrgRepository,
  type PlatformOrgRow,
  type PlatformOverviewStats,
} from "../repositories/platform-org.repository";
import {
  platformSettingsRepository,
  type PlatformSettingRow,
  type PlatformTeamRow,
} from "../repositories/platform-settings.repository";
import { billingRepository, type PlanRow } from "../repositories/billing.repository";
import { leadsRepository } from "../repositories/leads.repository";
import type {
  PlatformOrgFilter,
  CreatePlatformOrgInput,
  UpdatePlanInput,
  PlatformTeamInput,
  UpdateLeadStatusInput,
} from "@app/shared/schemas";

export const platformAdminService = {
  async getOverview(
    fastify: FastifyInstance,
    ctx: PlatformContext,
  ): Promise<PlatformOverviewStats> {
    return fastify.withPlatform(ctx, (client) => platformOrgRepository.getOverview(client));
  },

  async listOrganizations(
    fastify: FastifyInstance,
    ctx: PlatformContext,
    filter: PlatformOrgFilter,
  ): Promise<{ items: PlatformOrgRow[]; total: number; page: number; limit: number }> {
    return fastify.withPlatform(ctx, (client) =>
      platformOrgRepository.listOrganizations(client, filter),
    );
  },

  async createOrganization(
    fastify: FastifyInstance,
    ctx: PlatformContext,
    input: CreatePlatformOrgInput,
  ): Promise<{ id: string }> {
    return fastify.withPlatform(ctx, async (client) => {
      const id = await platformOrgRepository.createOrganization(client, ctx.userId, input);
      return { id };
    });
  },

  async listPlans(fastify: FastifyInstance, ctx: PlatformContext): Promise<PlanRow[]> {
    return fastify.withPlatform(ctx, (client) => billingRepository.listActivePlans(client));
  },

  async updatePlan(
    fastify: FastifyInstance,
    ctx: PlatformContext,
    id: string,
    input: UpdatePlanInput,
  ): Promise<void> {
    return fastify.withPlatform(ctx, (client) =>
      platformOrgRepository.updatePlan(client, id, input),
    );
  },

  async listSettings(
    fastify: FastifyInstance,
    ctx: PlatformContext,
  ): Promise<PlatformSettingRow[]> {
    return fastify.withPlatform(ctx, (client) => platformSettingsRepository.listSettings(client));
  },

  async getSetting(
    fastify: FastifyInstance,
    ctx: PlatformContext,
    key: string,
  ): Promise<Record<string, unknown> | null> {
    return fastify.withPlatform(ctx, (client) =>
      platformSettingsRepository.getSetting(client, key),
    );
  },

  async upsertSetting(
    fastify: FastifyInstance,
    ctx: PlatformContext,
    key: string,
    value: Record<string, unknown>,
  ): Promise<void> {
    return fastify.withPlatform(ctx, (client) =>
      platformSettingsRepository.upsertSetting(client, key, value, ctx.userId),
    );
  },

  async listTeam(fastify: FastifyInstance, ctx: PlatformContext): Promise<PlatformTeamRow[]> {
    return fastify.withPlatform(ctx, (client) => platformSettingsRepository.listTeam(client));
  },

  async addTeamMember(
    fastify: FastifyInstance,
    ctx: PlatformContext,
    userId: string,
    input: PlatformTeamInput,
  ): Promise<PlatformTeamRow> {
    return fastify.withPlatform(ctx, (client) =>
      platformSettingsRepository.addTeamMember(client, userId, input),
    );
  },

  async listLeads(
    fastify: FastifyInstance,
    ctx: PlatformContext,
    filter: { search?: string; status?: string; limit?: number; offset?: number },
  ) {
    return fastify.withPlatform(ctx, (client) => leadsRepository.listLeads(client, filter));
  },

  async updateLead(
    fastify: FastifyInstance,
    ctx: PlatformContext,
    id: string,
    input: UpdateLeadStatusInput,
  ) {
    return fastify.withPlatform(ctx, (client) => leadsRepository.updateLead(client, id, input));
  },
};
