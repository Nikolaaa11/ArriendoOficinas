import { PageHeader } from "@/components/shared/PageHeader";
import { StatsCards } from "@/components/dashboard/StatsCards";
import { RecentBookings } from "@/components/dashboard/RecentBookings";
import { OccupancyChart } from "@/components/dashboard/OccupancyChart";
import { RevenueChart } from "@/components/dashboard/RevenueChart";
import { prisma } from "@/infrastructure/database/prisma-client";
import {
  getOccupancyByDay,
  getOccupancyRate,
  getRevenueLastMonths,
} from "@/modules/analytics/analytics.service";

export const metadata = { title: "Dashboard" };
export const dynamic = "force-dynamic";

async function loadData() {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const office = await prisma.office.findFirst({ where: { isActive: true } });

  if (!office) {
    return {
      office: null,
      bookingsMonth: 0,
      revenue: 0,
      occupancy: 0,
      tenants: 0,
      recent: [],
      occupancyData: [],
      revenueData: [],
    };
  }

  const [bookingsMonth, revenueAgg, tenants, recent, occupancyData, revenueData, occupancy] =
    await Promise.all([
      prisma.booking.count({
        where: {
          officeId: office.id,
          createdAt: { gte: startOfMonth },
          status: { not: "CANCELLED" },
        },
      }),
      prisma.booking.aggregate({
        where: {
          officeId: office.id,
          paymentStatus: "PAID",
          paidAt: { gte: startOfMonth },
        },
        _sum: { totalPrice: true },
      }),
      prisma.user.count({ where: { role: "TENANT" } }),
      prisma.booking.findMany({
        orderBy: { createdAt: "desc" },
        take: 5,
        include: { user: true, block: true, office: true },
      }),
      getOccupancyByDay(office.id, now.getFullYear(), now.getMonth() + 1),
      getRevenueLastMonths(office.id, 6),
      getOccupancyRate(office.id, now.getFullYear(), now.getMonth() + 1),
    ]);

  return {
    office,
    bookingsMonth,
    revenue: revenueAgg._sum.totalPrice ?? 0,
    occupancy,
    tenants,
    recent,
    occupancyData,
    revenueData,
  };
}

export default async function DashboardHome() {
  const data = await loadData();
  return (
    <>
      <PageHeader
        title="Dashboard"
        description={
          data.office
            ? `${data.office.name} · vista general del mes en curso`
            : "Configura una oficina para empezar."
        }
      />
      <div className="space-y-6">
        <StatsCards
          bookingsMonth={data.bookingsMonth}
          revenue={data.revenue}
          occupancy={data.occupancy}
          tenants={data.tenants}
        />
        <div className="grid gap-6 lg:grid-cols-2">
          <OccupancyChart data={data.occupancyData} />
          <RevenueChart data={data.revenueData} />
        </div>
        <RecentBookings bookings={data.recent as never} />
      </div>
    </>
  );
}
