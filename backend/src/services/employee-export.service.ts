import ExcelJS from "exceljs";
import type { EmployeeRow } from "../repositories/employee.repository";

const COLUMNS: Array<{ header: string; key: keyof EmployeeRow; width: number }> = [
  { header: "Employee code", key: "employeeCode", width: 16 },
  { header: "First name", key: "firstName", width: 18 },
  { header: "Last name", key: "lastName", width: 18 },
  { header: "Email", key: "email", width: 26 },
  { header: "Phone", key: "phone", width: 16 },
  { header: "Department", key: "departmentName", width: 20 },
  { header: "Designation", key: "designationTitle", width: 20 },
  { header: "Joining date", key: "joiningDate", width: 14 },
  { header: "Employment type", key: "employmentType", width: 16 },
  { header: "Basic salary", key: "basicSalary", width: 14 },
  { header: "Status", key: "status", width: 14 },
];

/** Cells are typed (string/number), never raw-concatenated — avoids CSV/formula injection. */
export async function buildEmployeeWorkbook(rows: EmployeeRow[]): Promise<Buffer> {
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet("Employees");
  sheet.columns = COLUMNS.map((c) => ({ header: c.header, key: c.key, width: c.width }));
  sheet.getRow(1).font = { bold: true };

  for (const row of rows) {
    sheet.addRow({
      employeeCode: row.employeeCode,
      firstName: row.firstName,
      lastName: row.lastName,
      email: row.email,
      phone: row.phone ?? "",
      departmentName: row.departmentName ?? "",
      designationTitle: row.designationTitle ?? "",
      joiningDate: row.joiningDate,
      employmentType: row.employmentType,
      basicSalary: Number(row.basicSalary),
      status: row.status,
    });
  }

  const buffer = await workbook.xlsx.writeBuffer();
  return Buffer.from(buffer);
}
