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
  reply.log.error(err);
  return reply.status(500).send({ error: "Internal server error", code: "INTERNAL" });
}
