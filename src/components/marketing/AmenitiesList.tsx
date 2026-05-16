import { Coffee, Mail, Sofa, Wifi, BriefcaseBusiness } from "lucide-react";

const amenities = [
  { icon: Wifi, label: "WiFi alta velocidad" },
  { icon: Coffee, label: "Kitchenette equipada" },
  { icon: Sofa, label: "Sala de espera" },
  { icon: BriefcaseBusiness, label: "Escritorio profesional" },
  { icon: Mail, label: "Dirección comercial" },
];

export function AmenitiesList() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <div className="rounded-2xl border border-[var(--border)] bg-background-secondary p-8 sm:p-10">
        <div className="grid gap-8 lg:grid-cols-[1fr_2fr] items-center">
          <div>
            <p className="text-xs uppercase tracking-wider text-[var(--gold)]">Amenidades</p>
            <h2 className="mt-2 font-display text-2xl font-semibold sm:text-3xl">
              Todo lo que necesitas para trabajar bien.
            </h2>
          </div>
          <div className="flex flex-wrap gap-3">
            {amenities.map(({ icon: Icon, label }) => (
              <span
                key={label}
                className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-background px-4 py-2 text-sm text-foreground"
              >
                <Icon className="size-4 text-accent" /> {label}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
