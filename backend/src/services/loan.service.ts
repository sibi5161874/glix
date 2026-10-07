import type { FastifyInstance } from "fastify";
import type { CreateLoanInput, LoanFilter } from "@app/shared/schemas";
import type { RequestContext } from "../plugins/db.plugin";
import { loanRepository, type LoanRow } from "../repositories/loan.repository";
import { employeeRepository } from "../repositories/employee.repository";
import { ForbiddenError, NotFoundError, ValidationError } from "../utils/errors";

export const loanService = {
  async list(
    fastify: FastifyInstance,
    ctx: RequestContext,
    filter: LoanFilter,
  ): Promise<{ items: LoanRow[]; total: number; page: number; limit: number }> {
    const isViewer = ctx.role === "org_viewer";
    const selfEmployeeId = isViewer ? ctx.employeeId : undefined;

    return fastify.withTenant(ctx, (client) =>
      loanRepository.list(client, ctx.orgId, filter, selfEmployeeId),
    );
  },

  async findById(fastify: FastifyInstance, ctx: RequestContext, id: string): Promise<LoanRow> {
    return fastify.withTenant(ctx, async (client) => {
      const loan = await loanRepository.findById(client, id);
      if (!loan || loan.orgId !== ctx.orgId) throw new NotFoundError("Loan");

      if (ctx.role === "org_viewer" && loan.employeeId !== ctx.employeeId) {
        throw new ForbiddenError("Cannot view other employees' loans");
      }

      return loan;
    });
  },

  async create(
    fastify: FastifyInstance,
    ctx: RequestContext,
    input: CreateLoanInput,
  ): Promise<LoanRow> {
    return fastify.withTenant(ctx, async (client) => {
      if (ctx.role === "org_viewer" && input.employeeId !== ctx.employeeId) {
        throw new ForbiddenError("Cannot request loan for another employee");
      }

      const employee = await employeeRepository.findById(client, input.employeeId);
      if (!employee || employee.orgId !== ctx.orgId) {
        throw new ValidationError("Employee not found in organization");
      }

      return await loanRepository.create(client, ctx.orgId, input);
    });
  },

  async approve(fastify: FastifyInstance, ctx: RequestContext, id: string): Promise<LoanRow> {
    return fastify.withTenant(ctx, async (client) => {
      const existing = await loanRepository.findById(client, id);
      if (!existing || existing.orgId !== ctx.orgId) throw new NotFoundError("Loan");
      if (existing.status !== "pending") {
        throw new ValidationError(`Cannot approve loan with status '${existing.status}'`);
      }

      return (await loanRepository.approve(client, id, ctx.userId))!;
    });
  },

  async reject(fastify: FastifyInstance, ctx: RequestContext, id: string): Promise<LoanRow> {
    return fastify.withTenant(ctx, async (client) => {
      const existing = await loanRepository.findById(client, id);
      if (!existing || existing.orgId !== ctx.orgId) throw new NotFoundError("Loan");
      if (existing.status !== "pending") {
        throw new ValidationError(`Cannot reject loan with status '${existing.status}'`);
      }

      return (await loanRepository.reject(client, id))!;
    });
  },

  async recordPayment(
    fastify: FastifyInstance,
    ctx: RequestContext,
    id: string,
    amount: number,
  ): Promise<LoanRow> {
    return fastify.withTenant(ctx, async (client) => {
      const existing = await loanRepository.findById(client, id);
      if (!existing || existing.orgId !== ctx.orgId) throw new NotFoundError("Loan");
      if (existing.status !== "active") {
        throw new ValidationError("Payments can only be recorded against active loans");
      }

      return (await loanRepository.recordPayment(client, id, amount))!;
    });
  },

  async getSummary(fastify: FastifyInstance, ctx: RequestContext) {
    const isViewer = ctx.role === "org_viewer";
    const selfEmployeeId = isViewer ? ctx.employeeId : undefined;

    return fastify.withTenant(ctx, (client) =>
      loanRepository.getSummary(client, ctx.orgId, selfEmployeeId),
    );
  },
};
