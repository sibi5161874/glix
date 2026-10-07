import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { writeFileSync, unlinkSync, existsSync } from "fs";
import { resolve } from "path";
import type { FastifyInstance } from "fastify";
import { buildApp } from "../../app";
import { authHeader, SEEDED_STAFF_EMPLOYEE_ID } from "../helpers";

let app: FastifyInstance;
const tempFilePath = resolve(process.cwd(), "test-temp-doc.pdf");

beforeAll(async () => {
  app = await buildApp();
  await app.ready();
  writeFileSync(tempFilePath, "PDF-DUMMY-CONTENT");
});

afterAll(async () => {
  // The "Security Clearance" document type created below has no natural
  // uniqueness (only its generated `code` is unique) and was never cleaned
  // up — every test run left a new duplicate row behind, visible in the UI's
  // document-type filter dropdown (same class of leak as leave.routes.test.ts
  // hit earlier; see .agents/_session.md).
  if (createdDocTypeId) {
    await app.inject({
      method: "DELETE",
      url: `/v1/document-types/${createdDocTypeId}`,
      headers: authHeader({ role: "org_admin" }),
    });
  }
  await app.close();
  if (existsSync(tempFilePath)) {
    unlinkSync(tempFilePath);
  }
});

let createdDocTypeId: string;

describe("documents & document-types routes", () => {
  let docTypeId: string;
  let createdDocId: string;
  const uniqueCode = `clearance_${Date.now().toString().slice(-6)}`;

  it("lists seeded document types for org_staff", async () => {
    const res = await app.inject({
      method: "GET",
      url: "/v1/document-types",
      headers: authHeader({ role: "org_staff" }),
    });
    expect(res.statusCode).toBe(200);
    const types = res.json().data;
    expect(types.length).toBeGreaterThanOrEqual(1);
    docTypeId = types[0].id;
  });

  it("creates a document type as org_admin", async () => {
    const res = await app.inject({
      method: "POST",
      url: "/v1/document-types",
      headers: authHeader({ role: "org_admin" }),
      payload: {
        name: "Security Clearance",
        code: uniqueCode,
        requiresExpiry: true,
        alertDays: [60, 30],
      },
    });
    expect(res.statusCode).toBe(201);
    expect(res.json().data.code).toBe(uniqueCode);
    createdDocTypeId = res.json().data.id;
  });

  it("uploads a document as org_staff (JSON payload)", async () => {
    const res = await app.inject({
      method: "POST",
      url: "/v1/documents",
      headers: authHeader({ role: "org_staff" }),
      payload: {
        employeeId: SEEDED_STAFF_EMPLOYEE_ID,
        documentTypeId: docTypeId,
        documentNumber: "DOC-998877",
        issueDate: "2024-01-01",
        expiryDate: "2028-01-01",
        filePath: "test-temp-doc.pdf",
        fileSize: 1024,
        mimeType: "application/pdf",
      },
    });
    expect(res.statusCode).toBe(201);
    const doc = res.json().data;
    expect(doc.documentNumber).toBe("DOC-998877");
    expect(doc.status).toBe("active");
    // Regression: issue_date/expiry_date are `date` columns — node-pg parses
    // them as a JS Date at local midnight, and naively calling .toISOString()
    // on that shifts the date backward by one day in any positive-UTC-offset
    // timezone (caught in dev under IST, UTC+5:30). Must round-trip exactly.
    expect(doc.issueDate).toBe("2024-01-01");
    expect(doc.expiryDate).toBe("2028-01-01");
    createdDocId = doc.id;
  });

  it("retrieves document summary counts", async () => {
    const res = await app.inject({
      method: "GET",
      url: "/v1/documents/summary",
      headers: authHeader({ role: "org_staff" }),
    });
    expect(res.statusCode).toBe(200);
    const summary = res.json().data;
    expect(summary.total).toBeGreaterThanOrEqual(1);
  });

  it("lists documents with search and filters", async () => {
    const res = await app.inject({
      method: "GET",
      url: `/v1/documents?search=DOC-998877`,
      headers: authHeader({ role: "org_staff" }),
    });
    expect(res.statusCode).toBe(200);
    const list = res.json().data;
    expect(list.items.length).toBe(1);
    expect(list.items[0].documentNumber).toBe("DOC-998877");
  });

  it("updates a document's metadata", async () => {
    const res = await app.inject({
      method: "PUT",
      url: `/v1/documents/${createdDocId}`,
      headers: authHeader({ role: "org_staff" }),
      payload: {
        documentNumber: "DOC-998877-UPDATED",
      },
    });
    expect(res.statusCode).toBe(200);
    expect(res.json().data.documentNumber).toBe("DOC-998877-UPDATED");
  });

  it("downloads the document file", async () => {
    const res = await app.inject({
      method: "GET",
      url: `/v1/documents/${createdDocId}/download`,
      headers: authHeader({ role: "org_staff" }),
    });
    expect(res.statusCode).toBe(200);
    expect(res.headers["content-type"]).toBe("application/pdf");
    expect(res.body).toBe("PDF-DUMMY-CONTENT");
  });

  it("denies delete for org_staff, allows for org_admin", async () => {
    const staffRes = await app.inject({
      method: "DELETE",
      url: `/v1/documents/${createdDocId}`,
      headers: authHeader({ role: "org_staff" }),
    });
    expect(staffRes.statusCode).toBe(403);

    const adminRes = await app.inject({
      method: "DELETE",
      url: `/v1/documents/${createdDocId}`,
      headers: authHeader({ role: "org_admin" }),
    });
    expect(adminRes.statusCode).toBe(200);
  });
});
