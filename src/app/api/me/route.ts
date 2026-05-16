import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/infrastructure/auth/auth";
import { prisma } from "@/infrastructure/database/prisma-client";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const updateSchema = z.object({
  name: z.string().min(2).max(120),
  phone: z.string().regex(/^\+?[0-9\s-]{8,15}$/u, "Teléfono inválido").optional().or(z.literal("")),
  profession: z.string().max(120).optional().or(z.literal("")),
  company: z.string().max(120).optional().or(z.literal("")),
  rut: z.string().max(15).optional().or(z.literal("")),
});

export async function GET() {
  const session = await auth();
  const userId = (session?.user as { id?: string } | undefined)?.id;
  if (!userId) {
    return NextResponse.json(
      { success: false, error: { code: "UNAUTHORIZED", message: "Sin sesión" } },
      { status: 401 },
    );
  }
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      profession: true,
      company: true,
      rut: true,
    },
  });
  return NextResponse.json({ success: true, data: user });
}

export async function PATCH(req: Request) {
  const session = await auth();
  const userId = (session?.user as { id?: string } | undefined)?.id;
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
  const updated = await prisma.user.update({
    where: { id: userId },
    data: {
      name: parsed.data.name,
      phone: parsed.data.phone || null,
      profession: parsed.data.profession || null,
      company: parsed.data.company || null,
      rut: parsed.data.rut || null,
    },
    select: { id: true, name: true, email: true, phone: true, profession: true, company: true, rut: true },
  });
  return NextResponse.json({ success: true, data: updated });
}
