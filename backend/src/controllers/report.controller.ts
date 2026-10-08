import type { FastifyRequest, FastifyReply } from "fastify";
import { ReportExportQuery, LeaveReportFilter } from "@app/shared/schemas";
import { reportEmployeesService } from "../services/report-employees.service";
import { reportLeavesService } from "../services/report-leaves.service";
import { reportDocumentsService } from "../services/report-documents.service";
import { reportLoansService } from "../services/report-loans.service";
import { sendSuccess } from "../utils/http";
import { ValidationError } from "../utils/errors";
import { toRequestContext } from "../utils/request-context";

function currentYear(): number {
  return new Date().getUTCFullYear();
}

async function sendExport(
  reply: FastifyReply,
  result: { buffer: Buffer | string; contentType: string; filename: string },
): Promise<FastifyReply> {
  reply.header("Content-Type", result.contentType);
  reply.header("Content-Disposition", `attachment; filename="${result.filename}"`);
  return reply.send(result.buffer);
}

export const reportController = {
  async employees(req: FastifyRequest, reply: FastifyReply): Promise<FastifyReply> {
    const ctx = toRequestContext(req.auth!);
    const data = await reportEmployeesService.get(req.server, ctx);
    return sendSuccess(reply, data);
  },

  async employeesExport(req: FastifyRequest, reply: FastifyReply): Promise<FastifyReply> {
    const parsed = ReportExportQuery.safeParse(req.query);
    if (!parsed.success) throw new ValidationError("Invalid query", parsed.error.flatten());
    const ctx = toRequestContext(req.auth!);
    const result = await reportEmployeesService.export(req.server, ctx, parsed.data.format);
    return sendExport(reply, result);
  },

  async leaves(req: FastifyRequest, reply: FastifyReply): Promise<FastifyReply> {
    const parsed = LeaveReportFilter.safeParse(req.query);
    if (!parsed.success) throw new ValidationError("Invalid query", parsed.error.flatten());
    const ctx = toRequestContext(req.auth!);
    const data = await reportLeavesService.get(req.server, ctx, parsed.data.year ?? currentYear());
    return sendSuccess(reply, data);
  },

  async leavesExport(req: FastifyRequest, reply: FastifyReply): Promise<FastifyReply> {
    const parsed = ReportExportQuery.safeParse(req.query);
    if (!parsed.success) throw new ValidationError("Invalid query", parsed.error.flatten());
    const ctx = toRequestContext(req.auth!);
    const result = await reportLeavesService.export(
      req.server,
      ctx,
      parsed.data.year ?? currentYear(),
      parsed.data.format,
    );
    return sendExport(reply, result);
  },

  async documents(req: FastifyRequest, reply: FastifyReply): Promise<FastifyReply> {
    const ctx = toRequestContext(req.auth!);
    const data = await reportDocumentsService.get(req.server, ctx);
    return sendSuccess(reply, data);
  },

  async documentsExport(req: FastifyRequest, reply: FastifyReply): Promise<FastifyReply> {
    const parsed = ReportExportQuery.safeParse(req.query);
    if (!parsed.success) throw new ValidationError("Invalid query", parsed.error.flatten());
    const ctx = toRequestContext(req.auth!);
    const result = await reportDocumentsService.export(req.server, ctx, parsed.data.format);
    return sendExport(reply, result);
  },

  async loans(req: FastifyRequest, reply: FastifyReply): Promise<FastifyReply> {
    const ctx = toRequestContext(req.auth!);
    const data = await reportLoansService.get(req.server, ctx);
    return sendSuccess(reply, data);
  },

  async loansExport(req: FastifyRequest, reply: FastifyReply): Promise<FastifyReply> {
    const parsed = ReportExportQuery.safeParse(req.query);
    if (!parsed.success) throw new ValidationError("Invalid query", parsed.error.flatten());
    const ctx = toRequestContext(req.auth!);
    const result = await reportLoansService.export(req.server, ctx, parsed.data.format);
    return sendExport(reply, result);
  },
};
