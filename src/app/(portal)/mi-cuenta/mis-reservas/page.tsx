import { PageHeader } from "@/components/shared/PageHeader";
import { EmptyState } from "@/components/shared/EmptyState";
import { CalendarOff } from "lucide-react";

export const metadata = { title: "Mis reservas" };

export default function MisReservasPage() {
  return (
    <>
      <PageHeader title="Mis reservas" description="Historial y reservas próximas." />
      <EmptyState icon={CalendarOff} title="Mis reservas — Sprint 3" description="Tabla completa implementada en Sprint 3." />
    </>
  );
}
