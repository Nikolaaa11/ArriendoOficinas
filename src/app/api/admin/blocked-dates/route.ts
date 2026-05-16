import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/infrastructure/auth/auth";
import { prisma } from "@/infrastructure/database/prisma-client";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const createSchema = z.object({
  officeId: z.string().min(1),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/u, "Fecha YYYY-MM-DD"),
  reason: z.string().max(200).optional(),
});

const deleteSchema = z.object({ id: z.string().min(1) });

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
  const blocked = await prisma.blockedDate.findMany({ orderBy: { date: "asc" } });
  return NextResponse.json({ success: true, data: blocked });
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
  const parsed = createSchema.safeParse(body);
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
  try {
    const created = await prisma.blockedDate.create({
      data: { officeId: parsed.data.officeId, date, reason: parsed.data.reason ?? null },
    });
    return NextResponse.json({ success: true, data: created });
  } catch {
    return NextResponse.json(
      { success: false, error: { code: "DUPLICATE", message: "Esa fecha ya está bloqueada" } },
      { status: 409 },
    );
  }
}

export async function DELETE(req: Request) {
  if (!(await requireAdmin())) {
    return NextResponse.json(
      { success: false, error: { code: "FORBIDDEN", message: "Sin permisos" } },
      { status: 403 },
    );
  }
  const url = new URL(req.url);
  const idQuery = url.searchParams.get("id");
  let id = idQuery ?? "";
  if (!id) {
    try {
      const body = await req.json();
      const parsed = deleteSchema.safeParse(body);
      if (parsed.success) id = parsed.data.id;
    } catch {
      /* ignore */
    }
  }
  if (!id) {
    return NextResponse.json(
      { success: false, error: { code: "VALIDATION", message: "id requerido" } },
      { status: 400 },
    );
  }
  await prisma.blockedDate.delete({ where: { id } });
  return NextResponse.json({ success: true, data: { id } });
}
