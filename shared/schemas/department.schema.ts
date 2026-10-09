import { z } from "zod";

export const CreateDepartmentInput = z
  .object({
    name: z.string().min(2).max(100),
    code: z.string().min(1).max(20).optional(),
    parentId: z.string().uuid().nullable().optional(),
  })
  .strict();

export type CreateDepartmentInput = z.infer<typeof CreateDepartmentInput>;

export const UpdateDepartmentInput = CreateDepartmentInput.partial().strict();

export type UpdateDepartmentInput = z.infer<typeof UpdateDepartmentInput>;

export const DepartmentFilter = z
  .object({
    search: z.string().optional(),
    parentId: z.string().uuid().optional(),
  })
  .strict();

export type DepartmentFilter = z.infer<typeof DepartmentFilter>;
