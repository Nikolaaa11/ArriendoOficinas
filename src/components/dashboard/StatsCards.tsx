import { Card } from "@/components/ui/card";
import { CalendarCheck, Coins, Percent, Users } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

interface Props {
  bookingsMonth: number;
  revenue: number;
  occupancy: number;
  tenants: number;
}

export function StatsCards({ bookingsMonth, revenue, occupancy, tenants }: Props) {
  const cards = [
    {
      label: "Reservas del mes",
      value: bookingsMonth.toString(),
      icon: CalendarCheck,
      color: "text-accent",
      bg: "bg-accent-muted",
    },
    {
      label: "Ingresos del mes",
      value: formatCurrency(revenue),
      icon: Coins,
      color: "text-[var(--gold)]",
      bg: "bg-[var(--gold-muted)]",
    },
    {
      label: "Ocupación",
      value: `${occupancy}%`,
      icon: Percent,
      color: "text-[var(--success)]",
      bg: "bg-[color-mix(in_oklab,var(--success)_15%,transparent)]",
    },
    {
      label: "Arrendatarios",
      value: tenants.toString(),
      icon: Users,
      color: "text-foreground",
      bg: "bg-background-surface",
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map(({ label, value, icon: Icon, color, bg }) => (
        <Card key={label} className="p-6">
          <div className={`grid size-10 place-items-center rounded-lg ${bg}`}>
            <Icon className={`size-5 ${color}`} />
          </div>
          <p className="mt-4 text-xs uppercase tracking-wider text-foreground-tertiary">{label}</p>
          <p className="mt-1 font-display text-2xl font-semibold">{value}</p>
        </Card>
      ))}
    </div>
  );
}
