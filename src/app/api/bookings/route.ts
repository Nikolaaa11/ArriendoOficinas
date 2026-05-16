import { NextResponse } from "next/server";
import { auth } from "@/infrastructure/auth/auth";
import { createBookingSchema } from "@/modules/booking/booking.validation";
import { createBooking, getMyBookings } from "@/modules/booking/booking.service";

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
