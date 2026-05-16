"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DAYS_OF_WEEK } from "@/lib/constants";

interface PricingCell {
  dayOfWeek: number;
  price: number;
}

interface BlockData {
  id: string;
  label: string;
  type: "AM" | "PM";
  startTime: string;
  endTime: string;
  pricing: PricingCell[];
}

interface Props {
  blocks: BlockData[];
}

export function PricingEditor({ blocks: initial }: Props) {
  const router = useRouter();
  const [blocks, setBlocks] = useState(initial);
  const [savingKey, setSavingKey] = useState<string | null>(null);

  function getPrice(block: BlockData, dow: number) {
    return block.pricing.find((p) => p.dayOfWeek === dow)?.price ?? 0;
  }

  function setPrice(blockId: string, dow: number, price: number) {
    setBlocks((prev) =>
      prev.map((b) => {
        if (b.id !== blockId) return b;
        const others = b.pricing.filter((p) => p.dayOfWeek !== dow);
        return { ...b, pricing: [...others, { dayOfWeek: dow, price }] };
      }),
    );
  }

  async function save(block: BlockData, dow: number) {
    const key = `${block.id}-${dow}`;
    setSavingKey(key);
    try {
      const price = getPrice(block, dow);
      const res = await fetch("/api/admin/pricing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ blockId: block.id, dayOfWeek: dow, price }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json?.error?.message ?? "Error al guardar");
      toast.success(`${block.label} · ${DAYS_OF_WEEK[dow]} actualizado`);
      router.refresh();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Error al guardar");
    } finally {
      setSavingKey(null);
    }
  }

  return (
    <Card className="p-0 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-background-surface text-left">
            <tr>
              <th className="px-4 py-3 font-display font-semibold">Día</th>
              {blocks.map((b) => (
                <th key={b.id} className="px-4 py-3 font-display font-semibold">
                  {b.label}
                  <span className="block text-xs font-normal text-foreground-tertiary font-mono">
                    {b.startTime}–{b.endTime}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[1, 2, 3, 4, 5, 6, 0].map((dow) => (
              <tr key={dow} className="border-t border-[var(--border)]">
                <td className="px-4 py-3 font-medium capitalize">{DAYS_OF_WEEK[dow]}</td>
                {blocks.map((b) => {
                  const key = `${b.id}-${dow}`;
                  const value = getPrice(b, dow);
                  return (
                    <td key={b.id} className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Input
                          type="number"
                          min={0}
                          step={500}
                          value={value}
                          onChange={(e) =>
                            setPrice(b.id, dow, Number(e.target.value) || 0)
                          }
                          className="w-32 font-mono"
                        />
                        <Button
                          size="sm"
                          onClick={() => save(b, dow)}
                          disabled={savingKey === key}
                        >
                          {savingKey === key ? "..." : "Guardar"}
                        </Button>
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
