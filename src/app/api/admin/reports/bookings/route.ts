import { auth } from "@/infrastructure/auth/auth";
import { prisma } from "@/infrastructure/database/prisma-client";
import { BOOKING_STATUS_LABEL, PAYMENT_STATUS_LABEL } from "@/lib/constants";
import { formatShortDate } from "@/lib/dates";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function csvCell(v: string | number | null | undefined) {
  const s = v == null ? "" : String(v);
  const escaped = s.replace(/"/g, '""');
  return `"${escaped}"`;
}

export async function GET() {
  const session = await auth();
  const role = (session?.user as { role?: string } | undefined)?.role;
  if (role !== "ADMIN" && role !== "SUPER_ADMIN") {
    return new Response("Forbidden", { status: 403 });
  }

  const bookings = await prisma.booking.findMany({
    orderBy: { date: "desc" },
    include: { user: true, block: true, office: true },
  });

  const header = [
    "Codigo",
    "Fecha",
    "Bloque",
    "Inicio",
    "Fin",
    "Oficina",
    "Arrendatario",
    "Email",
    "Telefono",
    "Estado",
    "Pago",
    "Monto",
    "Notas",
    "Creada",
  ].map(csvCell).join(",");

  const rows = bookings.map((b) =>
    [
      b.code,
      formatShortDate(b.date),
      b.block.label,
      b.block.startTime,
      b.block.endTime,
      b.office.name,
      b.user.name,
      b.user.email,
      b.user.phone ?? "",
      BOOKING_STATUS_LABEL[b.status as keyof typeof BOOKING_STATUS_LABEL] ?? b.status,
      PAYMENT_STATUS_LABEL[b.paymentStatus as keyof typeof PAYMENT_STATUS_LABEL] ?? b.paymentStatus,
      b.totalPrice ?? "",
      b.notes ?? "",
      formatShortDate(b.createdAt),
    ].map(csvCell).join(","),
  );

  // BOM for Excel UTF-8 friendliness
  const csv = "﻿" + [header, ...rows].join("\n");

  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="bloque-reservas-${new Date()
        .toISOString()
        .slice(0, 10)}.csv"`,
    },
  });
}
