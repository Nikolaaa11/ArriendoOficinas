import { NextResponse } from "next/server";
import { prisma } from "@/infrastructure/database/prisma-client";
import { fetchPaymentDetails } from "@/modules/payment/mercadopago.adapter";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Mercado Pago will POST notifications here. The payload contains a payment id;
// we fetch the payment to verify status and update the booking accordingly.
export async function POST(req: Request) {
  let payload: { type?: string; data?: { id?: string } } = {};
  try {
    payload = await req.json();
  } catch {
    /* ignore */
  }

  if (payload.type !== "payment" || !payload.data?.id) {
    return NextResponse.json({ success: true, ignored: true });
  }

  const details = await fetchPaymentDetails(String(payload.data.id));
  if (!details) {
    return NextResponse.json({ success: true, queued: true });
  }

  const booking = await prisma.booking.findUnique({ where: { code: details.bookingCode } });
  if (!booking) {
    return NextResponse.json({ success: true, missing: true });
  }

  await prisma.booking.update({
    where: { id: booking.id },
    data: {
      paymentStatus: details.status === "PAID" ? "PAID" : details.status === "REJECTED" ? "PENDING" : "PENDING",
      paymentMethod: details.method ?? null,
      paymentRef: details.externalId,
      paidAt: details.status === "PAID" ? new Date() : null,
    },
  });

  return NextResponse.json({ success: true });
}
