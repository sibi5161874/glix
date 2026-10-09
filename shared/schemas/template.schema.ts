import { z } from "zod";

export const TemplateChannel = z.enum(["email", "whatsapp"]);

export const CreateTemplateInput = z
  .object({
    channel: TemplateChannel,
    key: z.string().min(2).max(100),
    subject: z.string().max(255).nullable().optional(),
    body: z.string().min(1).max(10_000),
    isActive: z.boolean().default(true),
  })
  .strict();

export type CreateTemplateInput = z.infer<typeof CreateTemplateInput>;

export const UpdateTemplateInput = z
  .object({
    subject: z.string().max(255).nullable().optional(),
    body: z.string().min(1).max(10_000).optional(),
    isActive: z.boolean().optional(),
  })
  .strict();

export type UpdateTemplateInput = z.infer<typeof UpdateTemplateInput>;

export const TemplateFilter = z
  .object({
    channel: TemplateChannel.optional(),
    search: z.string().optional(),
  })
  .strict();

export type TemplateFilter = z.infer<typeof TemplateFilter>;
