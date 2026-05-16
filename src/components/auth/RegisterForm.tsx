"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { registerSchema, type RegisterInput } from "@/lib/validators";

export function RegisterForm() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const form = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: "", email: "", password: "", phone: "", profession: "", company: "" },
  });

  async function onSubmit(values: RegisterInput) {
    setSubmitting(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json?.error?.message ?? "Error al registrarse");
      const sign = await signIn("credentials", {
        email: values.email,
        password: values.password,
        redirect: false,
      });
      if (sign?.error) throw new Error("Error al iniciar sesión");
      toast.success("¡Bienvenido!");
      router.push("/mi-cuenta");
      router.refresh();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Error al registrarse");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="name">Nombre completo</Label>
        <Input id="name" placeholder="Tu nombre" {...form.register("name")} />
        {form.formState.errors.name ? (
          <p className="text-xs text-[var(--danger)]">{form.formState.errors.name.message}</p>
        ) : null}
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" placeholder="tu@correo.cl" {...form.register("email")} />
        {form.formState.errors.email ? (
          <p className="text-xs text-[var(--danger)]">{form.formState.errors.email.message}</p>
        ) : null}
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="password">Contraseña</Label>
        <Input id="password" type="password" placeholder="Mínimo 8 caracteres" {...form.register("password")} />
        {form.formState.errors.password ? (
          <p className="text-xs text-[var(--danger)]">{form.formState.errors.password.message}</p>
        ) : null}
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="phone">Teléfono</Label>
          <Input id="phone" placeholder="+56 9 ..." {...form.register("phone")} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="profession">Profesión</Label>
          <Input id="profession" placeholder="Abogado, médico..." {...form.register("profession")} />
        </div>
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="company">Empresa (opcional)</Label>
        <Input id="company" placeholder="Nombre de tu empresa" {...form.register("company")} />
      </div>
      <Button type="submit" disabled={submitting} className="w-full">
        {submitting ? "Creando cuenta..." : "Crear cuenta"}
      </Button>
    </form>
  );
}
