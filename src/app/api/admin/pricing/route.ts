import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/infrastructure/auth/auth";
import { prisma } from "@/infrastructure/database/prisma-client";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const updateSchema = z.object({
  blockId: z.string().min(1),
  dayOfWeek: z.number().int().min(0).max(6),
  price: z.number().int().min(0).max(10_000_000),
});

async function requireAdmin() {
  const session = await auth();
  const role = (session?.user as { role?: string } | undefined)?.role;
  if (role !== "ADMIN" && role !== "SUPER_ADMIN") return null;
  return session;
}

export async function GET() {
  if (!(await requireAdmin())) {
    return NextResponse.json(
      { success: false, error: { code: "FORBIDDEN", message: "Sin permisos" } },
      { status: 403 },
    );
  }
  const blocks = await prisma.block.findMany({
    where: { isActive: true },
    include: { pricing: { where: { validTo: null } } },
    orderBy: { type: "asc" },
  });
  return NextResponse.json({ success: true, data: blocks });
}

export async function POST(req: Request) {
  if (!(await requireAdmin())) {
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
  const parsed = updateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      {
        success: false,
        error: { code: "VALIDATION", message: "Datos inválidos", details: parsed.error.flatten() },
      },
      { status: 400 },
    );
  }

  const { blockId, dayOfWeek, price } = parsed.data;

  // Close current active pricing
  await prisma.pricing.updateMany({
    where: { blockId, dayOfWeek, validTo: null },
    data: { validTo: new Date() },
  });
  // Create new
  const created = await prisma.pricing.create({
    data: { blockId, dayOfWeek, price, validFrom: new Date(), currency: "CLP" },
  });
  return NextResponse.json({ success: true, data: created });
}
