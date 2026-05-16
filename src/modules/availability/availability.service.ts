import { prisma } from "@/infrastructure/database/prisma-client";
import type { DayAvailability, DayState } from "./availability.types";

function pad(n: number) {
  return String(n).padStart(2, "0");
}

function isoDay(d: Date) {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

export async function getAvailability(officeId: string | undefined, month: string) {
  const [yStr, mStr] = month.split("-");
  const y = Number(yStr);
  const m = Number(mStr); // 1..12
  if (!Number.isFinite(y) || !Number.isFinite(m)) {
    throw new Error("Invalid month");
  }
  const first = new Date(y, m - 1, 1);
  const last = new Date(y, m, 0);

  const office = officeId
    ? await prisma.office.findUnique({ where: { id: officeId } })
    : await prisma.office.findFirst({ orderBy: { createdAt: "asc" } });
  if (!office) return [];

  const officeKey = office.id;
  const [bookings, blocked, blocks] = await Promise.all([
    prisma.booking.findMany({
      where: {
        officeId: officeKey,
        date: { gte: first, lte: last },
        status: { in: ["PENDING", "CONFIRMED"] },
      },
      include: { block: true },
    }),
    prisma.blockedDate.findMany({
      where: { officeId: officeKey, date: { gte: first, lte: last } },
    }),
    prisma.block.findMany({
      where: { officeId: officeKey, isActive: true },
    }),
  ]);

  const amBlockId = blocks.find((b) => b.type === "AM")?.id;
  const pmBlockId = blocks.find((b) => b.type === "PM")?.id;
  const blockedSet = new Set(blocked.map((b) => isoDay(b.date)));

  const result: DayAvailability[] = [];
  for (let day = 1; day <= last.getDate(); day++) {
    const date = new Date(y, m - 1, day);
    const key = isoDay(date);
    const dow = date.getDay();
    const isSunday = dow === 0;

    if (blockedSet.has(key) || isSunday) {
      result.push({
        date: key,
        am: { available: false, pending: false },
        pm: { available: false, pending: false },
        state: "CLOSED",
      });
      continue;
    }

    const dayBookings = bookings.filter((b) => isoDay(b.date) === key);
    const am = {
      booked: dayBookings.some((b) => b.blockId === amBlockId && b.status === "CONFIRMED"),
      pending: dayBookings.some((b) => b.blockId === amBlockId && b.status === "PENDING"),
    };
    const pm = {
      booked: dayBookings.some((b) => b.blockId === pmBlockId && b.status === "CONFIRMED"),
      pending: dayBookings.some((b) => b.blockId === pmBlockId && b.status === "PENDING"),
    };

    const amAvail = !am.booked && !am.pending;
    const pmAvail = !pm.booked && !pm.pending;

    let state: DayState = "AVAILABLE";
    if (am.booked && pm.booked) state = "FULL";
    else if (am.booked || pm.booked || am.pending || pm.pending) state = "PARTIAL";
    else state = "AVAILABLE";

    result.push({
      date: key,
      am: { available: amAvail, pending: am.pending },
      pm: { available: pmAvail, pending: pm.pending },
      state,
    });
  }

  return result;
}

export async function isBlockAvailable(officeId: string, blockId: string, date: Date) {
  const blocked = await prisma.blockedDate.findFirst({ where: { officeId, date } });
  if (blocked) return false;
  const existing = await prisma.booking.findFirst({
    where: { officeId, blockId, date, status: { in: ["PENDING", "CONFIRMED"] } },
  });
  return !existing;
}
