import { z } from "zod";

export const CreatePlatformOrgInput = z
  .object({
    name: z.string().min(2).max(100),
    slug: z
      .string()
      .min(2)
      .max(50)
      .regex(/^[a-z0-9-]+$/, "Slug must be lowercase alphanumeric with hyphens"),
    currency: z.string().min(3).max(3).default("AED"),
    planId: z.string().uuid(),
  })
  .strict();

export type CreatePlatformOrgInput = z.infer<typeof CreatePlatformOrgInput>;

export const UpdateOrgStatusInput = z
  .object({
    isActive: z.boolean(),
  })
  .strict();

export type UpdateOrgStatusInput = z.infer<typeof UpdateOrgStatusInput>;

export const UpdatePlanInput = z
  .object({
    name: z.string().min(2).max(100).optional(),
    maxEmployees: z.number().int().min(0).optional(),
    maxStorageMb: z.number().int().min(0).optional(),
    priceAed: z.number().min(0).optional(),
    priceUsd: z.number().min(0).optional(),
    priceSar: z.number().min(0).optional(),
    features: z.record(z.boolean()).optional(),
    isActive: z.boolean().optional(),
  })
  .strict();

export type UpdatePlanInput = z.infer<typeof UpdatePlanInput>;

export const PlatformOrgFilter = z
  .object({
    search: z.string().optional(),
    planSlug: z.string().optional(),
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().min(1).max(100).default(20),
  })
  .strict();

export type PlatformOrgFilter = z.infer<typeof PlatformOrgFilter>;

export const PlatformTeamInput = z
  .object({
    email: z.string().email(),
    fullName: z.string().min(2).max(100),
    role: z.enum(["owner", "admin", "support"]),
  })
  .strict();

export type PlatformTeamInput = z.infer<typeof PlatformTeamInput>;

export const UpdatePlatformSettingInput = z
  .object({
    value: z.record(z.unknown()),
  })
  .strict();

export type UpdatePlatformSettingInput = z.infer<typeof UpdatePlatformSettingInput>;

export const CreateLeadInput = z
  .object({
    name: z.string().min(2).max(100),
    email: z.string().email(),
    phone: z.string().max(30).optional().nullable(),
    subject: z.string().max(200).optional().nullable(),
    message: z.string().min(5).max(3000),
  })
  .strict();

export type CreateLeadInput = z.infer<typeof CreateLeadInput>;

export const UpdateLeadStatusInput = z
  .object({
    status: z.enum(["new", "contacted", "qualified", "closed"]).optional(),
    notes: z.string().max(2000).optional().nullable(),
  })
  .strict();

export type UpdateLeadStatusInput = z.infer<typeof UpdateLeadStatusInput>;
