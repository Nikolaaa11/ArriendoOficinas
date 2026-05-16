import { PageHeader } from "@/components/shared/PageHeader";
import { EmptyState } from "@/components/shared/EmptyState";
import { Settings } from "lucide-react";

export const metadata = { title: "Configuración" };

export default function ConfiguracionPage() {
  return (
    <>
      <PageHeader title="Configuración" description="Precios, fechas bloqueadas, fotos y textos del landing." />
      <EmptyState icon={Settings} title="Configuración — Sprint 4" description="Editores se implementan en Sprint 4." />
    </>
  );
}
