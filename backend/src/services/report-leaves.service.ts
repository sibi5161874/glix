import type { FastifyInstance } from "fastify";
import type { ReportExportFormat } from "@app/shared/schemas";
import type { RequestContext } from "../plugins/db.plugin";
import { reportRepository, type LeaveUtilizationReport } from "../repositories/report.repository";
import {
  buildCsv,
  buildXlsx,
  buildPdf,
  contentTypeFor,
  type ReportColumn,
} from "./report-export.service";

const COLUMNS: ReportColumn[] = [
  { key: "leaveType", header: "Leave Type", width: 20 },
  { key: "totalAllocated", header: "Allocated", width: 12 },
  { key: "totalUsed", header: "Used", width: 12 },
  { key: "totalCarriedOver", header: "Carried Over", width: 14 },
  { key: "utilizationPercent", header: "Utilization %", width: 14 },
];

export const reportLeavesService = {
  async get(
    fastify: FastifyInstance,
    ctx: RequestContext,
    year: number,
  ): Promise<LeaveUtilizationReport> {
    return fastify.withTenant(ctx, (client) =>
      reportRepository.leaveUtilization(client, ctx.orgId, year),
    );
  },

  async export(
    fastify: FastifyInstance,
    ctx: RequestContext,
    year: number,
    format: ReportExportFormat,
  ): Promise<{ buffer: Buffer | string; contentType: string; filename: string }> {
    const report = await reportLeavesService.get(fastify, ctx, year);
    const rows: Array<Record<string, unknown>> = report.byLeaveType.map((r) => ({ ...r }));
    const filename = `leave-utilization-${year}.${format}`;
    const contentType = contentTypeFor(format);

    if (format === "csv") return { buffer: buildCsv(COLUMNS, rows), contentType, filename };
    if (format === "pdf") {
      return {
        buffer: await buildPdf(`Leave Utilization — ${year}`, COLUMNS, rows),
        contentType,
        filename,
      };
    }
    return { buffer: await buildXlsx(`Leave ${year}`, COLUMNS, rows), contentType, filename };
  },
};
