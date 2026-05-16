import { NextResponse } from "next/server";
import { auth } from "@/infrastructure/auth/auth";
import { prisma } from "@/infrastructure/database/prisma-client";
import { createPreference } from "@/modules/payment/mercadopago.adapter";
import { siteConfig } from "@/config/site";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const session = await auth();
  const userId = (session?.user as { id?: string } | undefined)?.id;
  if (!userId) {
    return NextResponse.json(
      { success: false, error: { code: "UNAUTHORIZED", message: "Sin sesión" } },
      { status: 401 },
    );
  }
  const { bookingId } = (await req.json().catch(() => ({}))) as { bookingId?: string };
  if (!bookingId) {
    return NextResponse.json(
      { success: false, error: { code: "VALIDATION", message: "bookingId requerido" } },
      { status: 400 },
    );
  }
  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    include: { user: true, block: true, office: true },
  });
  if (!booking || (booking.userId !== userId)) {
    return NextResponse.json(
      { success: false, error: { code: "NOT_FOUND", message: "Reserva no encontrada" } },
      { status: 404 },
    );
  }
  if (!booking.totalPrice) {
    return NextResponse.json(
      { success: false, error: { code: "NO_PRICE", message: "Reserva sin precio" } },
      { status: 400 },
    );
  }
  try {
    const pref = await createPreference({
      bookingId: booking.id,
      bookingCode: booking.code,
      description: `BLOQUE · ${booking.block.label} · ${booking.office.name}`,
      amount: booking.totalPrice,
      payerEmail: booking.user.email,
      successUrl: `${siteConfig.url}/mi-cuenta/reservas/${booking.id}?pago=success`,
      failureUrl: `${siteConfig.url}/mi-cuenta/reservas/${booking.id}?pago=failure`,
      pendingUrl: `${siteConfig.url}/mi-cuenta/reservas/${booking.id}?pago=pending`,
    });
    await prisma.booking.update({
      where: { id: booking.id },
      data: { paymentRef: pref.id },
    });
    return NextResponse.json({ success: true, data: pref });
  } catch (e) {
    return NextResponse.json(
      {
        success: false,
        error: { code: "PAYMENT_INIT", message: e instanceof Error ? e.message : "Error" },
      },
      { status: 500 },
    );
  }
}
