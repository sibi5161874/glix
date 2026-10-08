import { describe, it, expect, beforeAll, afterAll } from "vitest";
import type { FastifyInstance } from "fastify";
import { buildApp } from "../../app";

let app: FastifyInstance;

beforeAll(async () => {
  app = await buildApp();
  await app.ready();
});

afterAll(async () => {
  // No cleanup of registered test orgs/users here, deliberately — and it's
  // not just an oversight. `audit_log.org_id` is `references organizations
  // on delete cascade`, but `audit_log` itself blocks every DELETE via an
  // append-only trigger (004_audit_log.sql) — the moment anything writes an
  // audit row for an org (registration itself does), that org can never be
  // hard-deleted again; the cascade hits the trigger and the whole DELETE
  // fails with "audit_log is append-only". `organizations.deleted_at` exists
  // for exactly this reason — soft-delete is the only supported path — but
  // no app code sets it today. Each test run uses a timestamp-suffixed slug
  // (uniqueSlug()) so there's no collision risk across runs; this does mean
  // every CI/dev run leaves a handful of harmless orphan test orgs behind.
  await app.close();
});

function uniqueSlug(): string {
  return `auth-test-${Date.now().toString(36)}-${Math.floor(Math.random() * 1000)}`;
}

describe("POST /v1/auth/register", () => {
  it("rejects an invalid payload before touching the database", async () => {
    const res = await app.inject({
      method: "POST",
      url: "/v1/auth/register",
      payload: { email: "not-an-email" },
    });
    expect(res.statusCode).toBe(400);
    expect(res.json().code).toBe("VALIDATION_ERROR");
  });

  it("registers a new org + owner and returns a usable access token", async () => {
    const slug = uniqueSlug();
    const res = await app.inject({
      method: "POST",
      url: "/v1/auth/register",
      payload: {
        fullName: "Auth Test Owner",
        email: `${slug}@example.test`,
        password: "SuperSecret123",
        orgName: "Auth Test Org",
        orgSlug: slug,
        currency: "AED",
        planSlug: "free",
      },
    });
    expect(res.statusCode).toBe(201);
    const body = res.json().data;
    expect(body.accessToken).toEqual(expect.any(String));
    expect(body.claims.role).toBe("org_admin");
    expect(body.claims.isPlatformAdmin).toBe(false);

    // GET /me with the freshly issued token proves the token round-trips —
    // JWT_SECRET is consistent and claims survive sign/verify.
    const meRes = await app.inject({
      method: "GET",
      url: "/v1/auth/me",
      headers: { authorization: `Bearer ${body.accessToken}` },
    });
    expect(meRes.statusCode).toBe(200);
    expect(meRes.json().data.sub).toBe(body.claims.sub);
  });

  it("rejects a duplicate org slug with 409, not a raw DB error", async () => {
    const slug = uniqueSlug();
    const first = await app.inject({
      method: "POST",
      url: "/v1/auth/register",
      payload: {
        fullName: "First Owner",
        email: `${slug}-a@example.test`,
        password: "SuperSecret123",
        orgName: "Dup Slug Org",
        orgSlug: slug,
        currency: "AED",
        planSlug: "free",
      },
    });
    expect(first.statusCode).toBe(201);

    const second = await app.inject({
      method: "POST",
      url: "/v1/auth/register",
      payload: {
        fullName: "Second Owner",
        email: `${slug}-b@example.test`,
        password: "SuperSecret123",
        orgName: "Dup Slug Org Two",
        orgSlug: slug,
        currency: "AED",
        planSlug: "free",
      },
    });
    expect(second.statusCode).toBe(409);
  });
});

describe("POST /v1/auth/login", () => {
  it("rejects an invalid payload (missing secret)", async () => {
    const res = await app.inject({
      method: "POST",
      url: "/v1/auth/login",
      payload: { identifier: "owner@acme.test" },
    });
    expect(res.statusCode).toBe(400);
  });

  it("logs in with email + password", async () => {
    const res = await app.inject({
      method: "POST",
      url: "/v1/auth/login",
      payload: { identifier: "owner@acme.test", secret: "DevPass123!" },
    });
    expect(res.statusCode).toBe(200);
    const body = res.json().data;
    expect(body.claims.role).toBe("org_admin");
    expect(body.claims.email).toBe("owner@acme.test");
  });

  it("rejects a wrong password and a nonexistent email with the identical message (no user-enumeration leak)", async () => {
    const wrongPassword = await app.inject({
      method: "POST",
      url: "/v1/auth/login",
      payload: { identifier: "owner@acme.test", secret: "wrong-password" },
    });
    const noSuchUser = await app.inject({
      method: "POST",
      url: "/v1/auth/login",
      payload: { identifier: "nobody@acme.test", secret: "whatever123" },
    });
    expect(wrongPassword.statusCode).toBe(401);
    expect(noSuchUser.statusCode).toBe(401);
    // The real property under test: an attacker can't tell "wrong password"
    // apart from "no such account" — not that the word "password" is absent.
    expect(wrongPassword.json().error).toBe(noSuchUser.json().error);
  });

  it("logs in with employee code + date of birth", async () => {
    const res = await app.inject({
      method: "POST",
      url: "/v1/auth/login",
      payload: { identifier: "EMP-001", secret: "1990-05-15" },
    });
    expect(res.statusCode).toBe(200);
    expect(res.json().data.claims.employeeId).toBeDefined();
  });

  it("rejects employee-code login with the wrong date of birth", async () => {
    const res = await app.inject({
      method: "POST",
      url: "/v1/auth/login",
      payload: { identifier: "EMP-001", secret: "2000-01-01" },
    });
    expect(res.statusCode).toBe(401);
  });

  it("rejects employee-code login for an employee with no linked user account", async () => {
    const res = await app.inject({
      method: "POST",
      url: "/v1/auth/login",
      payload: { identifier: "EMP-002", secret: "1992-11-02" },
    });
    expect(res.statusCode).toBe(401);
  });
});

describe("GET /v1/auth/me", () => {
  it("rejects a request with no bearer token", async () => {
    const res = await app.inject({ method: "GET", url: "/v1/auth/me" });
    expect(res.statusCode).toBe(401);
  });

  it("rejects a malformed/invalid token", async () => {
    const res = await app.inject({
      method: "GET",
      url: "/v1/auth/me",
      headers: { authorization: "Bearer not-a-real-jwt" },
    });
    expect(res.statusCode).toBe(401);
  });
});

describe("rate limiting on /v1/auth/login", () => {
  it("returns 429 after exceeding the per-IP limit, isolated from other tests' counters", async () => {
    const limitedApp = await buildApp();
    await limitedApp.ready();
    try {
      let lastStatus = 200;
      for (let i = 0; i < 11; i++) {
        const res = await limitedApp.inject({
          method: "POST",
          url: "/v1/auth/login",
          payload: { identifier: "owner@acme.test", secret: "wrong-password" },
        });
        lastStatus = res.statusCode;
      }
      expect(lastStatus).toBe(429);
    } finally {
      await limitedApp.close();
    }
  });
});
