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

export const RecordLoanPaymentInput = z
  .object({
    loanId: z.string().uuid(),
    amount: z.number().positive(),
    paymentDate: z.string().date(),
    note: z.string().max(255).optional(),
  })
  .strict();

export type RecordLoanPaymentInput = z.infer<typeof RecordLoanPaymentInput>;
