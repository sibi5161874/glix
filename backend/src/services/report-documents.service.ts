import type { FastifyInstance } from "fastify";
import type { ReportExportFormat } from "@app/shared/schemas";
import type { RequestContext } from "../plugins/db.plugin";
import { reportRepository } from "../repositories/report.repository";
import { documentRepository } from "../repositories/document.repository";
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
  { key: "value", header: "Count", width: 10 },
];

export interface DocumentExpiryReport {
  summary: {
    total: number;
    active: number;
    expiring30: number;
    expiring60: number;
    expiring90: number;
    expired: number;
  };
  byType: Array<{ label: string; count: number }>;
}

function flatten(report: DocumentExpiryReport): Array<Record<string, unknown>> {
  const { summary } = report;
  const rows: Array<Record<string, unknown>> = [
    { category: "Summary", label: "Total documents", value: summary.total },
    { category: "Summary", label: "Active (> 90 days)", value: summary.active },
    { category: "Summary", label: "Expiring in 30 days", value: summary.expiring30 },
    { category: "Summary", label: "Expiring in 60 days", value: summary.expiring60 },
    { category: "Summary", label: "Expiring in 90 days", value: summary.expiring90 },
    { category: "Summary", label: "Expired", value: summary.expired },
  ];
  for (const { label, count } of report.byType) {
    rows.push({ category: "By document type", label, value: count });
  }
  return rows;
}

export const reportDocumentsService = {
  async get(fastify: FastifyInstance, ctx: RequestContext): Promise<DocumentExpiryReport> {
    return fastify.withTenant(ctx, async (client) => {
      // Sequential, not Promise.all — same tenant-scoped `client`; see the
      // comment in report.repository.ts's employeeDemographics.
      const summary = await documentRepository.getSummary(client, ctx.orgId);
      const byType = await reportRepository.documentsByType(client, ctx.orgId);
      return { summary, byType };
    });
  },

  async export(
    fastify: FastifyInstance,
    ctx: RequestContext,
    format: ReportExportFormat,
  ): Promise<{ buffer: Buffer | string; contentType: string; filename: string }> {
    const report = await reportDocumentsService.get(fastify, ctx);
    const rows = flatten(report);
    const filename = `document-expiry.${format}`;
    const contentType = contentTypeFor(format);

    if (format === "csv") return { buffer: buildCsv(COLUMNS, rows), contentType, filename };
    if (format === "pdf") {
      return {
        buffer: await buildPdf("Document Expiry Report", COLUMNS, rows),
        contentType,
        filename,
      };
    }
    return { buffer: await buildXlsx("Documents", COLUMNS, rows), contentType, filename };
  },
};
