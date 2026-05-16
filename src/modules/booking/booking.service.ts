import { prisma } from "@/infrastructure/database/prisma-client";
import { isBlockAvailable } from "@/modules/availability/availability.service";
import { generateBookingCode } from "@/lib/utils";
import type { Result } from "./booking.types";
import type { BookingError } from "./booking.errors";
import {
  blockNotAvailable,
  bookingNotFound,
  forbidden,
  invalidDate,
  invalidStatusTransition,
} from "./booking.errors";

interface CreateInput {
  userId: string;
  officeId?: string;
  blockId: string;
  date: Date;
  notes?: string;
}

function startOfDayUTC(d: Date) {
  return new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
}

export async function createBooking(
  input: CreateInput,
): Promise<Result<{ id: string; code: string }, BookingError>> {
  const today = startOfDayUTC(new Date());
  const date = startOfDayUTC(input.date);
  if (date < today) return { ok: false, error: invalidDate() };

  const block = await prisma.block.findUnique({ where: { id: input.blockId } });
  if (!block || !block.isActive) {
    return { ok: false, error: blockNotAvailable("Bloque inexistente o inactivo") };
  }

  const officeId = input.officeId ?? block.officeId;

  const available = await isBlockAvailable(officeId, input.blockId, date);
  if (!available) return { ok: false, error: blockNotAvailable() };

  const dow = date.getUTCDay();
  const pricing = await prisma.pricing.findFirst({
    where: { blockId: input.blockId, dayOfWeek: dow, validTo: null },
    orderBy: { validFrom: "desc" },
  });

  const code = generateBookingCode();

  try {
    const booking = await prisma.booking.create({
      data: {
        code,
        date,
        status: "PENDING",
        userId: input.userId,
        blockId: input.blockId,
        officeId,
        totalPrice: pricing?.price ?? null,
        paymentStatus: "PENDING",
        notes: input.notes ?? null,
      },
      select: { id: true, code: true },
    });
    return { ok: true, value: booking };
  } catch (e) {
    // Unique constraint (date, blockId, officeId) — someone else booked it concurrently
    return { ok: false, error: blockNotAvailable("Otro usuario reservó este bloque") };
  }
}

export async function getBookingById(id: string) {
  return prisma.booking.findUnique({
    where: { id },
    include: { user: true, block: true, office: true },
  });
}

export async function getMyBookings(userId: string) {
  return prisma.booking.findMany({
    where: { userId },
    orderBy: { date: "desc" },
    include: { block: true, office: true },
  });
}

export async function cancelBooking(
  id: string,
  reason: string,
  userId: string,
  isAdmin = false,
): Promise<Result<{ id: string }, BookingError>> {
  const booking = await prisma.booking.findUnique({ where: { id } });
  if (!booking) return { ok: false, error: bookingNotFound() };
  if (!isAdmin && booking.userId !== userId) return { ok: false, error: forbidden() };
  if (booking.status === "CANCELLED" || booking.status === "COMPLETED") {
    return { ok: false, error: invalidStatusTransition() };
  }

  await prisma.booking.update({
    where: { id },
    data: {
      status: "CANCELLED",
      cancelReason: reason,
      cancelledAt: new Date(),
    },
  });
  return { ok: true, value: { id } };
}

export async function confirmBooking(
  id: string,
): Promise<Result<{ id: string }, BookingError>> {
  const booking = await prisma.booking.findUnique({ where: { id } });
  if (!booking) return { ok: false, error: bookingNotFound() };
  if (booking.status !== "PENDING") {
    return { ok: false, error: invalidStatusTransition() };
  }
  await prisma.booking.update({
    where: { id },
    data: { status: "CONFIRMED", confirmedAt: new Date() },
  });
  return { ok: true, value: { id } };
}
