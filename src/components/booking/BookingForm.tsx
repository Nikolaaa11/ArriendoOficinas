"use client";

import "react-day-picker/style.css";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { DayPicker } from "react-day-picker";
import { es } from "date-fns/locale";
import { format } from "date-fns";
import { toast } from "sonner";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { BlockSelector, type BlockOption } from "./BlockSelector";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { cn, formatCurrency } from "@/lib/utils";

type Step = 1 | 2 | 3;

interface AvailabilityDay {
  date: string;
  am: { available: boolean; pending: boolean };
  pm: { available: boolean; pending: boolean };
  state: "AVAILABLE" | "PARTIAL" | "FULL" | "CLOSED";
}

interface OfficeBlock {
  id: string;
  type: "AM" | "PM";
  label: string;
  startTime: string;
  endTime: string;
  pricing: Array<{ dayOfWeek: number; price: number }>;
}

interface Props {
  blocks: OfficeBlock[];
}

export function BookingForm({ blocks }: Props) {
  const router = useRouter();
  const [step, setStep] = useState<Step>(1);
  const [month, setMonth] = useState<Date>(new Date());
  const [date, setDate] = useState<Date | undefined>();
  const [blockId, setBlockId] = useState<string | null>(null);
  const [notes, setNotes] = useState("");
  const [availability, setAvailability] = useState<AvailabilityDay[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      try {
        const monthStr = `${month.getFullYear()}-${String(month.getMonth() + 1).padStart(2, "0")}`;
        const res = await fetch(`/api/availability?month=${monthStr}`);
        const json = await res.json();
        if (!cancelled && json.success) setAvailability(json.data);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [month]);

  const availabilityByDate = useMemo(() => {
    const m = new Map<string, AvailabilityDay>();
    for (const a of availability) m.set(a.date, a);
    return m;
  }, [availability]);

  const modifiers = useMemo(() => {
    const closed: Date[] = [];
    const full: Date[] = [];
    const partial: Date[] = [];
    for (const a of availability) {
      const [y, mo, d] = a.date.split("-").map(Number);
      const dt = new Date(y, mo - 1, d);
      if (a.state === "CLOSED" || a.state === "FULL") {
        if (a.state === "CLOSED") closed.push(dt);
        else full.push(dt);
      } else if (a.state === "PARTIAL") partial.push(dt);
    }
    return { closed, full, partial };
  }, [availability]);

  const blockOptions: BlockOption[] = useMemo(() => {
    if (!date) return [];
    const dayKey = format(date, "yyyy-MM-dd");
    const a = availabilityByDate.get(dayKey);
    const dow = date.getDay();
    return blocks.map((b) => {
      const price = b.pricing.find((p) => p.dayOfWeek === dow)?.price ?? null;
      const available =
        a == null
          ? true
          : b.type === "AM"
          ? a.am.available
          : a.pm.available;
      return {
        id: b.id,
        type: b.type,
        label: b.label,
        startTime: b.startTime,
        endTime: b.endTime,
        available: a?.state === "CLOSED" ? false : available,
        price,
      };
    });
  }, [date, availabilityByDate, blocks]);

  const selectedBlock = blockOptions.find((b) => b.id === blockId);

  async function submit() {
    if (!date || !blockId) return;
    setSubmitting(true);
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          blockId,
          date: format(date, "yyyy-MM-dd"),
          notes: notes || undefined,
        }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json?.error?.message ?? "Error al crear reserva");
      }
      toast.success("¡Reserva creada!");
      router.push(`/mi-cuenta/reservas/${json.data.id}`);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Error al reservar");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Card className="p-6">
      <StepIndicator step={step} />

      <div className="mt-6">
        {step === 1 ? (
          <div>
            <p className="text-xs uppercase tracking-wider text-foreground-tertiary mb-2">
              Paso 1 — Elige la fecha
            </p>
            <div className="flex items-center justify-between mb-2">
              <p className="font-display text-lg font-semibold">¿Qué día necesitas la oficina?</p>
              {loading ? <LoadingSpinner /> : null}
            </div>
            <DayPicker
              mode="single"
              selected={date}
              onSelect={setDate}
              month={month}
              onMonthChange={setMonth}
              locale={es}
              disabled={[
                { before: new Date() },
                ...modifiers.closed.map((d) => ({ from: d, to: d })),
                ...modifiers.full.map((d) => ({ from: d, to: d })),
              ]}
              modifiersClassNames={{
                partial: "bg-[color-mix(in_oklab,var(--warning)_25%,transparent)]",
              }}
              modifiers={{ partial: modifiers.partial }}
            />
            <div className="mt-6 flex justify-end">
              <Button disabled={!date} onClick={() => setStep(2)}>
                Continuar <ArrowRight className="size-4" />
              </Button>
            </div>
          </div>
        ) : null}

        {step === 2 ? (
          <div>
            <p className="text-xs uppercase tracking-wider text-foreground-tertiary mb-2">
              Paso 2 — Elige el bloque
            </p>
            <p className="font-display text-lg font-semibold mb-4">
              {date ? format(date, "EEEE d 'de' MMMM", { locale: es }) : ""}
            </p>
            <BlockSelector blocks={blockOptions} selectedId={blockId} onChange={setBlockId} />
            <div className="mt-6 flex items-center justify-between">
              <Button variant="ghost" onClick={() => setStep(1)}>
                <ArrowLeft className="size-4" /> Volver
              </Button>
              <Button disabled={!blockId} onClick={() => setStep(3)}>
                Continuar <ArrowRight className="size-4" />
              </Button>
            </div>
          </div>
        ) : null}

        {step === 3 ? (
          <div>
            <p className="text-xs uppercase tracking-wider text-foreground-tertiary mb-2">
              Paso 3 — Revisa y confirma
            </p>
            <div className="space-y-4">
              <SummaryRow label="Fecha" value={date ? format(date, "EEEE d 'de' MMMM yyyy", { locale: es }) : "—"} />
              <SummaryRow label="Bloque" value={selectedBlock ? `${selectedBlock.label} (${selectedBlock.startTime}–${selectedBlock.endTime})` : "—"} />
              <SummaryRow label="Precio" value={selectedBlock?.price ? formatCurrency(selectedBlock.price) : "—"} mono />
              <div className="space-y-1.5">
                <Label htmlFor="notes">Notas (opcional)</Label>
                <Textarea
                  id="notes"
                  placeholder="¿Algo que debamos saber?"
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>
            </div>
            <div className="mt-6 flex items-center justify-between">
              <Button variant="ghost" onClick={() => setStep(2)} disabled={submitting}>
                <ArrowLeft className="size-4" /> Volver
              </Button>
              <Button onClick={submit} disabled={submitting}>
                {submitting ? "Reservando..." : <>Confirmar reserva <Check className="size-4" /></>}
              </Button>
            </div>
          </div>
        ) : null}
      </div>
    </Card>
  );
}

