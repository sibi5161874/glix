import type { FastifyInstance } from "fastify";
import type { ReportExportFormat } from "@app/shared/schemas";
import type { RequestContext } from "../plugins/db.plugin";
import { reportRepository } from "../repositories/report.repository";
import { loanRepository } from "../repositories/loan.repository";
import {
  buildCsv,
  buildXlsx,
  buildPdf,
  contentTypeFor,
  type ReportColumn,
} from "./report-export.service";

const COLUMNS: ReportColumn[] = [
  { key: "category", header: "Category", width: 20 },
  { key: "label", header: "Label", width: 24 },
  { key: "value", header: "Value", width: 14 },
];

export interface LoanBalancesReport {
  summary: {
    total: number;
    activeCount: number;
    pendingCount: number;
    totalOutstanding: string;
    totalRepaid: string;
  };
  byStatus: Array<{ label: string; count: number }>;
}

function flatten(report: LoanBalancesReport): Array<Record<string, unknown>> {
  const { summary } = report;
  const rows: Array<Record<string, unknown>> = [
    { category: "Summary", label: "Total loans", value: summary.total },
    { category: "Summary", label: "Active", value: summary.activeCount },
    { category: "Summary", label: "Pending", value: summary.pendingCount },
    { category: "Summary", label: "Total outstanding", value: summary.totalOutstanding },
    { category: "Summary", label: "Total repaid", value: summary.totalRepaid },
  ];
  for (const { label, count } of report.byStatus) {
    rows.push({ category: "By status", label, value: count });
  }
  return rows;
}

export const reportLoansService = {
  async get(fastify: FastifyInstance, ctx: RequestContext): Promise<LoanBalancesReport> {
    return fastify.withTenant(ctx, async (client) => {
      // Sequential, not Promise.all — same tenant-scoped `client`; see the
      // comment in report.repository.ts's employeeDemographics.
      const summary = await loanRepository.getSummary(client, ctx.orgId);
      const byStatus = await reportRepository.loansByStatus(client, ctx.orgId);
      return { summary, byStatus };
    });
  },

  async export(
    fastify: FastifyInstance,
    ctx: RequestContext,
    format: ReportExportFormat,
  ): Promise<{ buffer: Buffer | string; contentType: string; filename: string }> {
    const report = await reportLoansService.get(fastify, ctx);
    const rows = flatten(report);
    const filename = `loan-balances.${format}`;
    const contentType = contentTypeFor(format);

    if (format === "csv") return { buffer: buildCsv(COLUMNS, rows), contentType, filename };
    if (format === "pdf") {
      return {
        buffer: await buildPdf("Loan Balances Report", COLUMNS, rows),
        contentType,
        filename,
      };
    }
    return { buffer: await buildXlsx("Loans", COLUMNS, rows), contentType, filename };
  },
};
