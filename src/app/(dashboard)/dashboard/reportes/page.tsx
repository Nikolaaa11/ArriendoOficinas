import { Download } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { OccupancyChart } from "@/components/dashboard/OccupancyChart";
import { RevenueChart } from "@/components/dashboard/RevenueChart";
import { prisma } from "@/infrastructure/database/prisma-client";
import {
  getOccupancyByDay,
  getOccupancyRate,
  getRevenueLastMonths,
} from "@/modules/analytics/analytics.service";
import { formatCurrency } from "@/lib/utils";

export const metadata = { title: "Reportes" };
export const dynamic = "force-dynamic";

export default async function ReportesPage() {
  const now = new Date();
  const office = await prisma.office.findFirst({ where: { isActive: true } });
  if (!office) {
    return (
      <>
        <PageHeader title="Reportes" />
        <p className="text-foreground-secondary">Sin oficina activa.</p>
      </>
    );
  }

  const [occupancyData, revenueData, occupancyRate, topTenants] = await Promise.all([
    getOccupancyByDay(office.id, now.getFullYear(), now.getMonth() + 1),
    getRevenueLastMonths(office.id, 12),
    getOccupancyRate(office.id, now.getFullYear(), now.getMonth() + 1),
    prisma.user.findMany({
      where: { role: "TENANT" },
      include: { _count: { select: { bookings: true } } },
      orderBy: { bookings: { _count: "desc" } },
      take: 5,
    }),
  ]);

  const totalRevenue12m = revenueData.reduce((acc, r) => acc + r.revenue, 0);

  return (
    <>
      <PageHeader
        title="Reportes"
        description={`Métricas del último año · ${office.name}`}
        actions={
          <Button asChild>
            <a href="/api/admin/reports/bookings" download>
              <Download className="size-4" /> Exportar CSV
            </a>
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader>
            <CardDescription>Ocupación del mes</CardDescription>
            <CardTitle className="font-display text-3xl">{occupancyRate}%</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>Ingresos últimos 12 meses</CardDescription>
            <CardTitle className="font-display text-3xl">{formatCurrency(totalRevenue12m)}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>Arrendatarios activos</CardDescription>
            <CardTitle className="font-display text-3xl">{topTenants.length}</CardTitle>
          </CardHeader>
        </Card>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <OccupancyChart data={occupancyData} />
        <RevenueChart data={revenueData} />
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Top arrendatarios</CardTitle>
          <CardDescription>Los 5 con más reservas</CardDescription>
        </CardHeader>
        <CardContent>
          <table className="w-full text-sm">
            <thead className="text-left text-foreground-secondary">
              <tr>
                <th className="py-2 font-medium">Nombre</th>
                <th className="py-2 font-medium">Email</th>
                <th className="py-2 font-medium text-right">Reservas</th>
              </tr>
            </thead>
            <tbody>
              {topTenants.map((t) => (
                <tr key={t.id} className="border-t border-[var(--border)]">
                  <td className="py-3 font-medium">{t.name}</td>
                  <td className="py-3 text-foreground-secondary">{t.email}</td>
                  <td className="py-3 text-right font-mono">{t._count.bookings}</td>
                </tr>
              ))}
              {topTenants.length === 0 ? (
                <tr>
                  <td colSpan={3} className="py-6 text-center text-foreground-secondary">
                    Sin datos aún.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </>
  );
}
