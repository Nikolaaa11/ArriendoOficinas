"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { formatDateLong } from "@/lib/dates";

interface BlockedRow {
  id: string;
  date: string;
  reason: string | null;
}

interface Props {
  officeId: string;
  blocked: BlockedRow[];
}

export function BlockedDatesManager({ officeId, blocked: initial }: Props) {
  const router = useRouter();
  const [date, setDate] = useState("");
  const [reason, setReason] = useState("");
  const [items, setItems] = useState(initial);
  const [submitting, setSubmitting] = useState(false);

  async function add() {
    if (!date) {
      toast.error("Elige una fecha");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/admin/blocked-dates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ officeId, date, reason: reason || undefined }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json?.error?.message ?? "Error");
      toast.success("Fecha bloqueada");
      setDate("");
      setReason("");
      router.refresh();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Error");
    } finally {
      setSubmitting(false);
    }
  }

  async function remove(id: string) {
    try {
      const res = await fetch(`/api/admin/blocked-dates?id=${id}`, { method: "DELETE" });
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json?.error?.message ?? "Error");
      setItems((prev) => prev.filter((b) => b.id !== id));
      toast.success("Fecha desbloqueada");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Error");
    }
  }

  return (
    <div className="space-y-4">
      <Card className="p-6">
        <div className="grid gap-4 sm:grid-cols-[1fr_2fr_auto] items-end">
          <div className="space-y-1.5">
            <Label htmlFor="bd-date">Fecha</Label>
            <Input id="bd-date" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="bd-reason">Motivo (opcional)</Label>
            <Input
              id="bd-reason"
              placeholder="Feriado, mantención..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />
          </div>
          <Button onClick={add} disabled={submitting}>
            {submitting ? "..." : "Bloquear fecha"}
          </Button>
        </div>
      </Card>

      <Card className="p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-background-surface text-left">
              <tr>
                <th className="px-4 py-3 font-display font-semibold">Fecha</th>
                <th className="px-4 py-3 font-display font-semibold">Motivo</th>
                <th className="px-4 py-3 font-display font-semibold text-right"></th>
              </tr>
            </thead>
            <tbody>
              {items.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-4 py-10 text-center text-foreground-secondary">
                    No hay fechas bloqueadas.
                  </td>
                </tr>
              ) : (
                items.map((b) => (
                  <tr key={b.id} className="border-t border-[var(--border)]">
                    <td className="px-4 py-3">{formatDateLong(b.date)}</td>
                    <td className="px-4 py-3 text-foreground-secondary">
                      {b.reason ?? "—"}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Button variant="ghost" size="icon" onClick={() => remove(b.id)} aria-label="Eliminar">
                        <Trash2 className="size-4 text-[var(--danger)]" />
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
