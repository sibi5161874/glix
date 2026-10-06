import type { FastifyInstance } from "fastify";
import type { PoolClient } from "pg";
import type { CreateLeaveRequestInput, LeaveRequestFilter } from "@app/shared/schemas";
import type { RequestContext } from "../plugins/db.plugin";
import {
  leaveRequestRepository,
  type LeaveRequestRow,
} from "../repositories/leave-request.repository";
import { ConflictError, ForbiddenError, NotFoundError } from "../utils/errors";

const MS_PER_DAY = 24 * 60 * 60 * 1000;

/** Inclusive calendar-day count. Simplification: does not exclude weekends/holidays yet. */
function countDays(startDate: string, endDate: string): number {
  const start = new Date(`${startDate}T00:00:00Z`);
  const end = new Date(`${endDate}T00:00:00Z`);
  return Math.round((end.getTime() - start.getTime()) / MS_PER_DAY) + 1;
}

export const leaveRequestService = {
  async list(
    fastify: FastifyInstance,
    ctx: RequestContext,
    filter: LeaveRequestFilter,
  ): Promise<LeaveRequestRow[]> {
    return fastify.withTenant(ctx, (client) => leaveRequestRepository.list(client, filter));
  },

  async create(
    fastify: FastifyInstance,
    ctx: RequestContext,
    input: CreateLeaveRequestInput,
  ): Promise<LeaveRequestRow> {
    if (ctx.role === "org_viewer" && input.employeeId !== ctx.employeeId) {
      throw new ForbiddenError("You can only request leave for yourself");
    }
    const totalDays = countDays(input.startDate, input.endDate);
    return fastify.withTenant(ctx, (client) =>
      leaveRequestRepository.create(client, ctx.orgId, totalDays, input),
    );
  },

  async approve(
    fastify: FastifyInstance,
    ctx: RequestContext,
    id: string,
  ): Promise<LeaveRequestRow> {
    return fastify.withTenant(ctx, async (client) => {
      await assertPending(client, ctx.orgId, id);
      return (await leaveRequestRepository.setStatus(client, id, "approved", {
        approvedBy: ctx.userId,
      }))!;
    });
  },

  async reject(
    fastify: FastifyInstance,
    ctx: RequestContext,
    id: string,
    rejectionReason: string,
  ): Promise<LeaveRequestRow> {
    return fastify.withTenant(ctx, async (client) => {
      await assertPending(client, ctx.orgId, id);
      return (await leaveRequestRepository.setStatus(client, id, "rejected", {
        rejectionReason,
      }))!;
    });
  },

  async cancel(fastify: FastifyInstance, ctx: RequestContext, id: string): Promise<void> {
    await fastify.withTenant(ctx, async (client) => {
      const existing = await leaveRequestRepository.findById(client, id);
      if (!existing || existing.orgId !== ctx.orgId) throw new NotFoundError("Leave request");
      if (existing.status !== "pending") {
        throw new ConflictError("Only a pending request can be cancelled");
      }
      const isSelf = existing.employeeId === ctx.employeeId;
      const isApprover = ctx.role === "org_admin" || ctx.role === "org_staff";
      if (!isSelf && !isApprover) throw new ForbiddenError("Not your request to cancel");

      if (isSelf) await leaveRequestRepository.remove(client, id);
      else await leaveRequestRepository.setStatus(client, id, "cancelled");
    });
  },
};

async function assertPending(
  client: PoolClient,
  orgId: string,
  id: string,
): Promise<LeaveRequestRow> {
  const existing = await leaveRequestRepository.findById(client, id);
  if (!existing || existing.orgId !== orgId) throw new NotFoundError("Leave request");
  if (existing.status !== "pending") {
    throw new ConflictError(`Request already ${existing.status}`);
  }
  return existing;
}
