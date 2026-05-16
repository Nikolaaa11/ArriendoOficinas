import { NextResponse } from "next/server";
import { prisma } from "@/infrastructure/database/prisma-client";
import { notifyBookingReminder } from "@/modules/notification/notification.service";
import { formatDateLong } from "@/lib/dates";
import { formatCurrency } from "@/lib/utils";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// GET /api/cron/reminders
// Protected by CRON_SECRET (Vercel Cron sends it as Authorization: Bearer <secret>).
export async function GET(req: Request) {
  const expected = process.env.CRON_SECRET;
  if (expected) {
    const auth = req.headers.get("authorization") ?? "";
    if (auth !== `Bearer ${expected}`) {
      return NextResponse.json(
        { success: false, error: { code: "FORBIDDEN", message: "Bad cron secret" } },
        { status: 403 },
      );
    }
  }

  // Fetch all CONFIRMED bookings with date == tomorrow
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const start = new Date(tomorrow.getFullYear(), tomorrow.getMonth(), tomorrow.getDate());
  const end = new Date(tomorrow.getFullYear(), tomorrow.getMonth(), tomorrow.getDate(), 23, 59, 59);

  const bookings = await prisma.booking.findMany({
    where: {
      status: "CONFIRMED",
      date: { gte: start, lte: end },
    },
    include: { user: true, block: true, office: true },
  });

  await Promise.allSettled(
    bookings.map((b) =>
      notifyBookingReminder({
        code: b.code,
        userName: b.user.name,
        userEmail: b.user.email,
        date: formatDateLong(b.date),
        blockLabel: b.block.label,
        blockTime: `${b.block.startTime}–${b.block.endTime}`,
        officeName: b.office.name,
        totalPrice: b.totalPrice ? formatCurrency(b.totalPrice) : undefined,
      }),
    ),
  );

  return NextResponse.json({ success: true, data: { reminded: bookings.length } });
}
