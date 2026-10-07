import { z } from "zod";

export const CreateDocumentTypeInput = z
  .object({
    name: z.string().min(2).max(100),
    code: z
      .string()
      .min(2)
      .max(50)
      .regex(/^[a-z0-9_]+$/, "Code must be lowercase alphanumeric with underscores"),
    requiresExpiry: z.boolean().default(true),
    alertDays: z.array(z.number().int().positive()).default([90, 60, 30]),
    retentionDays: z.number().int().positive().nullable().optional(),
    isActive: z.boolean().default(true),
  })
  .strict();

export type CreateDocumentTypeInput = z.infer<typeof CreateDocumentTypeInput>;

export const UpdateDocumentTypeInput = CreateDocumentTypeInput.partial().strict();
export type UpdateDocumentTypeInput = z.infer<typeof UpdateDocumentTypeInput>;

export const UploadDocumentInput = z
  .object({
    employeeId: z.string().uuid(),
    documentTypeId: z.string().uuid(),
    documentNumber: z.string().max(100).optional(),
    issueDate: z.string().date().optional(),
    expiryDate: z.string().date().optional(),
    filePath: z.string().min(1),
    fileSize: z
      .number()
      .int()
      .positive()
      .max(50 * 1024 * 1024),
    mimeType: z.enum(["application/pdf", "image/jpeg", "image/png", "image/webp"]),
  })
  .strict();

export type UploadDocumentInput = z.infer<typeof UploadDocumentInput>;

export const UpdateDocumentInput = z
  .object({
    documentNumber: z.string().max(100).optional(),
    issueDate: z.string().date().optional(),
    expiryDate: z.string().date().optional(),
  })
  .strict();

export type UpdateDocumentInput = z.infer<typeof UpdateDocumentInput>;

/** Signed upload URL request — issued by backend before direct PUT. */
export const RequestUploadUrlInput = z
  .object({
    employeeId: z.string().uuid(),
    documentTypeId: z.string().uuid(),
    filename: z.string().min(1).max(255),
    mimeType: z.enum(["application/pdf", "image/jpeg", "image/png", "image/webp"]),
    fileSize: z
      .number()
      .int()
      .positive()
      .max(50 * 1024 * 1024),
  })
  .strict();

export type RequestUploadUrlInput = z.infer<typeof RequestUploadUrlInput>;

export const DocumentFilter = z
  .object({
    employeeId: z.string().uuid().optional(),
    documentTypeId: z.string().uuid().optional(),
    expiryWithinDays: z.coerce.number().int().positive().optional(),
    status: z.enum(["active", "expiring", "expired"]).optional(),
    search: z.string().optional(),
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().min(1).max(100).default(20),
  })
  .strict();

export type DocumentFilter = z.infer<typeof DocumentFilter>;
