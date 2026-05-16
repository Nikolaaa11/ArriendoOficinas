import { prisma } from "@/infrastructure/database/prisma-client";

export interface OccupancyDay {
  date: string; // YYYY-MM-DD
  label: string; // "01", "02", ...
  am: number; // 0 or 1
  pm: number; // 0 or 1
}

export interface RevenueMonth {
  month: string; // YYYY-MM
  label: string; // "Jun"
  revenue: number;
}

function pad(n: number) {
  return String(n).padStart(2, "0");
}

export async function getOccupancyByDay(officeId: string, year: number, month: number) {
  const first = new Date(year, month - 1, 1);
  const last = new Date(year, month, 0);
  const bookings = await prisma.booking.findMany({
    where: {
      officeId,
      date: { gte: first, lte: last },
      status: { in: ["CONFIRMED", "PENDING"] },
    },
    include: { block: true },
  });
  const result: OccupancyDay[] = [];
  for (let d = 1; d <= last.getDate(); d++) {
    const dateStr = `${year}-${pad(month)}-${pad(d)}`;
    const dayBookings = bookings.filter((b) => {
      const bd = b.date;
      return (
        bd.getFullYear() === year &&
        bd.getMonth() === month - 1 &&
        bd.getDate() === d
      );
    });
    result.push({
      date: dateStr,
      label: pad(d),
      am: dayBookings.some((b) => b.block.type === "AM") ? 1 : 0,
      pm: dayBookings.some((b) => b.block.type === "PM") ? 1 : 0,
    });
  }
  return result;
}

const MONTH_LABELS = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];

export async function getRevenueLastMonths(officeId: string, monthsBack = 6) {
  const now = new Date();
  const series: RevenueMonth[] = [];
  for (let i = monthsBack - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const next = new Date(d.getFullYear(), d.getMonth() + 1, 0);
    const agg = await prisma.booking.aggregate({
      where: {
        officeId,
        paymentStatus: "PAID",
        paidAt: { gte: d, lte: next },
      },
      _sum: { totalPrice: true },
    });
    series.push({
      month: `${d.getFullYear()}-${pad(d.getMonth() + 1)}`,
      label: MONTH_LABELS[d.getMonth()],
      revenue: agg._sum.totalPrice ?? 0,
    });
  }
  return series;
}

export async function getOccupancyRate(officeId: string, year: number, month: number) {
  const days = await getOccupancyByDay(officeId, year, month);
  const totalSlots = days.length * 2; // 2 blocks per day
  const filled = days.reduce((acc, d) => acc + d.am + d.pm, 0);
  return totalSlots ? Math.round((filled / totalSlots) * 100) : 0;
}
