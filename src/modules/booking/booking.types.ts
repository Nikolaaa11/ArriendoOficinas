import type { BookingStatus, PaymentStatus } from "@/lib/constants";

export interface BookingEntity {
  id: string;
  code: string;
  date: Date;
  status: BookingStatus;
  userId: string;
  blockId: string;
  officeId: string;
  totalPrice: number | null;
  paymentStatus: PaymentStatus;
  notes: string | null;
  adminNotes: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateBookingInput {
  userId: string;
  officeId?: string;
  blockId: string;
  date: Date;
  notes?: string;
}

export interface BookingFilters {
  status?: BookingStatus;
  from?: Date;
  to?: Date;
}

export type Result<T, E> = { ok: true; value: T } | { ok: false; error: E };
