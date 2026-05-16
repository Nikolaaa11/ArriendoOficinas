import { NextResponse } from "next/server";
import { auth } from "@/infrastructure/auth/auth";
import { cancelBookingSchema } from "@/modules/booking/booking.validation";
import { cancelBooking } from "@/modules/booking/booking.service";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  const userId = (session?.user as { id?: string } | undefined)?.id;
  const role = (session?.user as { role?: string } | undefined)?.role;
  if (!userId) {
    return NextResponse.json(
      { success: false, error: { code: "UNAUTHORIZED", message: "Sin sesión" } },
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
  const parsed = cancelBookingSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      {
        success: false,
        error: { code: "VALIDATION", message: "Datos inválidos", details: parsed.error.flatten() },
      },
      { status: 400 },
    );
  }
  const { id } = await params;
  const isAdmin = role === "ADMIN" || role === "SUPER_ADMIN";
  const res = await cancelBooking(id, parsed.data.reason, userId, isAdmin);
  if (!res.ok) {
    return NextResponse.json({ success: false, error: res.error }, { status: 409 });
  }
  return NextResponse.json({ success: true, data: res.value });
}
