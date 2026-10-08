import type { FastifyInstance } from "fastify";
import type { ReportExportFormat } from "@app/shared/schemas";
import type { RequestContext } from "../plugins/db.plugin";
import {
  reportRepository,
  type EmployeeDemographicsReport,
} from "../repositories/report.repository";
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

function flatten(report: EmployeeDemographicsReport): Array<Record<string, unknown>> {
  const rows: Array<Record<string, unknown>> = [
    { category: "Summary", label: "Total employees", value: report.totalEmployees },
  ];
  const sections: Array<[string, typeof report.byDepartment]> = [
    ["Department", report.byDepartment],
    ["Designation", report.byDesignation],
    ["Gender", report.byGender],
    ["Employment type", report.byEmploymentType],
    ["Status", report.byStatus],
  ];
  for (const [category, breakdown] of sections) {
    for (const { label, count } of breakdown) {
      rows.push({ category, label, value: count });
    }
  }
  return rows;
}

export const reportEmployeesService = {
  async get(fastify: FastifyInstance, ctx: RequestContext): Promise<EmployeeDemographicsReport> {
    return fastify.withTenant(ctx, (client) =>
      reportRepository.employeeDemographics(client, ctx.orgId),
    );
  },

  async export(
    fastify: FastifyInstance,
    ctx: RequestContext,
    format: ReportExportFormat,
  ): Promise<{ buffer: Buffer | string; contentType: string; filename: string }> {
    const report = await reportEmployeesService.get(fastify, ctx);
    const rows = flatten(report);
    const filename = `employee-demographics.${format}`;
    const contentType = contentTypeFor(format);

    if (format === "csv") return { buffer: buildCsv(COLUMNS, rows), contentType, filename };
    if (format === "pdf") {
      return {
        buffer: await buildPdf("Employee Demographics", COLUMNS, rows),
        contentType,
        filename,
      };
    }
    return { buffer: await buildXlsx("Employees", COLUMNS, rows), contentType, filename };
  },
};
