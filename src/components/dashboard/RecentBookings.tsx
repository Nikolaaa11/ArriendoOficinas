import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BOOKING_STATUS_LABEL } from "@/lib/constants";
import { formatShortDate } from "@/lib/dates";
import { formatCurrency } from "@/lib/utils";
import { EmptyState } from "@/components/shared/EmptyState";
import { CalendarOff } from "lucide-react";

interface BookingRow {
  id: string;
  code: string;
  date: Date;
  status: string;
  totalPrice: number | null;
  user: { name: string; email: string };
  block: { label: string };
}

const statusVariant: Record<string, "default" | "warning" | "success" | "danger" | "outline"> = {
  PENDING: "warning",
  CONFIRMED: "success",
  CANCELLED: "danger",
  COMPLETED: "outline",
  NO_SHOW: "danger",
};

export function RecentBookings({ bookings }: { bookings: BookingRow[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Reservas recientes</CardTitle>
        <CardDescription>Últimas 5 reservas creadas.</CardDescription>
      </CardHeader>
      <CardContent>
        {bookings.length === 0 ? (
          <EmptyState
            icon={CalendarOff}
            title="Sin reservas todavía"
            description="Cuando llegue la primera, aparecerá aquí."
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-foreground-secondary">
                  <th className="px-2 py-2 font-medium">Código</th>
                  <th className="px-2 py-2 font-medium">Arrendatario</th>
                  <th className="px-2 py-2 font-medium">Fecha</th>
                  <th className="px-2 py-2 font-medium">Bloque</th>
                  <th className="px-2 py-2 font-medium">Estado</th>
                  <th className="px-2 py-2 font-medium text-right">Monto</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((b) => (
                  <tr key={b.id} className="border-t border-[var(--border)]">
                    <td className="px-2 py-3 font-mono text-xs">{b.code}</td>
                    <td className="px-2 py-3">
                      <p className="font-medium">{b.user.name}</p>
                      <p className="text-xs text-foreground-secondary">{b.user.email}</p>
                    </td>
                    <td className="px-2 py-3">{formatShortDate(b.date)}</td>
                    <td className="px-2 py-3">{b.block.label}</td>
                    <td className="px-2 py-3">
                      <Badge variant={statusVariant[b.status] ?? "default"}>
                        {BOOKING_STATUS_LABEL[b.status as keyof typeof BOOKING_STATUS_LABEL] ?? b.status}
                      </Badge>
                    </td>
                    <td className="px-2 py-3 text-right font-mono">
                      {b.totalPrice ? formatCurrency(b.totalPrice) : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
