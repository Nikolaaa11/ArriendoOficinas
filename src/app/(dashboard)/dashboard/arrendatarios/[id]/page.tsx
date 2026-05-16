import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Mail, MessageCircle, Phone } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/shared/PageHeader";
import { EmptyState } from "@/components/shared/EmptyState";
import { prisma } from "@/infrastructure/database/prisma-client";
import { BOOKING_STATUS_LABEL, PAYMENT_STATUS_LABEL } from "@/lib/constants";
import { formatShortDate } from "@/lib/dates";
import { formatCurrency } from "@/lib/utils";

export const metadata = { title: "Arrendatario" };
export const dynamic = "force-dynamic";

const statusVariant: Record<string, "default" | "warning" | "success" | "danger" | "outline"> = {
  PENDING: "warning",
  CONFIRMED: "success",
  CANCELLED: "danger",
  COMPLETED: "outline",
  NO_SHOW: "danger",
};

export default async function TenantDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const tenant = await prisma.user.findUnique({
    where: { id },
    include: {
      bookings: {
        orderBy: { date: "desc" },
        include: { block: true, office: true },
      },
    },
  });

  if (!tenant || tenant.role !== "TENANT") notFound();

  const totalRevenue = tenant.bookings
    .filter((b) => b.paymentStatus === "PAID")
    .reduce((acc, b) => acc + (b.totalPrice ?? 0), 0);

  const wpp = tenant.phone?.replace(/[^0-9]/g, "");

  return (
    <>
      <PageHeader
        title={tenant.name}
        description={tenant.email}
        actions={
          <Button variant="outline" size="sm" asChild>
            <Link href="/dashboard/arrendatarios">
              <ArrowLeft className="size-4" /> Volver
            </Link>
          </Button>
        }
      />

      <div className="grid gap-4 lg:grid-cols-[1fr_2fr]">
        <Card className="p-6 space-y-4">
          <div>
            <h3 className="font-display text-lg font-semibold">Datos</h3>
          </div>
          <dl className="space-y-3 text-sm">
            <DataRow icon={<Mail className="size-4" />} label="Email" value={tenant.email} />
            {tenant.phone ? (
              <DataRow
                icon={<Phone className="size-4" />}
                label="Teléfono"
                value={tenant.phone}
              />
            ) : null}
            {tenant.profession ? (
              <DataRow label="Profesión" value={tenant.profession} />
            ) : null}
            {tenant.company ? <DataRow label="Empresa" value={tenant.company} /> : null}
            {tenant.rut ? <DataRow label="RUT" value={tenant.rut} /> : null}
          </dl>

          <div className="border-t border-[var(--border)] pt-4 space-y-2">
            <p className="text-xs uppercase tracking-wider text-foreground-tertiary">Stats</p>
            <p className="text-sm">
              Reservas totales: <strong className="font-mono">{tenant.bookings.length}</strong>
            </p>
            <p className="text-sm">
              Pagado:{" "}
              <strong className="font-mono">{formatCurrency(totalRevenue)}</strong>
            </p>
          </div>

          {wpp ? (
            <a
              href={`https://wa.me/${wpp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg bg-[#25D366] px-4 py-2.5 text-white text-sm font-medium"
            >
              <MessageCircle className="size-4" /> Escribir por WhatsApp
            </a>
          ) : null}
        </Card>

        <Card className="p-0 overflow-hidden">
          <CardHeader>
            <CardTitle>Historial de reservas</CardTitle>
            <CardDescription>Todas las reservas ordenadas por fecha</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            {tenant.bookings.length === 0 ? (
              <EmptyState title="Sin reservas todavía" />
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-background-surface text-left">
                    <tr>
                      <th className="px-4 py-3 font-display font-semibold">Código</th>
                      <th className="px-4 py-3 font-display font-semibold">Fecha</th>
                      <th className="px-4 py-3 font-display font-semibold">Bloque</th>
                      <th className="px-4 py-3 font-display font-semibold">Estado</th>
                      <th className="px-4 py-3 font-display font-semibold">Pago</th>
                      <th className="px-4 py-3 font-display font-semibold text-right">Monto</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tenant.bookings.map((b) => (
                      <tr key={b.id} className="border-t border-[var(--border)]">
                        <td className="px-4 py-3 font-mono text-xs">{b.code}</td>
                        <td className="px-4 py-3">{formatShortDate(b.date)}</td>
                        <td className="px-4 py-3">{b.block.label}</td>
                        <td className="px-4 py-3">
                          <Badge variant={statusVariant[b.status] ?? "default"}>
                            {BOOKING_STATUS_LABEL[b.status as keyof typeof BOOKING_STATUS_LABEL] ?? b.status}
                          </Badge>
                        </td>
                        <td className="px-4 py-3">
                          <Badge variant={b.paymentStatus === "PAID" ? "success" : "warning"}>
                            {PAYMENT_STATUS_LABEL[b.paymentStatus as keyof typeof PAYMENT_STATUS_LABEL] ?? b.paymentStatus}
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
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
}

function DataRow({ icon, label, value }: { icon?: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-start gap-2.5">
      {icon ? <span className="mt-0.5 text-foreground-tertiary">{icon}</span> : null}
      <div>
        <dt className="text-xs uppercase tracking-wider text-foreground-tertiary">{label}</dt>
        <dd>{value}</dd>
      </div>
    </div>
  );
}
