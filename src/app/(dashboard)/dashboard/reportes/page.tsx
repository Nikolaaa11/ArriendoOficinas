import { PageHeader } from "@/components/shared/PageHeader";
import { EmptyState } from "@/components/shared/EmptyState";
import { PieChart } from "lucide-react";

export const metadata = { title: "Reportes" };

export default function ReportesPage() {
  return (
    <>
      <PageHeader title="Reportes" description="Ocupación, ingresos, top arrendatarios y export CSV." />
      <EmptyState icon={PieChart} title="Reportes — Sprint 5" description="Reportes y export implementados en Sprint 5." />
    </>
  );
}
