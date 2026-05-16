import { sendEmail } from "./email.adapter";
import {
  bookingCreatedToAdmin,
  bookingCreatedToTenant,
  bookingConfirmedToTenant,
  bookingReminder,
} from "./templates";

interface BookingNotificationInput {
  code: string;
  userName: string;
  userEmail: string;
  date: string;
  blockLabel: string;
  blockTime: string;
  officeName: string;
  totalPrice?: string;
  notes?: string;
}

const ADMIN_EMAIL = process.env.EMAIL_FROM ?? "admin@bloque.cl";

export async function notifyBookingCreated(input: BookingNotificationInput) {
  await Promise.allSettled([
    sendEmail({
      to: ADMIN_EMAIL,
      subject: `Nueva reserva ${input.code} — ${input.userName}`,
      html: bookingCreatedToAdmin(input),
    }),
    sendEmail({
      to: input.userEmail,
      subject: `Recibimos tu reserva ${input.code}`,
      html: bookingCreatedToTenant(input),
    }),
  ]);
}

export async function notifyBookingConfirmed(input: BookingNotificationInput) {
  await sendEmail({
    to: input.userEmail,
    subject: `Reserva ${input.code} confirmada ✓`,
    html: bookingConfirmedToTenant(input),
  });
}

export async function notifyBookingReminder(input: BookingNotificationInput) {
  await sendEmail({
    to: input.userEmail,
    subject: `Recordatorio: tu reserva ${input.code} es mañana`,
    html: bookingReminder(input),
  });
}

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
