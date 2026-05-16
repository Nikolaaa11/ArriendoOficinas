"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const schema = z.object({
  name: z.string().min(2, "Mínimo 2 caracteres"),
  phone: z.string().regex(/^\+?[0-9\s-]{8,15}$/u, "Teléfono inválido").or(z.literal("")),
  profession: z.string().optional(),
  company: z.string().optional(),
  rut: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

interface Props {
  initial: {
    name: string;
    email: string;
    phone?: string | null;
    profession?: string | null;
    company?: string | null;
    rut?: string | null;
  };
}

export function ProfileForm({ initial }: Props) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: initial.name,
      phone: initial.phone ?? "",
      profession: initial.profession ?? "",
      company: initial.company ?? "",
      rut: initial.rut ?? "",
    },
  });

  async function onSubmit(values: FormValues) {
    setSubmitting(true);
    try {
      const res = await fetch("/api/me", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json?.error?.message ?? "Error");
      toast.success("Perfil actualizado");
      router.refresh();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Error al guardar");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Card className="p-6">
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="email">Email</Label>
          <Input id="email" value={initial.email} disabled />
          <p className="text-xs text-foreground-tertiary">El email no se puede cambiar.</p>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="name">Nombre completo</Label>
          <Input id="name" {...form.register("name")} />
          {form.formState.errors.name ? (
            <p className="text-xs text-[var(--danger)]">{form.formState.errors.name.message}</p>
          ) : null}
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="phone">Teléfono</Label>
            <Input id="phone" placeholder="+56 9 ..." {...form.register("phone")} />
            {form.formState.errors.phone ? (
              <p className="text-xs text-[var(--danger)]">{form.formState.errors.phone.message}</p>
            ) : null}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="rut">RUT</Label>
            <Input id="rut" placeholder="12.345.678-9" {...form.register("rut")} />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="profession">Profesión</Label>
            <Input id="profession" placeholder="Abogado, contador..." {...form.register("profession")} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="company">Empresa</Label>
            <Input id="company" placeholder="Nombre de tu empresa" {...form.register("company")} />
          </div>
        </div>

        <div className="pt-2">
          <Button type="submit" disabled={submitting}>
            {submitting ? "Guardando..." : "Guardar cambios"}
          </Button>
        </div>
      </form>
    </Card>
  );
}
