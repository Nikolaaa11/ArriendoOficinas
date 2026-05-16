"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { contactFormSchema, type ContactFormInput } from "@/lib/validators";

export function ContactForm() {
  const [submitting, setSubmitting] = useState(false);
  const form = useForm<ContactFormInput>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: { name: "", email: "", phone: "", message: "" },
  });

  async function onSubmit(values: ContactFormInput) {
    setSubmitting(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json?.error?.message ?? "Error al enviar");
      toast.success("¡Mensaje enviado! Te contactaremos a la brevedad.");
      form.reset();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "No se pudo enviar el mensaje");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="name">Nombre</Label>
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
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="phone">Teléfono (opcional)</Label>
        <Input id="phone" placeholder="+56 9 ..." {...form.register("phone")} />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="message">Mensaje</Label>
        <Textarea id="message" placeholder="Cuéntanos qué buscas..." rows={5} {...form.register("message")} />
        {form.formState.errors.message ? (
          <p className="text-xs text-[var(--danger)]">{form.formState.errors.message.message}</p>
        ) : null}
      </div>
      <Button type="submit" disabled={submitting} size="lg">
        {submitting ? "Enviando..." : "Enviar mensaje"}
      </Button>
    </form>
  );
}
