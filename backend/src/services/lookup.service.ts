import type { FastifyInstance } from "fastify";
import type { RequestContext } from "../plugins/db.plugin";
import {
  lookupRepository,
  type DepartmentRow,
  type DesignationRow,
} from "../repositories/lookup.repository";

export const lookupService = {
  async departments(fastify: FastifyInstance, ctx: RequestContext): Promise<DepartmentRow[]> {
    return fastify.withTenant(ctx, (client) => lookupRepository.listDepartments(client, ctx.orgId));
  },

  async designations(fastify: FastifyInstance, ctx: RequestContext): Promise<DesignationRow[]> {
    return fastify.withTenant(ctx, (client) =>
      lookupRepository.listDesignations(client, ctx.orgId),
    );
  },
};
