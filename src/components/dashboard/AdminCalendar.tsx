"use client";

import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface BookingItem {
  id: string;
  code: string;
  date: string; // ISO yyyy-mm-dd
  blockType: "AM" | "PM";
  status: string;
  userName: string;
}

interface Props {
  bookings: BookingItem[];
}

const MONTH_LABELS = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre",
];
const DOW_LABELS = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];

function pad(n: number) {
  return String(n).padStart(2, "0");
}

const STATUS_COLOR: Record<string, string> = {
  PENDING: "bg-[color-mix(in_oklab,var(--warning)_25%,transparent)] text-[var(--warning)] border-[var(--warning)]/30",
  CONFIRMED: "bg-[color-mix(in_oklab,var(--success)_25%,transparent)] text-[var(--success)] border-[var(--success)]/30",
  CANCELLED: "bg-[color-mix(in_oklab,var(--danger)_15%,transparent)] text-[var(--danger)] line-through",
  COMPLETED: "bg-background-surface text-foreground-secondary",
  NO_SHOW: "bg-[color-mix(in_oklab,var(--danger)_15%,transparent)] text-[var(--danger)]",
};

export function AdminCalendar({ bookings }: Props) {
  const [cursor, setCursor] = useState(() => new Date());

  const year = cursor.getFullYear();
  const month = cursor.getMonth();

  const grid = useMemo(() => {
    const first = new Date(year, month, 1);
    const last = new Date(year, month + 1, 0);
    // Start from Monday
    const startDow = (first.getDay() + 6) % 7;
    const days: Array<{ date: Date; inMonth: boolean }> = [];
    for (let i = 0; i < startDow; i++) {
      const d = new Date(year, month, 1 - (startDow - i));
      days.push({ date: d, inMonth: false });
    }
    for (let d = 1; d <= last.getDate(); d++) {
      days.push({ date: new Date(year, month, d), inMonth: true });
    }
    while (days.length % 7 !== 0) {
      const lastD = days[days.length - 1].date;
      days.push({
        date: new Date(lastD.getFullYear(), lastD.getMonth(), lastD.getDate() + 1),
        inMonth: false,
      });
    }
    return days;
  }, [year, month]);

  const bookingsByDate = useMemo(() => {
    const m = new Map<string, BookingItem[]>();
    for (const b of bookings) {
      const arr = m.get(b.date) ?? [];
      arr.push(b);
      m.set(b.date, arr);
    }
    return m;
  }, [bookings]);

  return (
    <Card className="p-0 overflow-hidden">
      <div className="flex items-center justify-between border-b border-[var(--border)] p-4">
        <p className="font-display text-lg font-semibold">
          {MONTH_LABELS[month]} {year}
        </p>
        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setCursor(new Date(year, month - 1, 1))}
            aria-label="Mes anterior"
          >
            <ChevronLeft className="size-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={() => setCursor(new Date())}>
            Hoy
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setCursor(new Date(year, month + 1, 1))}
            aria-label="Mes siguiente"
          >
            <ChevronRight className="size-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-7 border-b border-[var(--border)] bg-background-surface">
        {DOW_LABELS.map((d) => (
          <div key={d} className="px-2 py-2 text-xs text-foreground-secondary text-center uppercase tracking-wider">
            {d}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7">
        {grid.map((cell, idx) => {
          const key = `${cell.date.getFullYear()}-${pad(cell.date.getMonth() + 1)}-${pad(cell.date.getDate())}`;
          const cellBookings = bookingsByDate.get(key) ?? [];
          const isToday =
            new Date().toDateString() === cell.date.toDateString();
          return (
            <div
              key={idx}
              className={cn(
                "border-b border-r border-[var(--border)] min-h-[100px] p-1.5 text-xs",
                !cell.inMonth && "bg-background-surface opacity-50",
                isToday && "bg-accent-muted",
              )}
            >
              <p className={cn("text-foreground-secondary mb-1", isToday && "text-accent font-semibold")}>
                {cell.date.getDate()}
              </p>
              <div className="space-y-1">
                {cellBookings.slice(0, 3).map((b) => (
                  <div
                    key={b.id}
                    className={cn(
                      "rounded px-1.5 py-0.5 text-[10px] border truncate",
                      STATUS_COLOR[b.status] ?? "bg-background-surface",
                    )}
                    title={`${b.code} · ${b.userName}`}
                  >
                    {b.blockType} · {b.userName.split(" ")[0]}
                  </div>
                ))}
                {cellBookings.length > 3 ? (
                  <p className="text-foreground-tertiary text-[10px] px-1.5">+{cellBookings.length - 3} más</p>
                ) : null}
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
