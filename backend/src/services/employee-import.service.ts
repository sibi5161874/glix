import type { FastifyInstance } from "fastify";
import type { PoolClient } from "pg";
import { CreateEmployeeInput } from "@app/shared/schemas";
import type { RequestContext } from "../plugins/db.plugin";
import { employeeRepository } from "../repositories/employee.repository";
import { parseCsv } from "../utils/csv";
import { assertWithinEmployeeLimit } from "./employee.service";

export interface ImportRowError {
  row: number;
  error: string;
}

export interface ImportSummary {
  total: number;
  imported: number;
  failed: ImportRowError[];
}

/** CSV header -> CreateEmployeeInput field. `department`/`designation` are names, resolved per-org. */
const CSV_FIELDS = [
  "employeeCode",
  "firstName",
  "lastName",
  "email",
  "phone",
  "dob",
  "gender",
  "nationality",
  "maritalStatus",
  "department",
  "designation",
  "joiningDate",
  "employmentType",
  "basicSalary",
  "bankAccount",
  "iban",
] as const;

export async function importEmployeesFromCsv(
  fastify: FastifyInstance,
  ctx: RequestContext,
  csvText: string,
): Promise<ImportSummary> {
  const rows = parseCsv(csvText);
  const failed: ImportRowError[] = [];
  let imported = 0;

  await fastify.withTenant(ctx, async (client) => {
    for (let i = 0; i < rows.length; i++) {
      const outcome = await importRow(client, ctx.orgId, rows[i]!);
      if (outcome.ok) imported++;
      else failed.push({ row: i + 2, error: outcome.error }); // +2: header row + 1-indexed
    }
  });

  return { total: rows.length, imported, failed };
}

async function importRow(
  client: PoolClient,
  orgId: string,
  raw: Record<string, string>,
): Promise<{ ok: true } | { ok: false; error: string }> {
  try {
    await assertWithinEmployeeLimit(client, orgId, 1);
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Employee limit reached" };
  }

  const candidate = await resolveRow(client, orgId, raw);
  const parsed = CreateEmployeeInput.safeParse(candidate);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues.map((i) => i.message).join("; ") };
  }

  try {
    await employeeRepository.create(client, orgId, parsed.data);
    return { ok: true };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    const friendly = message.includes("duplicate key")
      ? "Employee code or email already exists in this organization"
      : message;
    return { ok: false, error: friendly };
  }
}

async function resolveRow(
  client: PoolClient,
  orgId: string,
  raw: Record<string, string>,
): Promise<Record<string, unknown>> {
  const out: Record<string, unknown> = {};
  for (const field of CSV_FIELDS) {
    const value = raw[field];
    if (value) out[field] = value;
  }
  if (typeof out["basicSalary"] === "string") out["basicSalary"] = Number(out["basicSalary"]);

  const departmentName = out["department"] as string | undefined;
  delete out["department"];
  if (departmentName) {
    out["departmentId"] = await employeeRepository.findDepartmentByName(
      client,
      orgId,
      departmentName,
    );
  }

  const designationTitle = out["designation"] as string | undefined;
  delete out["designation"];
  if (designationTitle) {
    out["designationId"] = await employeeRepository.findDesignationByTitle(
      client,
      orgId,
      designationTitle,
    );
  }

  return out;
}
