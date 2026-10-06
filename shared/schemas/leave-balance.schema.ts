import { z } from "zod";

/** Sets `allocated`/`carriedOver` directly — `used` is only ever changed by the
 * `on_leave_approved` DB trigger (db/migrations/011_leave.sql), never by this input. */
export const AdjustLeaveBalanceInput = z
  .object({
    employeeId: z.string().uuid(),
    leaveTypeId: z.string().uuid(),
    year: z.coerce.number().int().min(2000).max(2100),
    allocated: z.number().min(0).max(365),
    carriedOver: z.number().min(0).max(365).default(0),
  })
  .strict();

export type AdjustLeaveBalanceInput = z.infer<typeof AdjustLeaveBalanceInput>;

export const LeaveBalanceFilter = z
  .object({
    employeeId: z.string().uuid().optional(),
    year: z.coerce.number().int().min(2000).max(2100).optional(),
  })
  .strict();

export type LeaveBalanceFilter = z.infer<typeof LeaveBalanceFilter>;

export const LeaveBalance = z.object({
  id: z.string().uuid(),
  orgId: z.string().uuid(),
  employeeId: z.string().uuid(),
  leaveTypeId: z.string().uuid(),
  year: z.number(),
  allocated: z.number(),
  used: z.number(),
  carriedOver: z.number(),
});

export type LeaveBalance = z.infer<typeof LeaveBalance>;
