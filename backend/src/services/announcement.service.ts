import type { FastifyInstance } from "fastify";
import type {
  CreateAnnouncementInput,
  UpdateAnnouncementInput,
  AnnouncementFilter,
} from "@app/shared/schemas";
import type { RequestContext } from "../plugins/db.plugin";
import {
  announcementRepository,
  type AnnouncementRow,
} from "../repositories/announcement.repository";
import { NotFoundError } from "../utils/errors";

export const announcementService = {
  async list(
    fastify: FastifyInstance,
    ctx: RequestContext,
    filter: AnnouncementFilter,
  ): Promise<{ items: AnnouncementRow[]; total: number; page: number; limit: number }> {
    const isViewer = ctx.role === "org_viewer";
    return fastify.withTenant(ctx, (client) =>
      announcementRepository.list(client, ctx.orgId, filter, isViewer),
    );
  },

  async findById(
    fastify: FastifyInstance,
    ctx: RequestContext,
    id: string,
  ): Promise<AnnouncementRow> {
    return fastify.withTenant(ctx, async (client) => {
      const item = await announcementRepository.findById(client, id);
      if (!item || item.orgId !== ctx.orgId) throw new NotFoundError("Announcement");
      return item;
    });
  },

  async create(
    fastify: FastifyInstance,
    ctx: RequestContext,
    input: CreateAnnouncementInput,
  ): Promise<AnnouncementRow> {
    return fastify.withTenant(ctx, (client) =>
      announcementRepository.create(client, ctx.orgId, ctx.userId, input),
    );
  },

  async update(
    fastify: FastifyInstance,
    ctx: RequestContext,
    id: string,
    input: UpdateAnnouncementInput,
  ): Promise<AnnouncementRow> {
    return fastify.withTenant(ctx, async (client) => {
      const existing = await announcementRepository.findById(client, id);
      if (!existing || existing.orgId !== ctx.orgId) throw new NotFoundError("Announcement");
      return (await announcementRepository.update(client, id, input))!;
    });
  },

  async remove(fastify: FastifyInstance, ctx: RequestContext, id: string): Promise<void> {
    await fastify.withTenant(ctx, async (client) => {
      const existing = await announcementRepository.findById(client, id);
      if (!existing || existing.orgId !== ctx.orgId) throw new NotFoundError("Announcement");
      await announcementRepository.remove(client, id);
    });
  },
};
