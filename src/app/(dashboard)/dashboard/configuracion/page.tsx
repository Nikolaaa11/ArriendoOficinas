import { PageHeader } from "@/components/shared/PageHeader";
import { EmptyState } from "@/components/shared/EmptyState";
import { Settings } from "lucide-react";
import { Card } from "@/components/ui/card";
import { PricingEditor } from "@/components/dashboard/PricingEditor";
import { BlockedDatesManager } from "@/components/dashboard/BlockedDatesManager";
import { PhotoManager } from "@/components/dashboard/PhotoManager";
import { SiteConfigEditor } from "@/components/dashboard/SiteConfigEditor";
import { prisma } from "@/infrastructure/database/prisma-client";
import { getLandingTexts } from "@/modules/site-config/site-config.service";

export const metadata = { title: "Configuración" };
export const dynamic = "force-dynamic";

function pad(n: number) {
  return String(n).padStart(2, "0");
}

export default async function ConfiguracionPage() {
  const office = await prisma.office.findFirst({ where: { isActive: true } });
  if (!office) {
    return (
      <>
        <PageHeader title="Configuración" />
        <EmptyState icon={Settings} title="Sin oficina activa" description="Crea una oficina en la base de datos." />
      </>
    );
  }

  const [blocks, blocked, photos, landingTexts] = await Promise.all([
    prisma.block.findMany({
      where: { officeId: office.id, isActive: true },
      include: { pricing: { where: { validTo: null } } },
      orderBy: { type: "asc" },
    }),
    prisma.blockedDate.findMany({
      where: { officeId: office.id },
      orderBy: { date: "asc" },
    }),
    prisma.photo.findMany({
      where: { officeId: office.id },
      orderBy: { order: "asc" },
    }),
    getLandingTexts(),
  ]);

  return (
    <>
      <PageHeader
        title="Configuración"
        description={`Precios, fechas bloqueadas y galería · ${office.name}`}
      />

      <div className="space-y-10">
        <section className="space-y-3">
          <h2 className="font-display text-xl font-semibold">Precios por bloque × día</h2>
          <p className="text-sm text-foreground-secondary">
            Edita cualquier valor y presiona <strong>Guardar</strong>. La nueva tarifa se aplica desde hoy.
          </p>
          <PricingEditor
            blocks={blocks.map((b) => ({
              id: b.id,
              label: b.label,
              type: b.type as "AM" | "PM",
              startTime: b.startTime,
              endTime: b.endTime,
              pricing: b.pricing.map((p) => ({ dayOfWeek: p.dayOfWeek, price: p.price })),
            }))}
          />
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-xl font-semibold">Fechas bloqueadas</h2>
          <p className="text-sm text-foreground-secondary">
            Feriados, mantención o cualquier día que no quieras que sea reservable.
          </p>
          <BlockedDatesManager
            officeId={office.id}
            blocked={blocked.map((b) => ({
              id: b.id,
              date: `${b.date.getFullYear()}-${pad(b.date.getMonth() + 1)}-${pad(b.date.getDate())}`,
              reason: b.reason,
            }))}
          />
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-xl font-semibold">Galería de fotos</h2>
          <p className="text-sm text-foreground-secondary">
            Las fotos aparecen en la landing y en /galeria, ordenadas como las dejes aquí.
          </p>
          <PhotoManager officeId={office.id} photos={photos} />
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-xl font-semibold">Textos del landing</h2>
          <p className="text-sm text-foreground-secondary">
            Edita el título del hero, el subtítulo, y los textos de contacto. El landing usa ISR (1 hora) — refresca para ver el cambio.
          </p>
          <SiteConfigEditor initial={landingTexts} />
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-xl font-semibold">Datos generales</h2>
          <Card className="p-6 space-y-2 text-sm">
            <p><span className="text-foreground-secondary">Nombre:</span> {office.name}</p>
            <p><span className="text-foreground-secondary">Dirección:</span> {office.address}</p>
            <p><span className="text-foreground-secondary">Capacidad:</span> {office.capacity} personas</p>
            <p className="text-xs text-foreground-tertiary mt-3">
              Para editar nombre/dirección/coordenadas, usa <code className="font-mono">npx prisma studio</code> por ahora.
            </p>
          </Card>
        </section>
      </div>
    </>
  );
}
