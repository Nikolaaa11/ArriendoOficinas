import { NextResponse } from "next/server";
import { auth } from "@/infrastructure/auth/auth";
import { createBookingSchema } from "@/modules/booking/booking.validation";
import { createBooking, getBookingById, getMyBookings } from "@/modules/booking/booking.service";
import { notifyBookingCreated } from "@/modules/notification/notification.service";
import { formatDateLong } from "@/lib/dates";
import { formatCurrency } from "@/lib/utils";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const session = await auth();
  const userId = (session?.user as { id?: string } | undefined)?.id;
  if (!userId) {
    return NextResponse.json(
      { success: false, error: { code: "UNAUTHORIZED", message: "Debes iniciar sesión" } },
      { status: 401 },
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { success: false, error: { code: "BAD_JSON", message: "Body inválido" } },
      { status: 400 },
    );
  }
  const parsed = createBookingSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      {
        success: false,
        error: { code: "VALIDATION", message: "Datos inválidos", details: parsed.error.flatten() },
      },
      { status: 400 },
    );
  }
  const [y, m, d] = parsed.data.date.split("-").map(Number);
  const date = new Date(Date.UTC(y, m - 1, d));
  const res = await createBooking({
    userId,
    blockId: parsed.data.blockId,
    date,
    notes: parsed.data.notes,
  });
  if (!res.ok) {
    return NextResponse.json({ success: false, error: res.error }, { status: 409 });
  }

  // Fire-and-forget notification
  try {
    const full = await getBookingById(res.value.id);
    if (full) {
      void notifyBookingCreated({
        code: full.code,
        userName: full.user.name,
        userEmail: full.user.email,
        date: formatDateLong(full.date),
        blockLabel: full.block.label,
        blockTime: `${full.block.startTime}–${full.block.endTime}`,
        officeName: full.office.name,
        totalPrice: full.totalPrice ? formatCurrency(full.totalPrice) : undefined,
        notes: full.notes ?? undefined,
      });
    }
  } catch {
    /* notifications are best-effort */
  }

  return NextResponse.json({ success: true, data: res.value });
}

export async function GET() {
  const session = await auth();
  const userId = (session?.user as { id?: string } | undefined)?.id;
  if (!userId) {
    return NextResponse.json(
      { success: false, error: { code: "UNAUTHORIZED", message: "Debes iniciar sesión" } },
      { status: 401 },
    );
  }
  const bookings = await getMyBookings(userId);
  return NextResponse.json({ success: true, data: bookings });
}
