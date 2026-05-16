import { PageHeader } from "@/components/shared/PageHeader";
import { EmptyState } from "@/components/shared/EmptyState";
import { UserCog } from "lucide-react";

export const metadata = { title: "Perfil" };

export default function PerfilPage() {
  return (
    <>
      <PageHeader title="Perfil" description="Datos personales y profesionales." />
      <EmptyState icon={UserCog} title="Editor de perfil — Sprint 3" description="Formulario completo en Sprint 3." />
    </>
  );
}
