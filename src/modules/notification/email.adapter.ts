import { Resend } from "resend";

const apiKey = process.env.RESEND_API_KEY;
const from = process.env.EMAIL_FROM ?? "reservas@bloque.cl";

const client = apiKey ? new Resend(apiKey) : null;

export async function sendEmail(input: {
  to: string;
  subject: string;
  html: string;
  text?: string;
}) {
  if (!client) {
    console.warn("[email.adapter] RESEND_API_KEY not set — logging email instead");
    console.info(`[email] to=${input.to} subject=${input.subject}`);
    return { id: "dev-no-send", ok: true } as const;
  }
  const res = await client.emails.send({
    from,
    to: input.to,
    subject: input.subject,
    html: input.html,
    text: input.text,
  });
  return { id: res.data?.id ?? "", ok: !res.error } as const;
}
