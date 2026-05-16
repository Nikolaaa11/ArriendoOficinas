import { Clock, MapPin, Package, Shield } from "lucide-react";
import { Card } from "@/components/ui/card";

const benefits = [
  {
    icon: MapPin,
    title: "Ubicación premium",
    description: "A pasos del Metro Manquehue, en el corazón de Las Condes.",
  },
  {
    icon: Clock,
    title: "Flexibilidad real",
    description: "Reserva por bloque AM o PM, día específico o recurrente.",
  },
  {
    icon: Package,
    title: "Todo incluido",
    description: "WiFi, kitchenette, dirección comercial y servicios.",
  },
  {
    icon: Shield,
    title: "Ambiente profesional",
    description: "Espacios cuidados, ideales para clientes y reuniones.",
  },
];

export function BenefitsGrid({ title }: { title?: string } = {}) {
  return (
    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
      <div className="mb-12 max-w-2xl">
        <p className="text-xs uppercase tracking-wider text-[var(--gold)]">Por qué BLOQUE</p>
        <h2 className="mt-2 font-display text-3xl font-semibold tracking-tight sm:text-4xl">
          {title ?? "Una oficina, sin las amarras de un arriendo tradicional."}
        </h2>
      </div>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {benefits.map(({ icon: Icon, title, description }) => (
          <Card key={title} className="p-6 transition-colors hover:border-[var(--border-hover)]">
            <div className="grid size-11 place-items-center rounded-lg bg-accent-muted text-accent">
              <Icon className="size-5" />
            </div>
            <h3 className="mt-5 font-display text-lg font-semibold">{title}</h3>
            <p className="mt-1 text-sm text-foreground-secondary">{description}</p>
          </Card>
        ))}
      </div>
    </section>
  );
}
