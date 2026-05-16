// Adapter para Mercado Pago (Chile). Implementación stub — completar con SDK
// `mercadopago` cuando el equipo tenga las credenciales reales.
//
// Pasos para activar:
//   1. npm install mercadopago
//   2. setear MERCADOPAGO_ACCESS_TOKEN en .env.local
//   3. reemplazar el cuerpo de createPreference/handleWebhook con las llamadas reales.

interface CreatePreferenceInput {
  bookingId: string;
  bookingCode: string;
  description: string;
  amount: number; // CLP
  payerEmail: string;
  successUrl: string;
  failureUrl: string;
  pendingUrl: string;
}

export interface PaymentPreference {
  id: string;
  initPoint: string; // URL para iniciar el pago
  sandboxInitPoint?: string;
}

const accessToken = process.env.MERCADOPAGO_ACCESS_TOKEN;

export async function createPreference(input: CreatePreferenceInput): Promise<PaymentPreference> {
  if (!accessToken) {
    console.warn("[mercadopago.adapter] MERCADOPAGO_ACCESS_TOKEN not set — returning stub preference");
    return {
      id: `stub-${input.bookingId}`,
      initPoint: `${input.successUrl}?stub=true`,
    };
  }

  // Real implementation — paste here when SDK is installed:
  //
  // import { MercadoPagoConfig, Preference } from "mercadopago";
  // const client = new MercadoPagoConfig({ accessToken });
  // const pref = await new Preference(client).create({
  //   body: {
  //     items: [{ id: input.bookingId, title: input.description, quantity: 1, unit_price: input.amount, currency_id: "CLP" }],
  //     payer: { email: input.payerEmail },
  //     external_reference: input.bookingCode,
  //     back_urls: { success: input.successUrl, failure: input.failureUrl, pending: input.pendingUrl },
  //     auto_return: "approved",
  //   },
  // });
  // return { id: pref.id!, initPoint: pref.init_point!, sandboxInitPoint: pref.sandbox_init_point };

  throw new Error("Mercado Pago real implementation pending — install `mercadopago` SDK first");
}

export interface WebhookPayload {
  type: string;
  data: { id: string };
}

export interface WebhookOutcome {
  bookingCode: string;
  status: "PAID" | "PENDING" | "REJECTED";
  externalId: string;
  method?: string;
}

export async function fetchPaymentDetails(paymentId: string): Promise<WebhookOutcome | null> {
  if (!accessToken) {
    console.warn("[mercadopago.adapter] no token — cannot fetch payment");
    return null;
  }
  // Real: const res = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, { headers: { Authorization: `Bearer ${accessToken}` } });
  // const json = await res.json();
  // return { bookingCode: json.external_reference, status: mapStatus(json.status), externalId: paymentId, method: json.payment_method_id };
  return null;
}
