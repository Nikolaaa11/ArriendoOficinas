import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/infrastructure/auth/auth";
import { prisma } from "@/infrastructure/database/prisma-client";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const patchSchema = z.object({
  status: z.enum(["PENDING", "CONFIRMED", "CANCELLED", "COMPLETED", "NO_SHOW"]).optional(),
  paymentStatus: z.enum(["PENDING", "PAID", "PARTIAL", "REFUNDED", "WAIVED"]).optional(),
  adminNotes: z.string().max(1000).optional(),
});

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  const role = (session?.user as { role?: string } | undefined)?.role;
  if (role !== "ADMIN" && role !== "SUPER_ADMIN") {
    return NextResponse.json(
      { success: false, error: { code: "FORBIDDEN", message: "Sin permisos" } },
      { status: 403 },
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
  const parsed = patchSchema.safeParse(body);
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
  const data: Record<string, unknown> = { ...parsed.data };
  if (parsed.data.status === "CONFIRMED") data.confirmedAt = new Date();
  if (parsed.data.status === "CANCELLED") data.cancelledAt = new Date();
  if (parsed.data.paymentStatus === "PAID") data.paidAt = new Date();

  const updated = await prisma.booking.update({ where: { id }, data });
  return NextResponse.json({ success: true, data: updated });
}
