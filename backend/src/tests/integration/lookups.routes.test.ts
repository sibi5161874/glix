import { describe, it, expect, beforeAll, afterAll } from "vitest";
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

describe("lookups routes", () => {
  it("rejects anonymous requests", async () => {
    const res = await app.inject({ method: "GET", url: "/v1/departments" });
    expect(res.statusCode).toBe(401);
  });

  it("lists departments scoped to the caller's org", async () => {
    const res = await app.inject({
      method: "GET",
      url: "/v1/departments",
      headers: authHeader({ role: "org_admin" }),
    });
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.json().data)).toBe(true);
  });

  it("lists designations scoped to the caller's org", async () => {
    const res = await app.inject({
      method: "GET",
      url: "/v1/designations",
      headers: authHeader({ role: "org_admin" }),
    });
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.json().data)).toBe(true);
  });
});
