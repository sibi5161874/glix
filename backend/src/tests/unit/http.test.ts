import { describe, it, expect, vi } from "vitest";
import type { FastifyReply, FastifyRequest } from "fastify";
import { sendError } from "../../utils/http";
import { ValidationError } from "../../utils/errors";

function mockReply(): FastifyReply & { _status?: number; _body?: unknown } {
  const reply = {} as FastifyReply & { _status?: number; _body?: unknown };
  reply.status = vi.fn((code: number) => {
    reply._status = code;
    return reply;
  }) as unknown as FastifyReply["status"];
  reply.send = vi.fn((body: unknown) => {
    reply._body = body;
    return reply;
  }) as unknown as FastifyReply["send"];
  reply.log = { error: vi.fn() } as unknown as FastifyReply["log"];
  return reply;
}

describe("sendError", () => {
  it("uses an AppError's own statusCode/code/details", () => {
    const reply = mockReply();
    sendError(reply, new ValidationError("bad input", { field: "x" }));
    expect(reply._status).toBe(400);
    expect(reply._body).toEqual({
      error: "bad input",
      code: "VALIDATION_ERROR",
      details: { field: "x" },
    });
  });

  it("reports a plugin-thrown client error that has a statusCode but no `code` (e.g. @fastify/rate-limit's 429)", () => {
    const reply = mockReply();
    sendError(reply, { statusCode: 429, message: "Rate limit exceeded, retry in 59 seconds" });
    expect(reply._status).toBe(429);
    expect(reply._body).toEqual({
      error: "Rate limit exceeded, retry in 59 seconds",
      code: "CLIENT_ERROR",
    });
  });

  it("reports a Fastify parsing error that has both statusCode and code", () => {
    const reply = mockReply();
    sendError(reply, {
      statusCode: 400,
      code: "FST_ERR_CTP_EMPTY_JSON_BODY",
      message: "Body cannot be empty",
    });
    expect(reply._status).toBe(400);
    expect(reply._body).toEqual({
      error: "Body cannot be empty",
      code: "FST_ERR_CTP_EMPTY_JSON_BODY",
    });
  });

  it("falls back to a generic 500 for anything else, and logs it", () => {
    const reply = mockReply();
    sendError(reply, new Error("something unexpected"));
    expect(reply._status).toBe(500);
    expect(reply._body).toEqual({ error: "Internal server error", code: "INTERNAL" });
    expect(reply.log.error).toHaveBeenCalled();
  });

  it("attaches orgId/userId/method/url to a 500's log line when a request is passed", () => {
    const reply = mockReply();
    const req = {
      auth: { sub: "user-1", orgId: "org-1" },
      method: "POST",
      url: "/v1/employees",
    } as unknown as FastifyRequest;
    sendError(reply, new Error("boom"), req);
    expect(reply.log.error).toHaveBeenCalledWith(
      expect.objectContaining({
        orgId: "org-1",
        userId: "user-1",
        method: "POST",
        url: "/v1/employees",
      }),
      "unhandled error",
    );
  });
});
