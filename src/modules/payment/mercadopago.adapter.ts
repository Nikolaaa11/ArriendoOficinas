// Adapter para Mercado Pago (Chile). SDK activo.
// Setear MERCADOPAGO_ACCESS_TOKEN en .env.local para activar. Sin token, opera en modo stub.

import { MercadoPagoConfig, Payment, Preference } from "mercadopago";

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
  initPoint: string;
  sandboxInitPoint?: string;
}

const accessToken = process.env.MERCADOPAGO_ACCESS_TOKEN;
const client = accessToken ? new MercadoPagoConfig({ accessToken }) : null;

export async function createPreference(input: CreatePreferenceInput): Promise<PaymentPreference> {
  if (!client) {
    console.warn("[mercadopago.adapter] MERCADOPAGO_ACCESS_TOKEN not set — returning stub preference");
    return {
      id: `stub-${input.bookingId}`,
      initPoint: `${input.successUrl}?stub=true`,
    };
  }
  const pref = await new Preference(client).create({
    body: {
      items: [
        {
          id: input.bookingId,
          title: input.description,
          quantity: 1,
          unit_price: input.amount,
          currency_id: "CLP",
        },
      ],
      payer: { email: input.payerEmail },
      external_reference: input.bookingCode,
      back_urls: {
        success: input.successUrl,
        failure: input.failureUrl,
        pending: input.pendingUrl,
      },
      auto_return: "approved",
      notification_url: `${new URL(input.successUrl).origin}/api/webhooks/payment`,
    },
  });
  return {
    id: pref.id ?? "",
    initPoint: pref.init_point ?? "",
    sandboxInitPoint: pref.sandbox_init_point,
  };
}

export interface WebhookOutcome {
  bookingCode: string;
  status: "PAID" | "PENDING" | "REJECTED";
  externalId: string;
  method?: string;
}

function mapStatus(s: string | undefined): WebhookOutcome["status"] {
  if (s === "approved") return "PAID";
  if (s === "rejected" || s === "cancelled" || s === "refunded") return "REJECTED";
  return "PENDING";
}

export async function fetchPaymentDetails(paymentId: string): Promise<WebhookOutcome | null> {
  if (!client) {
    console.warn("[mercadopago.adapter] no token — cannot fetch payment");
    return null;
  }
  try {
    const payment = await new Payment(client).get({ id: paymentId });
    return {
      bookingCode: payment.external_reference ?? "",
      status: mapStatus(payment.status ?? undefined),
      externalId: String(payment.id ?? paymentId),
      method: payment.payment_method_id ?? undefined,
    };
  } catch (e) {
    console.error("[mercadopago.adapter] fetchPaymentDetails error", e);
    return null;
  }
}
