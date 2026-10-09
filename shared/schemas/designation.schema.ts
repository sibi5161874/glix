import { z } from "zod";

export const CreateDesignationInput = z
  .object({
    title: z.string().min(2).max(100),
    level: z.number().int().min(1).max(20).optional(),
  })
  .strict();

export type CreateDesignationInput = z.infer<typeof CreateDesignationInput>;

export const UpdateDesignationInput = CreateDesignationInput.partial().strict();

export type UpdateDesignationInput = z.infer<typeof UpdateDesignationInput>;

export const DesignationFilter = z
  .object({
    search: z.string().optional(),
    level: z.coerce.number().int().optional(),
  })
  .strict();

export type DesignationFilter = z.infer<typeof DesignationFilter>;
