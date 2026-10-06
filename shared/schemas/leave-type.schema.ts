import { z } from "zod";

export const CreateLeaveTypeInput = z
  .object({
    name: z.string().min(1).max(100),
    code: z
      .string()
      .min(2)
      .max(30)
      .regex(/^[a-z0-9_]+$/, "Lowercase letters, numbers, underscores only"),
    daysPerYear: z.number().min(0).max(365),
    isPaid: z.boolean().default(true),
    requiresApproval: z.boolean().default(true),
  })
  .strict();

export type CreateLeaveTypeInput = z.infer<typeof CreateLeaveTypeInput>;

export const UpdateLeaveTypeInput = CreateLeaveTypeInput.partial()
  .extend({ isActive: z.boolean().optional() })
  .strict();

export type UpdateLeaveTypeInput = z.infer<typeof UpdateLeaveTypeInput>;

export const LeaveType = CreateLeaveTypeInput.extend({
  id: z.string().uuid(),
  orgId: z.string().uuid(),
  isActive: z.boolean(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export type LeaveType = z.infer<typeof LeaveType>;
