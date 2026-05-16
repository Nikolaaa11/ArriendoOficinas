"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Ban } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function CancelBookingButton({ bookingId }: { bookingId: string }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function cancel() {
    if (reason.trim().length < 3) {
      toast.error("Cuéntanos el motivo (mínimo 3 caracteres)");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch(`/api/bookings/${bookingId}/cancel`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json?.error?.message ?? "Error");
      toast.success("Reserva cancelada");
      setOpen(false);
      router.refresh();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Error al cancelar");
    } finally {
      setSubmitting(false);
    }
  }

  if (!open) {
    return (
      <Button variant="outline" size="sm" onClick={() => setOpen(true)}>
        <Ban className="size-4" /> Cancelar reserva
      </Button>
    );
  }

  return (
    <div className="space-y-3 rounded-lg border border-[var(--border)] p-4">
      <div className="space-y-1.5">
        <Label htmlFor="cancel-reason">Motivo</Label>
        <Input
          id="cancel-reason"
          placeholder="Cambio de planes, error..."
          value={reason}
          onChange={(e) => setReason(e.target.value)}
        />
      </div>
      <div className="flex gap-2">
        <Button
          variant="destructive"
          size="sm"
          onClick={cancel}
          disabled={submitting}
        >
          {submitting ? "Cancelando..." : "Confirmar cancelación"}
        </Button>
        <Button variant="ghost" size="sm" onClick={() => setOpen(false)}>
          No, mantener
        </Button>
      </div>
    </div>
  );
}
