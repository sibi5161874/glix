import { z } from "zod";

export const ReportExportFormat = z.enum(["csv", "xlsx", "pdf"]);
export type ReportExportFormat = z.infer<typeof ReportExportFormat>;

export const LeaveReportFilter = z
  .object({
    year: z.coerce.number().int().min(2000).max(2100).optional(),
  })
  .strict();
export type LeaveReportFilter = z.infer<typeof LeaveReportFilter>;

export const ReportExportQuery = z
  .object({
    format: ReportExportFormat.default("xlsx"),
    year: z.coerce.number().int().min(2000).max(2100).optional(),
  })
  .strict();
export type ReportExportQuery = z.infer<typeof ReportExportQuery>;
