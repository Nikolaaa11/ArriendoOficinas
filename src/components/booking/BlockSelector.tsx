"use client";

import { Sun, Moon } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatCurrency } from "@/lib/utils";

export interface BlockOption {
  id: string;
  type: "AM" | "PM";
  label: string;
  startTime: string;
  endTime: string;
  available: boolean;
  price: number | null;
}

interface Props {
  blocks: BlockOption[];
  selectedId: string | null;
  onChange(id: string): void;
}

export function BlockSelector({ blocks, selectedId, onChange }: Props) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {blocks.map((b) => {
        const Icon = b.type === "AM" ? Sun : Moon;
        const isSelected = b.id === selectedId;
        return (
          <button
            key={b.id}
            type="button"
            disabled={!b.available}
            onClick={() => onChange(b.id)}
            className={cn(
              "flex w-full items-center gap-4 rounded-xl border p-4 text-left transition-all",
              isSelected
                ? "border-accent bg-accent-muted shadow-sm"
                : "border-[var(--border)] bg-background-elevated hover:border-[var(--border-hover)]",
              !b.available && "opacity-50 cursor-not-allowed",
            )}
          >
            <div
              className={cn(
                "grid size-12 place-items-center rounded-lg",
                b.type === "AM"
                  ? "bg-[var(--gold-muted)] text-[var(--gold)]"
                  : "bg-accent-muted text-accent",
              )}
            >
              <Icon className="size-5" />
            </div>
            <div className="flex-1">
              <p className="font-display text-lg font-semibold">{b.label}</p>
              <p className="text-xs text-foreground-secondary font-mono">
                {b.startTime} – {b.endTime}
              </p>
            </div>
            <div className="text-right">
              {b.price !== null ? (
                <p className="font-mono text-sm font-semibold">{formatCurrency(b.price)}</p>
              ) : null}
              <p
                className={cn(
                  "text-xs",
                  b.available ? "text-[var(--success)]" : "text-[var(--danger)]",
                )}
              >
                {b.available ? "Disponible" : "Ocupado"}
              </p>
            </div>
          </button>
        );
      })}
    </div>
  );
}
