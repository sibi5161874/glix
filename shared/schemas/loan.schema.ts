import { z } from "zod";

export const LoanStatus = z.enum(["pending", "active", "paid_off", "rejected"]);

export const CreateLoanInput = z
  .object({
    employeeId: z.string().uuid(),
    principalAmount: z.number().positive().max(1_000_000),
    monthlyInstallment: z.number().positive().max(100_000),
    startMonth: z.string().date(),
    termMonths: z.number().int().positive().max(120),
    reason: z.string().max(1000).optional(),
  })
  .strict();

export type CreateLoanInput = z.infer<typeof CreateLoanInput>;

export const ApproveLoanInput = z
  .object({
    loanId: z.string().uuid(),
  })
  .strict();

export type ApproveLoanInput = z.infer<typeof ApproveLoanInput>;

export const RejectLoanInput = z
  .object({
    loanId: z.string().uuid(),
    reason: z.string().max(500).optional(),
  })
  .strict();

export type RejectLoanInput = z.infer<typeof RejectLoanInput>;

export const RecordLoanPaymentInput = z
  .object({
    amount: z.number().positive(),
    paymentDate: z.string().date().optional(),
    note: z.string().max(255).optional(),
  })
  .strict();

export type RecordLoanPaymentInput = z.infer<typeof RecordLoanPaymentInput>;

export const LoanFilter = z
  .object({
    employeeId: z.string().uuid().optional(),
    status: LoanStatus.optional(),
    search: z.string().optional(),
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().min(1).max(100).default(20),
  })
  .strict();

export type LoanFilter = z.infer<typeof LoanFilter>;
