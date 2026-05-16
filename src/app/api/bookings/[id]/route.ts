import { NextResponse } from "next/server";
import { auth } from "@/infrastructure/auth/auth";
import { getBookingById } from "@/modules/booking/booking.service";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  const userId = (session?.user as { id?: string } | undefined)?.id;
  const role = (session?.user as { role?: string } | undefined)?.role;
  if (!userId) {
    return NextResponse.json(
      { success: false, error: { code: "UNAUTHORIZED", message: "Sin sesión" } },
      { status: 401 },
    );
  }
  const { id } = await params;
  const booking = await getBookingById(id);
  if (!booking) {
    return NextResponse.json(
      { success: false, error: { code: "NOT_FOUND", message: "Reserva no encontrada" } },
      { status: 404 },
    );
  }
  if (booking.userId !== userId && role !== "ADMIN" && role !== "SUPER_ADMIN") {
    return NextResponse.json(
      { success: false, error: { code: "FORBIDDEN", message: "Sin permisos" } },
      { status: 403 },
    );
  }
  return NextResponse.json({ success: true, data: booking });
}
