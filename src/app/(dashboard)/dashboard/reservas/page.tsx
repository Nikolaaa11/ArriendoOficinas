import { PageHeader } from "@/components/shared/PageHeader";
import { BookingsTable } from "@/components/dashboard/BookingsTable";
import { prisma } from "@/infrastructure/database/prisma-client";

export const metadata = { title: "Reservas" };
export const dynamic = "force-dynamic";

export default async function ReservasPage() {
  const bookings = await prisma.booking.findMany({
    orderBy: { date: "desc" },
    include: { user: true, block: true, office: true },
    take: 200,
  });

  return (
    <>
      <PageHeader title="Reservas" description="Aprueba, cancela y marca como pagadas." />
      <BookingsTable
        initialBookings={bookings.map((b) => ({
          id: b.id,
          code: b.code,
          date: b.date,
          status: b.status,
          paymentStatus: b.paymentStatus,
          totalPrice: b.totalPrice,
          user: { name: b.user.name, email: b.user.email },
          block: { label: b.block.label, startTime: b.block.startTime, endTime: b.block.endTime },
        }))}
      />
    </>
  );
}
