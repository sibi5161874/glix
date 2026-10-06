import { z } from "zod";

export const CreateHolidayInput = z
  .object({
    name: z.string().min(1).max(150),
    date: z.string().date(),
    isRecurring: z.boolean().default(false),
  })
  .strict();

export type CreateHolidayInput = z.infer<typeof CreateHolidayInput>;

export const UpdateHolidayInput = CreateHolidayInput.partial().strict();
export type UpdateHolidayInput = z.infer<typeof UpdateHolidayInput>;

export const HolidayFilter = z
  .object({
    year: z.coerce.number().int().min(2000).max(2100).optional(),
  })
  .strict();

export type HolidayFilter = z.infer<typeof HolidayFilter>;

export const Holiday = CreateHolidayInput.extend({
  id: z.string().uuid(),
  orgId: z.string().uuid(),
  createdAt: z.string().datetime(),
});

export type Holiday = z.infer<typeof Holiday>;
