import ExcelJS from "exceljs";
import PDFDocument from "pdfkit";

export interface ReportColumn {
  key: string;
  header: string;
  width?: number;
}

/** Cells are typed/escaped, never raw-concatenated — same no-injection
 * discipline as employee-export.service.ts. Shared across all 4 reports so
 * CSV/XLSX/PDF generation logic exists exactly once. */
export function buildCsv(columns: ReportColumn[], rows: Array<Record<string, unknown>>): string {
  const escape = (v: unknown): string => {
    const s = v === null || v === undefined ? "" : String(v);
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  const header = columns.map((c) => escape(c.header)).join(",");
  const lines = rows.map((row) => columns.map((c) => escape(row[c.key])).join(","));
  return [header, ...lines].join("\r\n");
}

export async function buildXlsx(
  sheetName: string,
  columns: ReportColumn[],
  rows: Array<Record<string, unknown>>,
): Promise<Buffer> {
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet(sheetName);
  sheet.columns = columns.map((c) => ({ header: c.header, key: c.key, width: c.width ?? 18 }));
  sheet.getRow(1).font = { bold: true };
  for (const row of rows) sheet.addRow(row);
  const buffer = await workbook.xlsx.writeBuffer();
  return Buffer.from(buffer);
}

export function buildPdf(
  title: string,
  columns: ReportColumn[],
  rows: Array<Record<string, unknown>>,
): Promise<Buffer> {
  return new Promise((resolvePromise, reject) => {
    const doc = new PDFDocument({ margin: 40, size: "A4", layout: "landscape" });
    const chunks: Buffer[] = [];
    doc.on("data", (chunk: Buffer) => chunks.push(chunk));
    doc.on("end", () => resolvePromise(Buffer.concat(chunks)));
    doc.on("error", reject);

    doc.fontSize(16).text(title, { align: "left" });
    doc.moveDown(0.5);
    doc.fontSize(9);

    const pageWidth = doc.page.width - doc.page.margins.left - doc.page.margins.right;
    const colWidth = pageWidth / columns.length;
    const startX = doc.page.margins.left;
    let y = doc.y;

    const drawRow = (values: string[], bold: boolean): void => {
      if (y > doc.page.height - doc.page.margins.bottom - 20) {
        doc.addPage();
        y = doc.page.margins.top;
      }
      doc.font(bold ? "Helvetica-Bold" : "Helvetica");
      values.forEach((val, i) => {
        doc.text(val, startX + i * colWidth, y, { width: colWidth - 4, ellipsis: true });
      });
      y += 16;
    };

    drawRow(
      columns.map((c) => c.header),
      true,
    );
    for (const row of rows) {
      drawRow(
        columns.map((c) =>
          row[c.key] === null || row[c.key] === undefined ? "—" : String(row[c.key]),
        ),
        false,
      );
    }

    doc.end();
  });
}

export function contentTypeFor(format: "csv" | "xlsx" | "pdf"): string {
  if (format === "csv") return "text/csv";
  if (format === "pdf") return "application/pdf";
  return "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
}
