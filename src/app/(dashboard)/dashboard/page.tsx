import { PageHeader } from "@/components/shared/PageHeader";
import { StatsCards } from "@/components/dashboard/StatsCards";
import { RecentBookings } from "@/components/dashboard/RecentBookings";
import { prisma } from "@/infrastructure/database/prisma-client";

export const metadata = { title: "Dashboard" };

async function loadStats() {
  try {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const [bookingsMonth, totalRevenue, tenants, recent] = await Promise.all([
      prisma.booking.count({
        where: { createdAt: { gte: startOfMonth }, status: { not: "CANCELLED" } },
      }),
      prisma.booking.aggregate({
        where: { paymentStatus: "PAID", paidAt: { gte: startOfMonth } },
        _sum: { totalPrice: true },
      }),
      prisma.user.count({ where: { role: "TENANT" } }),
      prisma.booking.findMany({
        orderBy: { createdAt: "desc" },
        take: 5,
        include: { user: true, block: true, office: true },
      }),
    ]);

    return {
      bookingsMonth,
      revenue: totalRevenue._sum.totalPrice ?? 0,
      occupancy: 0,
      tenants,
      recent,
    };
  } catch {
    return { bookingsMonth: 0, revenue: 0, occupancy: 0, tenants: 0, recent: [] };
  }
}

export default async function DashboardHome() {
  const stats = await loadStats();
  return (
    <>
      <PageHeader
        title="Dashboard"
        description="Vista general de reservas, ingresos y ocupación."
      />
      <div className="space-y-6">
        <StatsCards
          bookingsMonth={stats.bookingsMonth}
          revenue={stats.revenue}
          occupancy={stats.occupancy}
          tenants={stats.tenants}
        />
        <RecentBookings bookings={stats.recent as never} />
      </div>
    </>
  );
}
