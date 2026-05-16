import type { Metadata } from "next";
import { Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { ContactForm } from "@/components/marketing/ContactForm";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Contacto",
  description: "Escríbenos por formulario o WhatsApp. Respondemos en menos de 24 horas.",
};

export default function ContactoPage() {
  const wpp = siteConfig.whatsapp.replace(/[^0-9]/g, "");
  return (
    <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <header className="mb-10">
        <p className="text-xs uppercase tracking-wider text-[var(--gold)]">Contacto</p>
        <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight sm:text-4xl">
          Hablemos.
        </h1>
        <p className="mt-3 max-w-2xl text-foreground-secondary">
          Cuéntanos lo que buscas y te respondemos rápido. Si prefieres, escríbenos directo por WhatsApp.
        </p>
      </header>

      <div className="grid gap-10 lg:grid-cols-2">
        <ContactForm />

        <div className="space-y-5 text-sm">
          <div className="flex items-start gap-3">
            <MapPin className="size-5 text-accent shrink-0 mt-0.5" />
            <div>
              <p className="font-medium">Ubicación</p>
              <p className="text-foreground-secondary">{siteConfig.address}</p>
              <p className="text-foreground-tertiary text-xs mt-0.5">{siteConfig.metro}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Phone className="size-5 text-accent shrink-0 mt-0.5" />
            <div>
              <p className="font-medium">Teléfono</p>
              <p className="text-foreground-secondary">{siteConfig.whatsapp}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Mail className="size-5 text-accent shrink-0 mt-0.5" />
            <div>
              <p className="font-medium">Email</p>
              <a href={`mailto:${siteConfig.email}`} className="text-foreground-secondary hover:text-foreground">
                {siteConfig.email}
              </a>
            </div>
          </div>
          <a
            href={`https://wa.me/${wpp}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-lg bg-[#25D366] px-4 py-2.5 text-white font-medium"
          >
            <MessageCircle className="size-4" /> Escribir por WhatsApp
          </a>
        </div>
      </div>
    </section>
  );
}
