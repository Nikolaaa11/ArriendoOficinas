import { PageHeader } from "@/components/shared/PageHeader";
import { EmptyState } from "@/components/shared/EmptyState";
import { Users } from "lucide-react";

export const metadata = { title: "Arrendatarios" };

export default function ArrendatariosPage() {
  return (
    <>
      <PageHeader title="Arrendatarios" description="Tabla de arrendatarios con historial y contacto." />
      <EmptyState icon={Users} title="Arrendatarios — Sprint 4" description="Vista detallada implementada en Sprint 4." />
    </>
  );
}
