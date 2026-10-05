import { z } from "zod";

/** Flow 1 (docs/legacy-analysis/02-user-flows.md): admin + org in one step. */
export const RegisterOrgInput = z
  .object({
    fullName: z.string().min(1).max(200),
    email: z.string().email().toLowerCase(),
    password: z.string().min(8).max(100),
    orgName: z.string().min(2).max(255),
    orgSlug: z
      .string()
      .min(2)
      .max(100)
      .regex(/^[a-z0-9-]+$/, "Use lowercase letters, numbers, and hyphens"),
    phone: z
      .string()
      .regex(/^\+\d{6,15}$/, "E.164 format")
      .optional()
      .or(z.literal("")),
    currency: z.string().length(3).default("AED"),
    industry: z.string().max(100).optional(),
    planSlug: z.enum(["free", "pro"]),
  })
  .strict();

export type RegisterOrgInput = z.infer<typeof RegisterOrgInput>;

/**
 * Dual login (docs/legacy-analysis/05-roles-matrix.md §3): `identifier` is
 * either an email (org_admin / org_staff) or an employee code (org_viewer).
 * `secret` is either the account password or, for employee-code login, the
 * employee's date of birth (YYYY-MM-DD) used as the default credential.
 */
export const LoginInput = z
  .object({
    identifier: z.string().min(1).max(255),
    secret: z.string().min(1).max(100),
  })
  .strict();

export type LoginInput = z.infer<typeof LoginInput>;

export const AuthSession = z.object({
  userId: z.string().uuid(),
  orgId: z.string().uuid().nullable(),
  role: z.enum(["org_admin", "org_staff", "org_viewer"]).nullable(),
  employeeId: z.string().uuid().nullable(),
  isPlatformAdmin: z.boolean(),
  fullName: z.string().nullable(),
  email: z.string().email().nullable(),
});

export type AuthSession = z.infer<typeof AuthSession>;
