import { PageHeader } from "@/components/shared/PageHeader";
import { EmptyState } from "@/components/shared/EmptyState";
import { CalendarOff } from "lucide-react";

export const metadata = { title: "Reservas" };

export default function ReservasPage() {
  return (
    <>
      <PageHeader title="Reservas" description="Aprueba, cancela y administra todas las reservas." />
      <EmptyState
        icon={CalendarOff}
        title="Tabla de reservas — Sprint 4"
        description="Implementación detallada en Sprint 4: filtros por estado/fecha, acciones masivas, paginación server-side."
      />
    </>
  );
}
