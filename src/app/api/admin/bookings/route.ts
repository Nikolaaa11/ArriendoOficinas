import { NextResponse } from "next/server";
import { auth } from "@/infrastructure/auth/auth";
import { prisma } from "@/infrastructure/database/prisma-client";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const session = await auth();
  const role = (session?.user as { role?: string } | undefined)?.role;
  if (role !== "ADMIN" && role !== "SUPER_ADMIN") {
    return NextResponse.json(
      { success: false, error: { code: "FORBIDDEN", message: "Sin permisos" } },
      { status: 403 },
    );
  }
  const url = new URL(req.url);
  const status = url.searchParams.get("status");
  const where: { status?: string } = {};
  if (status && status !== "ALL") where.status = status;
  const bookings = await prisma.booking.findMany({
    where,
    orderBy: { date: "desc" },
    include: { user: true, block: true, office: true },
    take: 200,
  });
  return NextResponse.json({ success: true, data: bookings });
}
