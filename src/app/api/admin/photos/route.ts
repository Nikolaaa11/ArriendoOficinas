import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/infrastructure/auth/auth";
import { prisma } from "@/infrastructure/database/prisma-client";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const createSchema = z.object({
  officeId: z.string().min(1),
  url: z.string().url("URL inválida"),
  alt: z.string().max(200).optional(),
  caption: z.string().max(300).optional(),
});

const reorderSchema = z.object({
  ids: z.array(z.string().min(1)).min(1),
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
  const photos = await prisma.photo.findMany({ orderBy: { order: "asc" } });
  return NextResponse.json({ success: true, data: photos });
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
  const max = await prisma.photo.aggregate({
    where: { officeId: parsed.data.officeId },
    _max: { order: true },
  });
  const order = (max._max.order ?? -1) + 1;
  const created = await prisma.photo.create({
    data: {
      officeId: parsed.data.officeId,
      url: parsed.data.url,
      alt: parsed.data.alt ?? null,
      caption: parsed.data.caption ?? null,
      order,
    },
  });
  return NextResponse.json({ success: true, data: created });
}

export async function PATCH(req: Request) {
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
  const parsed = reorderSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      {
        success: false,
        error: { code: "VALIDATION", message: "Datos inválidos", details: parsed.error.flatten() },
      },
      { status: 400 },
    );
  }
  await prisma.$transaction(
    parsed.data.ids.map((id, i) =>
      prisma.photo.update({ where: { id }, data: { order: i } }),
    ),
  );
  return NextResponse.json({ success: true, data: { count: parsed.data.ids.length } });
}

export async function DELETE(req: Request) {
  if (!(await requireAdmin())) {
    return NextResponse.json(
      { success: false, error: { code: "FORBIDDEN", message: "Sin permisos" } },
      { status: 403 },
    );
  }
  const id = new URL(req.url).searchParams.get("id");
  if (!id) {
    return NextResponse.json(
      { success: false, error: { code: "VALIDATION", message: "id requerido" } },
      { status: 400 },
    );
  }
  await prisma.photo.delete({ where: { id } });
  return NextResponse.json({ success: true, data: { id } });
}
