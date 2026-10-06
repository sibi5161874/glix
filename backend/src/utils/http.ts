import type { FastifyReply } from "fastify";
import { AppError } from "./errors";

export function sendSuccess<T>(reply: FastifyReply, data: T, statusCode = 200): FastifyReply {
  return reply.status(statusCode).send({ data });
}

export function sendError(reply: FastifyReply, err: unknown): FastifyReply {
  if (err instanceof AppError) {
    return reply.status(err.statusCode).send({
      error: err.message,
      code: err.code,
      details: err.details,
    });
  }
  // Fastify's own request-parsing errors (bad JSON, oversized body, etc.)
  // carry a client-facing statusCode and FST_ERR_* code before our route
  // handlers ever run — report them as the 4xx they are, not a 500.
  if (isFastifyClientError(err)) {
    return reply.status(err.statusCode).send({ error: err.message, code: err.code });
  }
  reply.log.error(err);
  return reply.status(500).send({ error: "Internal server error", code: "INTERNAL" });
}

function isFastifyClientError(
  err: unknown,
): err is { statusCode: number; code: string; message: string } {
  return (
    typeof err === "object" &&
    err !== null &&
    "statusCode" in err &&
    typeof (err as { statusCode: unknown }).statusCode === "number" &&
    (err as { statusCode: number }).statusCode >= 400 &&
    (err as { statusCode: number }).statusCode < 500 &&
    "code" in err
  );
}
