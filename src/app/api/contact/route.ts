import { NextResponse } from "next/server";
import { contactFormSchema } from "@/lib/validators";
import { notifyContact } from "@/modules/notification/notification.service";

export const runtime = "nodejs";

export async function POST(req: Request) {
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
