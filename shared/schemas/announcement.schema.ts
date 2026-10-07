import { z } from "zod";

export const AnnouncementPriority = z.enum(["normal", "high", "urgent"]);

export const CreateAnnouncementInput = z
  .object({
    title: z.string().min(1).max(255),
    body: z.string().min(1).max(10_000),
    priority: AnnouncementPriority.default("normal"),
    publishAt: z.string().datetime().optional(),
    expiresAt: z.string().datetime().optional(),
    attachmentUrl: z.string().url().optional(),
  })
  .strict();

export type CreateAnnouncementInput = z.infer<typeof CreateAnnouncementInput>;

export const UpdateAnnouncementInput = CreateAnnouncementInput.partial().strict();

export type UpdateAnnouncementInput = z.infer<typeof UpdateAnnouncementInput>;

export const AnnouncementFilter = z
  .object({
    priority: AnnouncementPriority.optional(),
    search: z.string().optional(),
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().min(1).max(100).default(20),
  })
  .strict();

export type AnnouncementFilter = z.infer<typeof AnnouncementFilter>;
