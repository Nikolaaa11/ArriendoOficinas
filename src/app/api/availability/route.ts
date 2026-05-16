import { NextResponse } from "next/server";
import { z } from "zod";
import { getAvailability } from "@/modules/availability/availability.service";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const querySchema = z.object({
  officeId: z.string().optional(),
  month: z.string().regex(/^\d{4}-\d{2}$/u, "month debe ser YYYY-MM"),
});

export async function GET(req: Request) {
  const url = new URL(req.url);
  const parsed = querySchema.safeParse({
    officeId: url.searchParams.get("officeId") ?? undefined,
    month: url.searchParams.get("month") ?? undefined,
  });
  if (!parsed.success) {
    return NextResponse.json(
      {
        success: false,
        error: { code: "VALIDATION", message: "Query inválido", details: parsed.error.flatten() },
      },
      { status: 400 },
    );
  }
  try {
    const data = await getAvailability(parsed.data.officeId, parsed.data.month);
    return NextResponse.json({ success: true, data });
  } catch (e) {
    return NextResponse.json(
      {
        success: false,
        error: { code: "INTERNAL", message: e instanceof Error ? e.message : "Error interno" },
      },
      { status: 500 },
    );
  }
}
