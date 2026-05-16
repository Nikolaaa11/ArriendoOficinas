import { PageHeader } from "@/components/shared/PageHeader";
import { AdminCalendar } from "@/components/dashboard/AdminCalendar";
import { prisma } from "@/infrastructure/database/prisma-client";

export const metadata = { title: "Calendario" };
export const dynamic = "force-dynamic";

function pad(n: number) {
  return String(n).padStart(2, "0");
}

export default async function CalendarioPage() {
  const now = new Date();
  const from = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const to = new Date(now.getFullYear(), now.getMonth() + 2, 0);

  const bookings = await prisma.booking.findMany({
    where: { date: { gte: from, lte: to } },
    include: { user: true, block: true },
    orderBy: { date: "asc" },
  });

  const items = bookings.map((b) => ({
    id: b.id,
    code: b.code,
    date: `${b.date.getFullYear()}-${pad(b.date.getMonth() + 1)}-${pad(b.date.getDate())}`,
    blockType: b.block.type as "AM" | "PM",
    status: b.status,
    userName: b.user.name,
  }));

  return (
    <>
      <PageHeader
        title="Calendario"
        description="Bloques AM/PM por día, coloreados por estado."
      />
      <AdminCalendar bookings={items} />
    </>
  );
}
