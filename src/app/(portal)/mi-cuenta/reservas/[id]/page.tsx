import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/shared/PageHeader";
import { PayButton } from "@/components/booking/PayButton";
import { CancelBookingButton } from "@/components/booking/CancelBookingButton";
import { getBookingById } from "@/modules/booking/booking.service";
import { getSession } from "@/infrastructure/auth/auth.utils";
import { BOOKING_STATUS_LABEL, PAYMENT_STATUS_LABEL } from "@/lib/constants";
import { formatDateLong } from "@/lib/dates";
import { formatCurrency } from "@/lib/utils";

export const metadata = { title: "Detalle de reserva" };

const statusVariant: Record<string, "default" | "warning" | "success" | "danger" | "outline"> = {
  PENDING: "warning",
  CONFIRMED: "success",
  CANCELLED: "danger",
  COMPLETED: "outline",
  NO_SHOW: "danger",
};

export default async function BookingDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await getSession();
  if (!session?.user) redirect("/login");

  const { id } = await params;
  const booking = await getBookingById(id);
  if (!booking) notFound();

  const userId = (session.user as { id?: string }).id;
  const role = (session.user as { role?: string }).role;
  if (booking.userId !== userId && role !== "ADMIN" && role !== "SUPER_ADMIN") {
    notFound();
  }

  return (
    <>
      <PageHeader
        title={`Reserva ${booking.code}`}
        description={booking.office.name}
        actions={
          <Button variant="outline" size="sm" asChild>
            <Link href="/mi-cuenta/mis-reservas">
              <ArrowLeft className="size-4" /> Volver
            </Link>
          </Button>
        }
      />
      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="p-6">
          <h3 className="font-display text-lg font-semibold mb-4">Detalle</h3>
          <dl className="space-y-3 text-sm">
            <Row label="Fecha" value={formatDateLong(booking.date)} />
            <Row
              label="Bloque"
              value={`${booking.block.label} · ${booking.block.startTime}–${booking.block.endTime}`}
            />
            <Row
              label="Estado"
              value={
                <Badge variant={statusVariant[booking.status] ?? "default"}>
                  {BOOKING_STATUS_LABEL[booking.status as keyof typeof BOOKING_STATUS_LABEL] ?? booking.status}
                </Badge>
              }
            />
            <Row
              label="Pago"
              value={
                <Badge variant={booking.paymentStatus === "PAID" ? "success" : "warning"}>
                  {PAYMENT_STATUS_LABEL[booking.paymentStatus as keyof typeof PAYMENT_STATUS_LABEL] ?? booking.paymentStatus}
                </Badge>
              }
            />
            <Row
              label="Monto"
              value={booking.totalPrice ? formatCurrency(booking.totalPrice) : "—"}
            />
          </dl>
        </Card>

        <Card className="p-6">
          <h3 className="font-display text-lg font-semibold mb-4">Ubicación</h3>
          <p className="text-sm text-foreground-secondary">{booking.office.address}</p>
          {booking.notes ? (
            <>
              <h4 className="font-display text-sm font-semibold mt-6 mb-2">Tus notas</h4>
              <p className="text-sm">{booking.notes}</p>
            </>
          ) : null}

          {booking.paymentStatus !== "PAID" &&
          booking.status !== "CANCELLED" &&
          booking.totalPrice ? (
            <div className="mt-6 pt-6 border-t border-[var(--border)]">
              <p className="text-sm text-foreground-secondary mb-3">
                Paga ahora para asegurar el bloque.
              </p>
              <PayButton bookingId={booking.id} amount={booking.totalPrice} />
            </div>
          ) : null}

          {booking.status === "PENDING" || booking.status === "CONFIRMED" ? (
            <div className="mt-6 pt-6 border-t border-[var(--border)]">
              <CancelBookingButton bookingId={booking.id} />
            </div>
          ) : null}
        </Card>
      </div>
    </>
  );
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between">
      <dt className="text-foreground-secondary">{label}</dt>
      <dd className="text-foreground font-medium">{value}</dd>
    </div>
  );
}
