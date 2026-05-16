import { z } from "zod";

export const createBookingSchema = z.object({
  blockId: z.string().min(1, "blockId requerido"),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/u, "Fecha debe ser YYYY-MM-DD"),
  notes: z.string().max(500).optional(),
});
export type CreateBookingPayload = z.infer<typeof createBookingSchema>;

export const cancelBookingSchema = z.object({
  reason: z.string().min(3, "Motivo requerido").max(300),
});
export type CancelBookingPayload = z.infer<typeof cancelBookingSchema>;
