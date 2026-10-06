import type { FastifyInstance } from "fastify";
import type { AdjustLeaveBalanceInput, LeaveBalanceFilter } from "@app/shared/schemas";
import type { RequestContext } from "../plugins/db.plugin";
import {
  leaveBalanceRepository,
  type LeaveBalanceRow,
} from "../repositories/leave-balance.repository";

export const leaveBalanceService = {
  async list(
    fastify: FastifyInstance,
    ctx: RequestContext,
    filter: LeaveBalanceFilter,
  ): Promise<LeaveBalanceRow[]> {
    return fastify.withTenant(ctx, (client) =>
      leaveBalanceRepository.list(client, ctx.orgId, filter),
    );
  },

  async adjust(
    fastify: FastifyInstance,
    ctx: RequestContext,
    input: AdjustLeaveBalanceInput,
  ): Promise<LeaveBalanceRow> {
    return fastify.withTenant(ctx, (client) =>
      leaveBalanceRepository.upsert(client, ctx.orgId, input),
    );
  },
};
