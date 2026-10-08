import { resolve } from "path";
import { existsSync, unlinkSync } from "fs";
import type { FastifyInstance } from "fastify";
import type { UploadDocumentInput, UpdateDocumentInput, DocumentFilter } from "@app/shared/schemas";
import type { RequestContext } from "../plugins/db.plugin";
import { documentRepository, type DocumentRow } from "../repositories/document.repository";
import { documentTypeRepository } from "../repositories/document-type.repository";
import { employeeRepository } from "../repositories/employee.repository";
import { ForbiddenError, NotFoundError, ValidationError } from "../utils/errors";
import { assertWithinTierLimit } from "./tier-limit.service";

const BYTES_PER_MB = 1024 * 1024;

export const documentService = {
  async list(
    fastify: FastifyInstance,
    ctx: RequestContext,
    filter: DocumentFilter,
  ): Promise<{ items: DocumentRow[]; total: number; page: number; limit: number }> {
    const isViewer = ctx.role === "org_viewer";
    const selfEmployeeId = isViewer ? ctx.employeeId : undefined;

    return fastify.withTenant(ctx, (client) =>
      documentRepository.list(client, ctx.orgId, filter, selfEmployeeId),
    );
  },

  async findById(fastify: FastifyInstance, ctx: RequestContext, id: string): Promise<DocumentRow> {
    return fastify.withTenant(ctx, async (client) => {
      const doc = await documentRepository.findById(client, id);
      if (!doc || doc.orgId !== ctx.orgId) throw new NotFoundError("Document");

      if (ctx.role === "org_viewer" && doc.employeeId !== ctx.employeeId) {
        throw new ForbiddenError("Cannot view other employees' documents");
      }

      return doc;
    });
  },

  async create(
    fastify: FastifyInstance,
    ctx: RequestContext,
    input: UploadDocumentInput,
  ): Promise<DocumentRow> {
    return fastify.withTenant(ctx, async (client) => {
      // Validate employee belongs to org
      const employee = await employeeRepository.findById(client, input.employeeId);
      if (!employee || employee.orgId !== ctx.orgId) {
        throw new ValidationError("Employee not found in organization");
      }

      // Validate document type belongs to org
      const docType = await documentTypeRepository.findById(client, input.documentTypeId);
      if (!docType || docType.orgId !== ctx.orgId) {
        throw new ValidationError("Document type not found in organization");
      }

      if (docType.requiresExpiry && !input.expiryDate) {
        throw new ValidationError(`Document type '${docType.name}' requires an expiry date`);
      }

      // Tier storage limit (RULES.md §9) — was never enforced here; a lower
      // tier's maxStorageMb (shared/config/tiers.config.ts) had no backing
      // check anywhere in the app.
      const { rows: storageRows } = await client.query(
        "select coalesce(sum(file_size), 0)::bigint as total_bytes from public.attachments where org_id = $1",
        [ctx.orgId],
      );
      const currentMb = Number(storageRows[0]?.["total_bytes"] ?? 0) / BYTES_PER_MB;
      const newFileMb = input.fileSize / BYTES_PER_MB;
      await assertWithinTierLimit(client, ctx.orgId, "storageMb", currentMb, newFileMb, "Storage");

      // Also create record in attachments table
      await client.query(
        `insert into public.attachments (
           org_id, owner_type, owner_id, file_path, file_size, mime_type, uploaded_by
         ) values ($1, $2, $3, $4, $5, $6, $7)`,
        [
          ctx.orgId,
          "document",
          input.employeeId,
          input.filePath,
          input.fileSize,
          input.mimeType,
          ctx.userId,
        ],
      );

      return await documentRepository.create(client, ctx.orgId, ctx.userId, input);
    });
  },

  async update(
    fastify: FastifyInstance,
    ctx: RequestContext,
    id: string,
    input: UpdateDocumentInput,
  ): Promise<DocumentRow> {
    return fastify.withTenant(ctx, async (client) => {
      const existing = await documentRepository.findById(client, id);
      if (!existing || existing.orgId !== ctx.orgId) throw new NotFoundError("Document");

      const docType = await documentTypeRepository.findById(client, existing.documentTypeId);
      if (docType?.requiresExpiry && input.expiryDate === null) {
        throw new ValidationError(`Document type '${docType.name}' requires an expiry date`);
      }

      return (await documentRepository.update(client, id, input))!;
    });
  },

  async remove(fastify: FastifyInstance, ctx: RequestContext, id: string): Promise<void> {
    await fastify.withTenant(ctx, async (client) => {
      const existing = await documentRepository.findById(client, id);
      if (!existing || existing.orgId !== ctx.orgId) throw new NotFoundError("Document");

      await documentRepository.remove(client, id);

      // Clean up file if on local filesystem
      try {
        const fullPath = resolve(process.cwd(), existing.filePath);
        if (existsSync(fullPath)) {
          unlinkSync(fullPath);
        }
      } catch {
        // Silently continue if file removal fails
      }
    });
  },

  async getSummary(fastify: FastifyInstance, ctx: RequestContext) {
    const isViewer = ctx.role === "org_viewer";
    const selfEmployeeId = isViewer ? ctx.employeeId : undefined;

    return fastify.withTenant(ctx, (client) =>
      documentRepository.getSummary(client, ctx.orgId, selfEmployeeId),
    );
  },

  async getFileForDownload(
    fastify: FastifyInstance,
    ctx: RequestContext,
    id: string,
  ): Promise<{ absolutePath: string; mimeType: string; filename: string }> {
    const doc = await this.findById(fastify, ctx, id);
    const absolutePath = resolve(process.cwd(), doc.filePath);

    if (!existsSync(absolutePath)) {
      throw new NotFoundError("File not found on storage");
    }

    const ext = doc.filePath.split(".").pop() || "bin";
    const safeDocName = (doc.documentTypeName || "document")
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "-");
    const safeEmpCode = (doc.employeeCode || "emp").toLowerCase();
    const filename = `${safeEmpCode}-${safeDocName}.${ext}`;

    return {
      absolutePath,
      mimeType: doc.mimeType,
      filename,
    };
  },
};
