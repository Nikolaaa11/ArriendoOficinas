import Link from "next/link";
import { PageHeader } from "@/components/shared/PageHeader";
import { EmptyState } from "@/components/shared/EmptyState";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { CalendarOff, Plus } from "lucide-react";
import { getSession } from "@/infrastructure/auth/auth.utils";
import { getMyBookings } from "@/modules/booking/booking.service";
import { BOOKING_STATUS_LABEL } from "@/lib/constants";
import { formatDateLong } from "@/lib/dates";
import { formatCurrency } from "@/lib/utils";

export const metadata = { title: "Mis reservas" };

const statusVariant: Record<string, "default" | "warning" | "success" | "danger" | "outline"> = {
  PENDING: "warning",
  CONFIRMED: "success",
  CANCELLED: "danger",
  COMPLETED: "outline",
  NO_SHOW: "danger",
};

export default async function MisReservasPage() {
  const session = await getSession();
  const userId = (session?.user as { id?: string } | undefined)?.id;
  const bookings = userId ? await getMyBookings(userId) : [];

  return (
    <>
      <PageHeader
        title="Mis reservas"
        description="Historial completo y próximas reservas."
        actions={
          <Button asChild>
            <Link href="/reservar">
              <Plus className="size-4" /> Nueva reserva
            </Link>
          </Button>
        }
      />
      {bookings.length === 0 ? (
        <EmptyState
          icon={CalendarOff}
          title="Aún no tienes reservas"
          description="Reserva un bloque AM o PM y aparecerá aquí."
          action={
            <Button asChild>
              <Link href="/reservar">Crear primera reserva</Link>
            </Button>
          }
        />
      ) : (
        <Card className="overflow-hidden p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-background-surface">
                <tr className="text-left">
                  <th className="px-4 py-3 font-display font-semibold">Código</th>
                  <th className="px-4 py-3 font-display font-semibold">Fecha</th>
                  <th className="px-4 py-3 font-display font-semibold">Bloque</th>
                  <th className="px-4 py-3 font-display font-semibold">Estado</th>
                  <th className="px-4 py-3 font-display font-semibold text-right">Monto</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((b) => (
                  <tr key={b.id} className="border-t border-[var(--border)]">
                    <td className="px-4 py-3 font-mono text-xs">{b.code}</td>
                    <td className="px-4 py-3">{formatDateLong(b.date)}</td>
                    <td className="px-4 py-3">
                      {b.block.label}
                      <span className="text-foreground-tertiary text-xs font-mono ml-2">
                        {b.block.startTime}–{b.block.endTime}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={statusVariant[b.status] ?? "default"}>
                        {BOOKING_STATUS_LABEL[b.status as keyof typeof BOOKING_STATUS_LABEL] ?? b.status}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-right font-mono">
                      {b.totalPrice ? formatCurrency(b.totalPrice) : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </>
  );
}
