import { redirect } from "next/navigation";
import { PageHeader } from "@/components/shared/PageHeader";
import { BookingForm } from "@/components/booking/BookingForm";
import { getSession } from "@/infrastructure/auth/auth.utils";
import { prisma } from "@/infrastructure/database/prisma-client";

export const metadata = { title: "Reservar" };

export default async function ReservarPage() {
  const session = await getSession();
  if (!session?.user) redirect("/login?callbackUrl=/reservar");

  const office = await prisma.office.findFirst({ where: { isActive: true } });
  if (!office) {
    return <p className="text-foreground-secondary">No hay oficinas disponibles.</p>;
  }

  const blocks = await prisma.block.findMany({
    where: { officeId: office.id, isActive: true },
    include: { pricing: { where: { validTo: null }, select: { dayOfWeek: true, price: true } } },
    orderBy: { type: "asc" },
  });

  return (
    <>
      <PageHeader
        title="Reservar oficina"
        description={`${office.name} · ${office.address}`}
      />
      <BookingForm
        blocks={blocks.map((b) => ({
          id: b.id,
          type: b.type as "AM" | "PM",
          label: b.label,
          startTime: b.startTime,
          endTime: b.endTime,
          pricing: b.pricing,
        }))}
      />
    </>
  );
}