function StepIndicator({ step }: { step: Step }) {
  const steps = ["Fecha", "Bloque", "Confirmar"];
  return (
    <ol className="flex items-center gap-2">
      {steps.map((label, i) => {
        const n = (i + 1) as Step;
        const done = step > n;
        const active = step === n;
        return (
          <li key={label} className="flex items-center gap-2">
            <span
              className={cn(
                "grid size-7 place-items-center rounded-full text-xs font-medium border",
                active
                  ? "border-accent bg-accent text-accent-foreground"
                  : done
                  ? "border-[var(--success)] bg-[var(--success)] text-background"
                  : "border-[var(--border)] text-foreground-secondary",
              )}
            >
              {done ? <Check className="size-4" /> : n}
            </span>
            <span
              className={cn(
                "text-sm",
                active ? "text-foreground font-medium" : "text-foreground-secondary",
              )}
            >
              {label}
            </span>
            {i < steps.length - 1 ? (
              <span className="mx-2 h-px w-6 bg-[var(--border)]" />
            ) : null}
          </li>
        );
      })}
    </ol>
  );
}

function SummaryRow({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-[var(--border)] p-4">
      <span className="text-sm text-foreground-secondary">{label}</span>
      <span className={cn("font-medium", mono && "font-mono")}>{value}</span>
    </div>
  );
}
