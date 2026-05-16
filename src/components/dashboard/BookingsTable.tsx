"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Check, X, MoreHorizontal, DollarSign } from "lucide-react";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BOOKING_STATUS_LABEL, PAYMENT_STATUS_LABEL } from "@/lib/constants";
import { formatShortDate } from "@/lib/dates";
import { formatCurrency } from "@/lib/utils";

interface Row {
  id: string;
  code: string;
  date: string | Date;
  status: string;
  paymentStatus: string;
  totalPrice: number | null;
  user: { name: string; email: string };
  block: { label: string; startTime: string; endTime: string };
}

const STATUS_FILTERS = [
  { value: "ALL", label: "Todas" },
  { value: "PENDING", label: "Pendientes" },
  { value: "CONFIRMED", label: "Confirmadas" },
  { value: "CANCELLED", label: "Canceladas" },
  { value: "COMPLETED", label: "Completadas" },
] as const;

const statusVariant: Record<string, "default" | "warning" | "success" | "danger" | "outline"> = {
  PENDING: "warning",
  CONFIRMED: "success",
  CANCELLED: "danger",
  COMPLETED: "outline",
  NO_SHOW: "danger",
};

export function BookingsTable({ initialBookings }: { initialBookings: Row[] }) {
  const router = useRouter();
  const [filter, setFilter] = useState<(typeof STATUS_FILTERS)[number]["value"]>("ALL");
  const [bookings, setBookings] = useState<Row[]>(initialBookings);
  const [isPending, startTransition] = useTransition();

  async function refresh(value: string) {
    setFilter(value as typeof filter);
    const res = await fetch(`/api/admin/bookings?status=${value}`);
    const json = await res.json();
    if (json.success) setBookings(json.data);
  }

  async function patchBooking(id: string, body: Record<string, string>) {
    const res = await fetch(`/api/admin/bookings/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const json = await res.json();
    if (!res.ok || !json.success) {
      toast.error(json?.error?.message ?? "Error al actualizar");
      return;
    }
    toast.success("Reserva actualizada");
    startTransition(() => router.refresh());
    refresh(filter);
  }

  return (
    <Card className="p-0 overflow-hidden">
      <div className="flex flex-wrap items-center gap-2 border-b border-[var(--border)] p-4">
        {STATUS_FILTERS.map((s) => (
          <Button
            key={s.value}
            variant={filter === s.value ? "default" : "outline"}
            size="sm"
            onClick={() => refresh(s.value)}
          >
            {s.label}
          </Button>
        ))}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-background-surface text-left">
            <tr>
              <th className="px-4 py-3 font-display font-semibold">Código</th>
              <th className="px-4 py-3 font-display font-semibold">Arrendatario</th>
              <th className="px-4 py-3 font-display font-semibold">Fecha</th>
              <th className="px-4 py-3 font-display font-semibold">Bloque</th>
              <th className="px-4 py-3 font-display font-semibold">Estado</th>
              <th className="px-4 py-3 font-display font-semibold">Pago</th>
              <th className="px-4 py-3 font-display font-semibold text-right">Monto</th>
              <th className="px-4 py-3 font-display font-semibold">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {bookings.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-4 py-12 text-center text-foreground-secondary">
                  Sin reservas en este filtro.
                </td>
              </tr>
            ) : (
              bookings.map((b) => (
                <tr key={b.id} className="border-t border-[var(--border)]">
                  <td className="px-4 py-3 font-mono text-xs">{b.code}</td>
                  <td className="px-4 py-3">
                    <p className="font-medium">{b.user.name}</p>
                    <p className="text-xs text-foreground-secondary">{b.user.email}</p>
                  </td>
                  <td className="px-4 py-3">{formatShortDate(b.date as Date)}</td>
                  <td className="px-4 py-3">
                    {b.block.label}
                    <span className="text-xs text-foreground-tertiary font-mono ml-2">
                      {b.block.startTime}–{b.block.endTime}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant={statusVariant[b.status] ?? "default"}>
                      {BOOKING_STATUS_LABEL[b.status as keyof typeof BOOKING_STATUS_LABEL] ?? b.status}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant={b.paymentStatus === "PAID" ? "success" : "warning"}>
                      {PAYMENT_STATUS_LABEL[b.paymentStatus as keyof typeof PAYMENT_STATUS_LABEL] ??
                        b.paymentStatus}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-right font-mono">
                    {b.totalPrice ? formatCurrency(b.totalPrice) : "—"}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      {b.status === "PENDING" ? (
                        <Button
                          size="sm"
                          variant="ghost"
                          aria-label="Aprobar"
                          disabled={isPending}
                          onClick={() => patchBooking(b.id, { status: "CONFIRMED" })}
                        >
                          <Check className="size-4 text-[var(--success)]" />
                        </Button>
                      ) : null}
                      {b.status !== "CANCELLED" && b.status !== "COMPLETED" ? (
                        <Button
                          size="sm"
                          variant="ghost"
                          aria-label="Cancelar"
                          disabled={isPending}
                          onClick={() => patchBooking(b.id, { status: "CANCELLED" })}
                        >
                          <X className="size-4 text-[var(--danger)]" />
                        </Button>
                      ) : null}
                      {b.paymentStatus !== "PAID" ? (
                        <Button
                          size="sm"
                          variant="ghost"
                          aria-label="Marcar pagado"
                          disabled={isPending}
                          onClick={() => patchBooking(b.id, { paymentStatus: "PAID" })}
                        >
                          <DollarSign className="size-4 text-[var(--gold)]" />
                        </Button>
                      ) : null}
                      <Button size="sm" variant="ghost" aria-label="Más">
                        <MoreHorizontal className="size-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
