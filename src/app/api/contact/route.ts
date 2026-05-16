import { NextResponse } from "next/server";
import { contactFormSchema } from "@/lib/validators";
import { notifyContact } from "@/modules/notification/notification.service";
import { getClientIp, rateLimit } from "@/lib/rate-limit";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const ip = getClientIp(req);
  const rl = rateLimit(`contact:${ip}`, { windowMs: 60_000, max: 5 });
  if (!rl.ok) {
    return NextResponse.json(
      {
        success: false,
        error: { code: "RATE_LIMIT", message: "Demasiadas solicitudes, intenta en un minuto." },
      },
      { status: 429, headers: { "Retry-After": String(Math.ceil(rl.resetMs / 1000)) } },
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

  const parsed = contactFormSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      {
        success: false,
        error: { code: "VALIDATION", message: "Datos inválidos", details: parsed.error.flatten() },
      },
      { status: 400 },
    );
  }

  try {
    await notifyContact(parsed.data);
    return NextResponse.json({ success: true, data: { sent: true } });
  } catch (e) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "EMAIL_FAILED",
          message: e instanceof Error ? e.message : "Error al enviar",
        },
      },
      { status: 500 },
    );
  }
}
