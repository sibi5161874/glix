import { describe, it, expect, beforeAll, afterAll, afterEach } from "vitest";
import type { FastifyInstance } from "fastify";
import { buildApp } from "../../app";
import { authHeader } from "../helpers";

let app: FastifyInstance;

beforeAll(async () => {
  app = await buildApp();
  await app.ready();
});

afterAll(async () => {
  await app.close();
});

afterEach(async () => {
  // Best-effort cleanup — tests create rows with a fixed, predictable prefix.
  await app
    .inject({
      method: "GET",
      url: "/v1/employees?search=IMPORT-&limit=100",
      headers: authHeader({ role: "org_admin" }),
    })
    .then(async (res) => {
      const items = res.json().data?.items ?? [];
      for (const item of items) {
        await app.inject({
          method: "DELETE",
          url: `/v1/employees/${item.id}`,
          headers: authHeader({ role: "org_admin" }),
        });
      }
    });
});

const BOUNDARY = "----vitestBoundary";

function multipartBody(csv: string): { payload: Buffer; contentType: string } {
  const parts = [
    `--${BOUNDARY}\r\n`,
    'Content-Disposition: form-data; name="file"; filename="employees.csv"\r\n',
    "Content-Type: text/csv\r\n\r\n",
    csv,
    `\r\n--${BOUNDARY}--\r\n`,
  ];
  return {
    payload: Buffer.from(parts.join("")),
    contentType: `multipart/form-data; boundary=${BOUNDARY}`,
  };
}

describe("POST /v1/employees/import", () => {
  it("denies import for org_staff (missing employees:import permission)", async () => {
    const { payload, contentType } = multipartBody(
      "employeeCode,firstName,lastName,email,joiningDate,basicSalary\n",
    );
    const res = await app.inject({
      method: "POST",
      url: "/v1/employees/import",
      headers: { ...authHeader({ role: "org_staff" }), "content-type": contentType },
      payload,
    });
    expect(res.statusCode).toBe(403);
  });

  it("imports valid rows and reports validation failures per row", async () => {
    const csv = [
      "employeeCode,firstName,lastName,email,joiningDate,basicSalary",
      "IMPORT-001,Imported,One,imported.one@acme.test,2026-02-01,4500",
      "IMPORT-002,Imported,Two,imported.two@acme.test,2026-02-02,4800",
      // missing required firstName -> fails Zod validation, not a thrown error
      "IMPORT-003,,Three,imported.three@acme.test,2026-02-03,4900",
    ].join("\n");
    const { payload, contentType } = multipartBody(csv);

    const res = await app.inject({
      method: "POST",
      url: "/v1/employees/import",
      headers: { ...authHeader({ role: "org_admin" }), "content-type": contentType },
      payload,
    });

    expect(res.statusCode).toBe(200);
    const summary = res.json().data;
    expect(summary.total).toBe(3);
    expect(summary.imported).toBe(2);
    expect(summary.failed).toHaveLength(1);
    expect(summary.failed[0].row).toBe(4); // header + 1-indexed + the 2 valid rows before it

    const list = await app.inject({
      method: "GET",
      url: "/v1/employees?search=IMPORT-",
      headers: authHeader({ role: "org_admin" }),
    });
    expect(list.json().data.items).toHaveLength(2);
  });

  it("rejects a non-multipart request (no Content-Type) before it reaches the controller", async () => {
    const res = await app.inject({
      method: "POST",
      url: "/v1/employees/import",
      headers: authHeader({ role: "org_admin" }),
    });
    // @fastify/multipart itself enforces this — never reaches employeeController.importCsv.
    expect(res.statusCode).toBe(406);
  });

  it("rejects a multipart request with no file field", async () => {
    const { payload, contentType } = (() => {
      const parts = [`--${BOUNDARY}--\r\n`];
      return {
        payload: Buffer.from(parts.join("")),
        contentType: `multipart/form-data; boundary=${BOUNDARY}`,
      };
    })();
    const res = await app.inject({
      method: "POST",
      url: "/v1/employees/import",
      headers: { ...authHeader({ role: "org_admin" }), "content-type": contentType },
      payload,
    });
    expect(res.statusCode).toBe(400);
    expect(res.json().code).toBe("VALIDATION_ERROR");
  });
});
