function escapeHtml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

interface BookingEmailParams {
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

export function bookingCreatedToAdmin(p: BookingEmailParams) {
  return `
    <div style="font-family: system-ui, sans-serif; max-width: 560px; margin: 0 auto; color: #1a1a1f;">
      <h2 style="color: #E8734A; margin-bottom: 8px;">Nueva reserva — ${escapeHtml(p.code)}</h2>
      <p style="color: #6b6860;">Ha llegado una nueva reserva pendiente de aprobación.</p>
      <table style="width:100%; border-collapse: collapse; margin-top: 16px; font-size: 14px;">
        <tbody>
          <tr><td style="padding: 8px 0; color: #6b6860;">Arrendatario</td><td><strong>${escapeHtml(p.userName)}</strong> · ${escapeHtml(p.userEmail)}</td></tr>
          <tr><td style="padding: 8px 0; color: #6b6860;">Fecha</td><td>${escapeHtml(p.date)}</td></tr>
          <tr><td style="padding: 8px 0; color: #6b6860;">Bloque</td><td>${escapeHtml(p.blockLabel)} (${escapeHtml(p.blockTime)})</td></tr>
          <tr><td style="padding: 8px 0; color: #6b6860;">Oficina</td><td>${escapeHtml(p.officeName)}</td></tr>
          ${p.totalPrice ? `<tr><td style="padding: 8px 0; color: #6b6860;">Monto</td><td><strong>${escapeHtml(p.totalPrice)}</strong></td></tr>` : ""}
          ${p.notes ? `<tr><td style="padding: 8px 0; color: #6b6860;">Notas</td><td>${escapeHtml(p.notes)}</td></tr>` : ""}
        </tbody>
      </table>
      <p style="margin-top: 24px;"><a href="${process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"}/dashboard/reservas" style="background:#E8734A; color:white; padding: 10px 16px; border-radius: 8px; text-decoration: none;">Revisar en el panel</a></p>
    </div>
  `;
}

export function bookingCreatedToTenant(p: BookingEmailParams) {
  return `
    <div style="font-family: system-ui, sans-serif; max-width: 560px; margin: 0 auto; color: #1a1a1f;">
      <h2 style="color: #E8734A;">¡Recibimos tu reserva!</h2>
      <p>Hola ${escapeHtml(p.userName)},</p>
      <p>Tu reserva quedó <strong>pendiente de aprobación</strong>. Te avisaremos por email cuando se confirme.</p>
      <table style="width:100%; border-collapse: collapse; margin-top: 16px; font-size: 14px;">
        <tbody>
          <tr><td style="padding: 8px 0; color: #6b6860;">Código</td><td style="font-family: monospace;"><strong>${escapeHtml(p.code)}</strong></td></tr>
          <tr><td style="padding: 8px 0; color: #6b6860;">Fecha</td><td>${escapeHtml(p.date)}</td></tr>
          <tr><td style="padding: 8px 0; color: #6b6860;">Bloque</td><td>${escapeHtml(p.blockLabel)} (${escapeHtml(p.blockTime)})</td></tr>
          <tr><td style="padding: 8px 0; color: #6b6860;">Oficina</td><td>${escapeHtml(p.officeName)}</td></tr>
          ${p.totalPrice ? `<tr><td style="padding: 8px 0; color: #6b6860;">Monto</td><td>${escapeHtml(p.totalPrice)}</td></tr>` : ""}
        </tbody>
      </table>
      <p style="margin-top: 24px; color: #6b6860; font-size: 13px;">— Equipo BLOQUE</p>
    </div>
  `;
}

export function bookingConfirmedToTenant(p: BookingEmailParams) {
  return `
    <div style="font-family: system-ui, sans-serif; max-width: 560px; margin: 0 auto; color: #1a1a1f;">
      <h2 style="color: #10B981;">Tu reserva está confirmada ✓</h2>
      <p>Hola ${escapeHtml(p.userName)},</p>
      <p>Te esperamos el <strong>${escapeHtml(p.date)}</strong> en el bloque <strong>${escapeHtml(p.blockLabel)}</strong> (${escapeHtml(p.blockTime)}).</p>
      <p style="font-family: monospace; font-size: 18px; margin-top: 16px;">Código: <strong>${escapeHtml(p.code)}</strong></p>
      <p style="margin-top: 24px; color: #6b6860; font-size: 13px;">— Equipo BLOQUE</p>
    </div>
  `;
}

export function bookingReminder(p: BookingEmailParams) {
  return `
    <div style="font-family: system-ui, sans-serif; max-width: 560px; margin: 0 auto; color: #1a1a1f;">
      <h2 style="color: #E8734A;">Recordatorio: tu reserva es mañana</h2>
      <p>Hola ${escapeHtml(p.userName)},</p>
      <p>Solo un recordatorio: mañana tienes el bloque <strong>${escapeHtml(p.blockLabel)}</strong> (${escapeHtml(p.blockTime)}) en ${escapeHtml(p.officeName)}.</p>
      <p style="font-family: monospace;">Código: <strong>${escapeHtml(p.code)}</strong></p>
    </div>
  `;
}
