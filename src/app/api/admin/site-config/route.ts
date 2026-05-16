import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/infrastructure/auth/auth";
import { getLandingTexts, setLandingTexts } from "@/modules/site-config/site-config.service";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const updateSchema = z.object({
  heroTitle: z.string().min(5).max(120).optional(),
  heroSubtitle: z.string().min(10).max(400).optional(),
  benefitsTitle: z.string().min(5).max(160).optional(),
  contactTitle: z.string().min(5).max(120).optional(),
  contactDescription: z.string().min(10).max(400).optional(),
});

async function requireAdmin() {
  const session = await auth();
  const role = (session?.user as { role?: string } | undefined)?.role;
  if (role !== "ADMIN" && role !== "SUPER_ADMIN") return false;
  return true;
}

export async function GET() {
  if (!(await requireAdmin())) {
    return NextResponse.json(
      { success: false, error: { code: "FORBIDDEN", message: "Sin permisos" } },
      { status: 403 },
    );
  }
  const texts = await getLandingTexts();
  return NextResponse.json({ success: true, data: texts });
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
  const updated = await setLandingTexts(parsed.data);
  return NextResponse.json({ success: true, data: updated });
}
