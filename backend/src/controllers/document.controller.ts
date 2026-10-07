import { existsSync, mkdirSync, createWriteStream, createReadStream } from "fs";
import { resolve, join } from "path";
import { pipeline } from "stream/promises";
import type { FastifyRequest, FastifyReply } from "fastify";
import { DocumentFilter, UpdateDocumentInput, UploadDocumentInput } from "@app/shared/schemas";
import { documentService } from "../services/document.service";
import { sendSuccess } from "../utils/http";
import { ValidationError } from "../utils/errors";
import { toRequestContext } from "../utils/request-context";

const UPLOAD_DIR = process.env["UPLOAD_DIR"] || "./uploads";

export const documentController = {
  async list(req: FastifyRequest, reply: FastifyReply): Promise<FastifyReply> {
    const parsed = DocumentFilter.safeParse(req.query);
    if (!parsed.success) throw new ValidationError("Invalid filter", parsed.error.flatten());
    const ctx = toRequestContext(req.auth!);
    const data = await documentService.list(req.server, ctx, parsed.data);
    return sendSuccess(reply, data);
  },

  async summary(req: FastifyRequest, reply: FastifyReply): Promise<FastifyReply> {
    const ctx = toRequestContext(req.auth!);
    const data = await documentService.getSummary(req.server, ctx);
    return sendSuccess(reply, data);
  },

  async findById(req: FastifyRequest, reply: FastifyReply): Promise<FastifyReply> {
    const { id } = req.params as { id: string };
    const ctx = toRequestContext(req.auth!);
    const data = await documentService.findById(req.server, ctx, id);
    return sendSuccess(reply, data);
  },

  async upload(req: FastifyRequest, reply: FastifyReply): Promise<FastifyReply> {
    const ctx = toRequestContext(req.auth!);

    if (req.isMultipart()) {
      const parts = req.parts();
      let fileData: { path: string; size: number; mimeType: string } | null = null;
      const fields: Record<string, string> = {};

      for await (const part of parts) {
        if (part.type === "file") {
          const orgFolder = join(UPLOAD_DIR, ctx.orgId);
          if (!existsSync(orgFolder)) {
            mkdirSync(orgFolder, { recursive: true });
          }

          const safeFilename = `${Date.now()}-${part.filename.replace(/[^a-zA-Z0-9._-]/g, "_")}`;
          const relPath = join(UPLOAD_DIR, ctx.orgId, safeFilename);
          const fullPath = resolve(process.cwd(), relPath);

          let bytesWritten = 0;
          part.file.on("data", (chunk: Buffer) => {
            bytesWritten += chunk.length;
          });

          await pipeline(part.file, createWriteStream(fullPath));

          fileData = {
            path: relPath,
            size: bytesWritten,
            mimeType: part.mimetype,
          };
        } else {
          fields[part.fieldname] = part.value as string;
        }
      }

      if (!fileData) {
        throw new ValidationError("No file attached to upload request");
      }

      const rawInput = {
        employeeId: fields["employeeId"],
        documentTypeId: fields["documentTypeId"],
        documentNumber: fields["documentNumber"] || undefined,
        issueDate: fields["issueDate"] || undefined,
        expiryDate: fields["expiryDate"] || undefined,
        filePath: fileData.path,
        fileSize: fileData.size,
        mimeType: fileData.mimeType as
          "application/pdf" | "image/jpeg" | "image/png" | "image/webp",
      };

      const parsed = UploadDocumentInput.safeParse(rawInput);
      if (!parsed.success) {
        throw new ValidationError("Invalid upload input", parsed.error.flatten());
      }

      const doc = await documentService.create(req.server, ctx, parsed.data);
      return sendSuccess(reply, doc, 201);
    }

    // JSON body fallback
    const parsed = UploadDocumentInput.safeParse(req.body);
    if (!parsed.success) throw new ValidationError("Invalid upload input", parsed.error.flatten());
    const doc = await documentService.create(req.server, ctx, parsed.data);
    return sendSuccess(reply, doc, 201);
  },

  async update(req: FastifyRequest, reply: FastifyReply): Promise<FastifyReply> {
    const { id } = req.params as { id: string };
    const parsed = UpdateDocumentInput.safeParse(req.body);
    if (!parsed.success) throw new ValidationError("Invalid input", parsed.error.flatten());
    const ctx = toRequestContext(req.auth!);
    const doc = await documentService.update(req.server, ctx, id, parsed.data);
    return sendSuccess(reply, doc);
  },

  async remove(req: FastifyRequest, reply: FastifyReply): Promise<FastifyReply> {
    const { id } = req.params as { id: string };
    const ctx = toRequestContext(req.auth!);
    await documentService.remove(req.server, ctx, id);
    return sendSuccess(reply, { success: true });
  },

  async download(req: FastifyRequest, reply: FastifyReply): Promise<void> {
    const { id } = req.params as { id: string };
    const ctx = toRequestContext(req.auth!);
    const { absolutePath, mimeType, filename } = await documentService.getFileForDownload(
      req.server,
      ctx,
      id,
    );

    reply.header("Content-Type", mimeType);
    reply.header("Content-Disposition", `attachment; filename="${filename}"`);
    const stream = createReadStream(absolutePath);
    return reply.send(stream);
  },
};
