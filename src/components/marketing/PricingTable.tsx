import { Card } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";

const PRICING = [
  { day: "Lunes a Viernes", am: 35000, pm: 35000 },
  { day: "Sábado", am: 25000, pm: 25000 },
  { day: "Domingo", am: null, pm: null },
] as const;

export function PricingTable() {
  return (
    <section id="precios" className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
      <div className="mb-10 max-w-2xl">
        <p className="text-xs uppercase tracking-wider text-[var(--gold)]">Precios</p>
        <h2 className="mt-2 font-display text-3xl font-semibold tracking-tight sm:text-4xl">
          Simple. Sin sorpresas.
        </h2>
        <p className="mt-3 text-foreground-secondary">
          Reserva el bloque que necesitas. AM de 08:00 a 14:00, PM de 14:00 a 20:00.
        </p>
      </div>

      <Card className="overflow-hidden p-0">
        <table className="w-full text-sm">
          <thead className="bg-background-surface">
            <tr>
              <th className="px-6 py-4 text-left font-display font-semibold">Día</th>
              <th className="px-6 py-4 text-right font-display font-semibold">Bloque AM</th>
              <th className="px-6 py-4 text-right font-display font-semibold">Bloque PM</th>
            </tr>
          </thead>
          <tbody>
            {PRICING.map(({ day, am, pm }) => (
              <tr key={day} className="border-t border-[var(--border)]">
                <td className="px-6 py-4 font-medium">{day}</td>
                <td className="px-6 py-4 text-right font-mono">
                  {am === null ? <span className="text-foreground-tertiary">— cerrado —</span> : formatCurrency(am)}
                </td>
                <td className="px-6 py-4 text-right font-mono">
                  {pm === null ? <span className="text-foreground-tertiary">— cerrado —</span> : formatCurrency(pm)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      <p className="mt-4 text-xs text-foreground-tertiary">
        Los precios pueden variar en feriados. Cancelación gratis hasta 24 horas antes del bloque.
      </p>
    </section>
  );
}
