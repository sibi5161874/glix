import { z } from "zod";

export const ChangeTierInput = z
  .object({
    planId: z.string().uuid(),
  })
  .strict();

export type ChangeTierInput = z.infer<typeof ChangeTierInput>;

export const InvoiceFilter = z
  .object({
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().min(1).max(100).default(20),
  })
  .strict();

export type InvoiceFilter = z.infer<typeof InvoiceFilter>;
