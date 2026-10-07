import { describe, it, expect, beforeAll, afterAll } from "vitest";
import type { FastifyInstance } from "fastify";
import { Pool } from "pg";
import { buildApp } from "../../app";
import { authHeader } from "../helpers";

let app: FastifyInstance;
const createdAnnouncementIds: string[] = [];

beforeAll(async () => {
  app = await buildApp();
  await app.ready();
});

afterAll(async () => {
  if (createdAnnouncementIds.length > 0) {
    const pool = new Pool({ connectionString: process.env["DATABASE_URL_MIGRATE"] });
    await pool.query("delete from public.announcements where id = any($1::uuid[])", [
      createdAnnouncementIds,
    ]);
    await pool.end();
  }
  await app.close();
});

describe("announcements routes", () => {
  it("creates, reads, updates, and deletes an announcement", async () => {
    // Create announcement
    const createRes = await app.inject({
      method: "POST",
      url: "/v1/announcements",
      headers: authHeader({ role: "org_admin" }),
      payload: {
        title: "All-Hands Company Meeting",
        body: "Annual review meeting on Friday at 3 PM in Conference Hall A.",
        priority: "urgent",
      },
    });

    expect(createRes.statusCode).toBe(201);
    const item = createRes.json().data;
    expect(item.id).toBeDefined();
    expect(item.title).toBe("All-Hands Company Meeting");
    expect(item.priority).toBe("urgent");
    createdAnnouncementIds.push(item.id);

    // List announcements
    const listRes = await app.inject({
      method: "GET",
      url: "/v1/announcements?priority=urgent",
      headers: authHeader({ role: "org_admin" }),
    });
    expect(listRes.statusCode).toBe(200);
    expect(listRes.json().data.items.length).toBeGreaterThanOrEqual(1);

    // Update announcement
    const updateRes = await app.inject({
      method: "PUT",
      url: `/v1/announcements/${item.id}`,
      headers: authHeader({ role: "org_admin" }),
      payload: {
        title: "All-Hands Company Meeting (Updated Room)",
        body: "Annual review meeting on Friday at 3 PM in Main Auditorium.",
        priority: "high",
      },
    });
    expect(updateRes.statusCode).toBe(200);
    expect(updateRes.json().data.title).toContain("Updated Room");
    expect(updateRes.json().data.priority).toBe("high");

    // Viewer read access
    const viewerRes = await app.inject({
      method: "GET",
      url: `/v1/announcements/${item.id}`,
      headers: authHeader({ role: "org_viewer" }),
    });
    expect(viewerRes.statusCode).toBe(200);
    expect(viewerRes.json().data.id).toBe(item.id);

    // Delete announcement
    const deleteRes = await app.inject({
      method: "DELETE",
      url: `/v1/announcements/${item.id}`,
      headers: authHeader({ role: "org_admin" }),
    });
    expect(deleteRes.statusCode).toBe(200);
  });
});
