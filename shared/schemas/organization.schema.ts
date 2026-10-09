import { z } from "zod";

export const OrganizationStatus = z.enum(["active", "suspended", "trial", "churned"]);

export const CreateOrganizationInput = z
  .object({
    name: z.string().min(2).max(255),
    slug: z
      .string()
      .min(2)
      .max(100)
      .regex(/^[a-z0-9-]+$/, "Use lowercase letters, numbers, and hyphens"),
    currency: z.string().length(3).default("AED"),
    phone: z
      .string()
      .regex(/^\+\d{6,15}$/, "E.164 format")
      .nullable()
      .optional(),
    industry: z.string().max(100).nullable().optional(),
    logoUrl: z.string().url().nullable().optional(),
    planId: z.string().uuid(),
  })
  .strict();

export type CreateOrganizationInput = z.infer<typeof CreateOrganizationInput>;

export const UpdateOrganizationInput = CreateOrganizationInput.partial()
  .extend({
    status: OrganizationStatus.optional(),
  })
  .strict();

export type UpdateOrganizationInput = z.infer<typeof UpdateOrganizationInput>;

export const UpdateOrgProfileInput = z
  .object({
    name: z.string().min(2).max(255).optional(),
    currency: z.string().length(3).optional(),
    phone: z
      .string()
      .regex(/^\+\d{6,15}$/, "E.164 format")
      .nullable()
      .optional(),
    industry: z.string().max(100).nullable().optional(),
    logoUrl: z.string().url().nullable().optional(),
  })
  .strict();

export type UpdateOrgProfileInput = z.infer<typeof UpdateOrgProfileInput>;
