import { z } from "zod";

export const LeaveStatus = z.enum(["pending", "approved", "rejected", "cancelled"]);

export const CreateLeaveRequestInput = z
  .object({
    employeeId: z.string().uuid(),
    leaveTypeId: z.string().uuid(),
    startDate: z.string().date(),
    endDate: z.string().date(),
    reason: z.string().max(1000).optional(),
    attachmentUrl: z.string().url().optional(),
  })
  .strict()
  .refine((d) => new Date(d.endDate) >= new Date(d.startDate), {
    message: "End date must be on or after start date",
    path: ["endDate"],
  });

export type CreateLeaveRequestInput = z.infer<typeof CreateLeaveRequestInput>;

export const ApproveLeaveInput = z
  .object({
    requestId: z.string().uuid(),
  })
  .strict();

export const RejectLeaveInput = z
  .object({
    requestId: z.string().uuid(),
    rejectionReason: z.string().min(3).max(500),
  })
  .strict();

export const LeaveRequestFilter = z
  .object({
    status: LeaveStatus.optional(),
    employeeId: z.string().uuid().optional(),
    leaveTypeId: z.string().uuid().optional(),
    fromDate: z.string().date().optional(),
    toDate: z.string().date().optional(),
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().min(1).max(100).default(20),
  })
  .strict();

export type LeaveRequestFilter = z.infer<typeof LeaveRequestFilter>;
