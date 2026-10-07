import type { FastifyInstance } from "fastify";
import type { CreateDocumentTypeInput, UpdateDocumentTypeInput } from "@app/shared/schemas";
import type { RequestContext } from "../plugins/db.plugin";
import {
  documentTypeRepository,
  type DocumentTypeRow,
} from "../repositories/document-type.repository";
import { ConflictError, NotFoundError } from "../utils/errors";

export const documentTypeService = {
  async list(fastify: FastifyInstance, ctx: RequestContext): Promise<DocumentTypeRow[]> {
    return fastify.withTenant(ctx, (client) => documentTypeRepository.list(client, ctx.orgId));
  },

  async create(
    fastify: FastifyInstance,
    ctx: RequestContext,
    input: CreateDocumentTypeInput,
  ): Promise<DocumentTypeRow> {
    return fastify.withTenant(ctx, async (client) => {
      try {
        return await documentTypeRepository.create(client, ctx.orgId, input);
      } catch (err) {
        throw mapDuplicateError(err);
      }
    });
  },

  async update(
    fastify: FastifyInstance,
    ctx: RequestContext,
    id: string,
    input: UpdateDocumentTypeInput,
  ): Promise<DocumentTypeRow> {
    return fastify.withTenant(ctx, async (client) => {
      const existing = await documentTypeRepository.findById(client, id);
      if (!existing || existing.orgId !== ctx.orgId) throw new NotFoundError("Document type");
      try {
        return (await documentTypeRepository.update(client, id, input))!;
      } catch (err) {
        throw mapDuplicateError(err);
      }
    });
  },

  async remove(fastify: FastifyInstance, ctx: RequestContext, id: string): Promise<void> {
    await fastify.withTenant(ctx, async (client) => {
      const existing = await documentTypeRepository.findById(client, id);
      if (!existing || existing.orgId !== ctx.orgId) throw new NotFoundError("Document type");
      await documentTypeRepository.remove(client, id);
    });
  },
};

function mapDuplicateError(err: unknown): Error {
  const message = err instanceof Error ? err.message : String(err);
  if (message.includes("duplicate key")) {
    return new ConflictError("Document type code already in use");
  }
  return err instanceof Error ? err : new Error(message);
}
