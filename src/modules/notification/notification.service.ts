import { sendEmail } from "./email.adapter";

export async function notifyContact(input: {
  name: string;
  email: string;
  phone?: string;
  message: string;
}) {
  const adminEmail = "admin@bloque.cl";
  const html = `
    <h2>Nuevo contacto desde la web</h2>
    <p><strong>Nombre:</strong> ${escapeHtml(input.name)}</p>
    <p><strong>Email:</strong> ${escapeHtml(input.email)}</p>
    ${input.phone ? `<p><strong>Teléfono:</strong> ${escapeHtml(input.phone)}</p>` : ""}
    <p><strong>Mensaje:</strong></p>
    <p>${escapeHtml(input.message).replace(/\n/g, "<br/>")}</p>
  `;
  return sendEmail({
    to: adminEmail,
    subject: `Nuevo contacto: ${input.name}`,
    html,
    text: `${input.name} (${input.email}) escribió: ${input.message}`,
  });
}

function escapeHtml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
