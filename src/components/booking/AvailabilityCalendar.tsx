"use client";

import "react-day-picker/style.css";
import { useEffect, useMemo, useState } from "react";
import { DayPicker } from "react-day-picker";
import { es } from "date-fns/locale";
import { format } from "date-fns";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";

type DayState = "AVAILABLE" | "PARTIAL" | "FULL" | "CLOSED";

interface DayAvailability {
  date: string; // YYYY-MM-DD
  am: { available: boolean; pending: boolean };
  pm: { available: boolean; pending: boolean };
  state: DayState;
}

interface Props {
  officeId?: string;
}

function isoMonth(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

export function AvailabilityCalendar({ officeId }: Props) {
  const [month, setMonth] = useState<Date>(new Date());
  const [data, setData] = useState<DayAvailability[]>([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<Date | undefined>();

  useEffect(() => {
    let cancelled = false;
    async function fetchAvailability() {
      setLoading(true);
      try {
        const params = new URLSearchParams({ month: isoMonth(month) });
        if (officeId) params.set("officeId", officeId);
        const res = await fetch(`/api/availability?${params.toString()}`);
        const json = await res.json();
        if (!cancelled && json.success) setData(json.data);
      } catch {
        if (!cancelled) setData([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    fetchAvailability();
    return () => {
      cancelled = true;
    };
  }, [month, officeId]);

  const dayMap = useMemo(() => {
    const m = new Map<string, DayAvailability>();
    for (const d of data) m.set(d.date, d);
    return m;
  }, [data]);

  const modifiers = useMemo(() => {
    const available: Date[] = [];
    const partial: Date[] = [];
    const full: Date[] = [];
    const closed: Date[] = [];
    for (const d of data) {
      const [y, mo, dd] = d.date.split("-").map(Number);
      const date = new Date(y, mo - 1, dd);
      if (d.state === "AVAILABLE") available.push(date);
      else if (d.state === "PARTIAL") partial.push(date);
      else if (d.state === "FULL") full.push(date);
      else if (d.state === "CLOSED") closed.push(date);
    }
    return { available, partial, full, closed };
  }, [data]);

  const selectedKey = selected ? format(selected, "yyyy-MM-dd") : null;
  const selectedDay = selectedKey ? dayMap.get(selectedKey) : null;

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
      <Card className="p-4 sm:p-6 overflow-hidden">
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs uppercase tracking-wider text-foreground-tertiary">Disponibilidad</p>
          {loading ? <LoadingSpinner /> : null}
        </div>
        <DayPicker
          mode="single"
          selected={selected}
          onSelect={setSelected}
          month={month}
          onMonthChange={setMonth}
          locale={es}
          showOutsideDays
          modifiers={modifiers}
          modifiersClassNames={{
            available: "bg-[color-mix(in_oklab,var(--success)_25%,transparent)] text-foreground",
            partial: "bg-[color-mix(in_oklab,var(--warning)_25%,transparent)] text-foreground",
            full: "bg-[color-mix(in_oklab,var(--danger)_25%,transparent)] text-foreground",
            closed: "text-foreground-tertiary line-through",
          }}
          className="m-0"
        />
        <div className="mt-4 flex flex-wrap gap-2 text-xs">
          <span className="inline-flex items-center gap-1.5">
            <span className="size-2.5 rounded-full bg-[var(--success)]" /> Disponible
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="size-2.5 rounded-full bg-[var(--warning)]" /> Parcial / pendiente
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="size-2.5 rounded-full bg-[var(--danger)]" /> Sin disponibilidad
          </span>
        </div>
      </Card>

      <Card className="p-6">
        <p className="text-xs uppercase tracking-wider text-foreground-tertiary">Día seleccionado</p>
        {selected ? (
          <>
            <p className="mt-1 font-display text-xl font-semibold">
              {format(selected, "EEEE d 'de' MMMM", { locale: es })}
            </p>
            <div className="mt-5 space-y-3">
              <BlockRow
                label="Bloque AM"
                time="08:00 – 14:00"
                state={
                  selectedDay
                    ? selectedDay.am.available
                      ? "AVAILABLE"
                      : selectedDay.am.pending
                      ? "PENDING"
                      : "TAKEN"
                    : "AVAILABLE"
                }
              />
              <BlockRow
                label="Bloque PM"
                time="14:00 – 20:00"
                state={
                  selectedDay
                    ? selectedDay.pm.available
                      ? "AVAILABLE"
                      : selectedDay.pm.pending
                      ? "PENDING"
                      : "TAKEN"
                    : "AVAILABLE"
                }
              />
            </div>
            <p className="mt-4 text-xs text-foreground-tertiary">
              Para reservar, ingresa con tu cuenta y selecciona el bloque.
            </p>
          </>
        ) : (
          <p className="mt-1 text-sm text-foreground-secondary">
            Selecciona un día para ver sus bloques.
          </p>
        )}
      </Card>
    </div>
  );
}

function BlockRow({ label, time, state }: { label: string; time: string; state: "AVAILABLE" | "PENDING" | "TAKEN" }) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-[var(--border)] p-3">
      <div>
        <p className="font-medium">{label}</p>
        <p className="text-xs text-foreground-secondary font-mono">{time}</p>
      </div>
      <Badge variant={state === "AVAILABLE" ? "success" : state === "PENDING" ? "warning" : "danger"}>
        {state === "AVAILABLE" ? "Disponible" : state === "PENDING" ? "Pendiente" : "Ocupado"}
      </Badge>
    </div>
  );
}
