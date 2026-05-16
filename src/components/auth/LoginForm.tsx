"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { loginSchema, type LoginInput } from "@/lib/validators";

export function LoginForm() {
  const router = useRouter();
  const search = useSearchParams();
  const callbackUrl = search.get("callbackUrl") ?? "/mi-cuenta";

  const [submitting, setSubmitting] = useState(false);
  const form = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  async function onSubmit(values: LoginInput) {
    setSubmitting(true);
    const res = await signIn("credentials", {
      email: values.email,
      password: values.password,
      redirect: false,
    });
    setSubmitting(false);
    if (res?.error) {
      toast.error("Credenciales inválidas");
      return;
    }
    toast.success("¡Bienvenido!");
    router.push(callbackUrl);
    router.refresh();
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" placeholder="tu@correo.cl" {...form.register("email")} />
        {form.formState.errors.email ? (
          <p className="text-xs text-[var(--danger)]">{form.formState.errors.email.message}</p>
        ) : null}
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="password">Contraseña</Label>
        <Input id="password" type="password" placeholder="••••••••" {...form.register("password")} />
        {form.formState.errors.password ? (
          <p className="text-xs text-[var(--danger)]">{form.formState.errors.password.message}</p>
        ) : null}
      </div>
      <Button type="submit" disabled={submitting} className="w-full">
        {submitting ? "Ingresando..." : "Ingresar"}
      </Button>
    </form>
  );
}
