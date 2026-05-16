import type { Metadata } from "next";
import { AvailabilityCalendar } from "@/components/booking/AvailabilityCalendar";

export const metadata: Metadata = {
  title: "Disponibilidad",
  description: "Consulta la disponibilidad por bloques AM/PM y reserva tu oficina.",
};

export default function DisponibilidadPage() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
      <header className="mb-8">
        <p className="text-xs uppercase tracking-wider text-[var(--gold)]">Disponibilidad</p>
        <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight sm:text-4xl">
          Elige el día y bloque que necesitas.
        </h1>
        <p className="mt-3 max-w-2xl text-foreground-secondary">
          Cada día se divide en dos bloques: AM (08:00–14:00) y PM (14:00–20:00). Selecciona el día para ver el detalle.
        </p>
      </header>
      <AvailabilityCalendar />
    </section>
  );
}
