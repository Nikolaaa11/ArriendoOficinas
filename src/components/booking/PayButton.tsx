"use client";

import { useState } from "react";
import { CreditCard } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";

export function PayButton({ bookingId, amount }: { bookingId: string; amount: number }) {
  const [loading, setLoading] = useState(false);

  async function startPayment() {
    setLoading(true);
    try {
      const res = await fetch("/api/payments/preference", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookingId }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json?.error?.message ?? "No se pudo iniciar el pago");
      }
      if (json.data?.initPoint) {
        window.location.href = json.data.initPoint;
      } else {
        toast.error("Mercado Pago aún no está configurado. Aviso al admin.");
      }
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Error iniciando pago");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Button onClick={startPayment} disabled={loading}>
      <CreditCard className="size-4" />
      {loading ? "Iniciando..." : `Pagar ${formatCurrency(amount)}`}
    </Button>
  );
}
