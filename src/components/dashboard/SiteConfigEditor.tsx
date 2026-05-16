"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import type { LandingTexts } from "@/modules/site-config/site-config.service";

export function SiteConfigEditor({ initial }: { initial: LandingTexts }) {
  const router = useRouter();
  const [values, setValues] = useState<LandingTexts>(initial);
  const [saving, setSaving] = useState(false);

  function set<K extends keyof LandingTexts>(key: K, v: LandingTexts[K]) {
    setValues((prev) => ({ ...prev, [key]: v }));
  }

  async function save() {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/site-config", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json?.error?.message ?? "Error");
      toast.success("Textos actualizados");
      router.refresh();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Error al guardar");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Card className="p-6 space-y-5">
      <div className="space-y-1.5">
        <Label htmlFor="hero-title">Hero · título</Label>
        <Input
          id="hero-title"
          value={values.heroTitle}
          onChange={(e) => set("heroTitle", e.target.value)}
        />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="hero-sub">Hero · subtítulo</Label>
        <Textarea
          id="hero-sub"
          rows={3}
          value={values.heroSubtitle}
          onChange={(e) => set("heroSubtitle", e.target.value)}
        />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="benefits-title">Beneficios · título</Label>
        <Input
          id="benefits-title"
          value={values.benefitsTitle}
          onChange={(e) => set("benefitsTitle", e.target.value)}
        />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="contact-title">Contacto · título</Label>
        <Input
          id="contact-title"
          value={values.contactTitle}
          onChange={(e) => set("contactTitle", e.target.value)}
        />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="contact-desc">Contacto · descripción</Label>
        <Textarea
          id="contact-desc"
          rows={3}
          value={values.contactDescription}
          onChange={(e) => set("contactDescription", e.target.value)}
        />
      </div>
      <div>
        <Button onClick={save} disabled={saving}>
          {saving ? "Guardando..." : "Guardar textos"}
        </Button>
        <p className="text-xs text-foreground-tertiary mt-2">
          Los cambios se reflejan en la landing al refrescar (ISR cada hora).
        </p>
      </div>
    </Card>
  );
}
