import { PageHeader } from "@/components/shared/PageHeader";
import { EmptyState } from "@/components/shared/EmptyState";
import { CalendarDays } from "lucide-react";

export const metadata = { title: "Calendario" };

export default function CalendarioPage() {
  return (
    <>
      <PageHeader title="Calendario" description="Vista mensual con bloques AM/PM y estado por reserva." />
      <EmptyState icon={CalendarDays} title="Calendario — Sprint 4" description="Vista mensual implementada en Sprint 4." />
    </>
  );
}
