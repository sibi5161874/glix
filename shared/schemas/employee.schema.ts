import { z } from "zod";

export const EmployeeStatus = z.enum(["active", "probation", "on_leave", "terminated"]);

export const EmploymentType = z.enum(["full_time", "part_time", "contract"]);

export const Gender = z.enum(["male", "female", "other"]);

export const MaritalStatus = z.enum(["single", "married", "divorced", "widowed"]);

/** Create employee — org context comes from JWT, not body. */
export const CreateEmployeeInput = z
  .object({
    employeeCode: z
      .string()
      .min(2)
      .max(50)
      .regex(/^[A-Z0-9-]+$/, "Use uppercase letters, numbers, and hyphens"),
    firstName: z.string().min(1).max(100),
    lastName: z.string().min(1).max(100),
    email: z.string().email().toLowerCase(),
    phone: z
      .string()
      .regex(/^\+\d{6,15}$/, "E.164 format")
      .optional(),
    dob: z.string().date().optional(),
    gender: Gender.optional(),
    nationality: z.string().max(100).optional(),
    maritalStatus: MaritalStatus.optional(),
    departmentId: z.string().uuid().optional(),
    designationId: z.string().uuid().optional(),
    reportingManagerId: z.string().uuid().optional(),
    joiningDate: z.string().date(),
    employmentType: EmploymentType.default("full_time"),
    basicSalary: z.number().min(0).max(9_999_999),
    bankAccount: z.string().max(50).optional(),
    iban: z.string().max(50).optional(),
  })
  .strict();

export type CreateEmployeeInput = z.infer<typeof CreateEmployeeInput>;

export const UpdateEmployeeInput = CreateEmployeeInput.partial()
  .extend({
    status: EmployeeStatus.optional(),
  })
  .strict();

export type UpdateEmployeeInput = z.infer<typeof UpdateEmployeeInput>;

export const EmployeeFilter = z
  .object({
    search: z.string().optional(),
    departmentId: z.string().uuid().optional(),
    designationId: z.string().uuid().optional(),
    status: EmployeeStatus.optional(),
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().min(1).max(100).default(20),
    sort: z
      .enum(["employee_code", "first_name", "joining_date", "created_at"])
      .default("created_at"),
    order: z.enum(["asc", "desc"]).default("desc"),
  })
  .strict();

export type EmployeeFilter = z.infer<typeof EmployeeFilter>;

export const Employee = CreateEmployeeInput.extend({
  id: z.string().uuid(),
  orgId: z.string().uuid(),
  userId: z.string().uuid().nullable(),
  status: EmployeeStatus,
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export type Employee = z.infer<typeof Employee>;
