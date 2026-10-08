import type { FastifyReply, FastifyRequest } from "fastify";
import { AppError } from "./errors";

export function sendSuccess<T>(reply: FastifyReply, data: T, statusCode = 200): FastifyReply {
  return reply.status(statusCode).send({ data });
}

/**
 * `req` is optional only so existing call sites (and tests) that don't have
 * one don't need updating — always pass it when one is available. There is
 * no external error-tracking service wired in (no Sentry DSN or equivalent
 * is configured anywhere in this project) — this is the whole observability
 * story for a 500 today: a structured pino log line an operator greps for.
 * If/when an APM is added, this is the one place a `captureException` call
 * belongs.
 */
export function sendError(reply: FastifyReply, err: unknown, req?: FastifyRequest): FastifyReply {
  if (err instanceof AppError) {
    return reply.status(err.statusCode).send({
      error: err.message,
      code: err.code,
      details: err.details,
    });
  }
  // Fastify's own request-parsing errors (bad JSON, oversized body, etc.)
  // carry a client-facing statusCode and FST_ERR_* code before our route
  // handlers ever run — report them as the 4xx they are, not a 500. Some
  // plugin-thrown errors (e.g. @fastify/rate-limit's 429) carry a statusCode
  // but no `code` at all — don't require one, just fall back to a generic
  // code when it's missing.
  if (isClientErrorWithStatus(err)) {
    const code = hasStringCode(err) ? err.code : "CLIENT_ERROR";
    return reply.status(err.statusCode).send({ error: err.message, code });
  }
  reply.log.error(
    {
      err,
      orgId: req?.auth?.orgId ?? null,
      userId: req?.auth?.sub ?? null,
      method: req?.method,
      url: req?.url,
    },
    "unhandled error",
  );
  return reply.status(500).send({ error: "Internal server error", code: "INTERNAL" });
}

function isClientErrorWithStatus(err: unknown): err is { statusCode: number; message: string } {
  return (
    typeof err === "object" &&
    err !== null &&
    "statusCode" in err &&
    typeof (err as { statusCode: unknown }).statusCode === "number" &&
    (err as { statusCode: number }).statusCode >= 400 &&
    (err as { statusCode: number }).statusCode < 500 &&
    "message" in err &&
    typeof (err as { message: unknown }).message === "string"
  );
}

function hasStringCode(err: object): err is { code: string } {
  return "code" in err && typeof (err as { code: unknown }).code === "string";
}
