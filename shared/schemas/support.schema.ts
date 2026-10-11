import { z } from "zod";

export const TicketCategory = z.enum(["billing", "technical", "hr_feature", "bug"]);
export const TicketPriority = z.enum(["low", "medium", "high", "urgent"]);
export const TicketStatus = z.enum(["open", "in_progress", "resolved", "closed"]);

export const CreateTicketInput = z
  .object({
    subject: z.string().min(3).max(255),
    body: z.string().min(1).max(5000),
    category: TicketCategory,
    priority: TicketPriority.default("medium"),
  })
  .strict();

export type CreateTicketInput = z.infer<typeof CreateTicketInput>;

export const UpdateTicketInput = z
  .object({
    status: TicketStatus.optional(),
    priority: TicketPriority.optional(),
    assignedTo: z.string().uuid().nullable().optional(),
  })
  .strict();

export type UpdateTicketInput = z.infer<typeof UpdateTicketInput>;

export const TicketFilter = z
  .object({
    status: TicketStatus.optional(),
    category: TicketCategory.optional(),
    search: z.string().optional(),
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().min(1).max(100).default(20),
  })
  .strict();

export type TicketFilter = z.infer<typeof TicketFilter>;
