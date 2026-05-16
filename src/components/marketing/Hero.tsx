import Link from "next/link";
import { ArrowRight, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/config/site";

interface HeroProps {
  title?: string;
  subtitle?: string;
}

export function Hero({ title, subtitle }: HeroProps = {}) {
  // Split title on last space → first part regular, last word gradient
  const fullTitle = title ?? "Tu oficina, a tu hora.";
  const lastSpace = fullTitle.lastIndexOf(" ");
  const titleHead = lastSpace > 0 ? fullTitle.slice(0, lastSpace) : "";
  const titleTail = lastSpace > 0 ? fullTitle.slice(lastSpace + 1) : fullTitle;
  const sub =
    subtitle ??
    "Arrienda una oficina profesional por bloques AM o PM. Sin contratos largos, sin sobrecosto. Reserva en línea en menos de un minuto.";
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--accent-muted),_transparent_55%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_var(--gold-muted),_transparent_60%)]" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/30 to-background" />
      </div>

      <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-24 sm:px-6 lg:grid-cols-2 lg:py-32">
        <div className="flex flex-col gap-6">
          <span className="inline-flex w-fit items-center gap-2 rounded-full border border-[var(--border)] bg-background-elevated/60 px-3 py-1 text-xs text-foreground-secondary">
            <span className="size-1.5 rounded-full bg-[var(--gold)]" />
            Metro Manquehue · Las Condes
          </span>

          <h1 className="font-display text-4xl font-semibold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
            {titleHead ? (
              <>
                {titleHead}
                <br />
              </>
            ) : null}
            <span className="bg-gradient-to-r from-[var(--accent)] to-[var(--gold)] bg-clip-text text-transparent">
              {titleTail}
            </span>
          </h1>

          <p className="max-w-xl text-base text-foreground-secondary sm:text-lg">{sub}</p>

          <div className="flex flex-wrap gap-3">
            <Button size="lg" asChild>
              <Link href="/disponibilidad">
                Ver disponibilidad
                <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <a
                href={`https://wa.me/${siteConfig.whatsapp.replace(/[^0-9]/g, "")}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <MessageCircle className="size-4" /> WhatsApp
              </a>
            </Button>
          </div>

          <dl className="mt-4 grid grid-cols-3 gap-6 border-t border-[var(--border)] pt-6">
            <div>
              <dt className="text-xs text-foreground-tertiary uppercase tracking-wider">Bloques</dt>
              <dd className="mt-1 font-display text-2xl font-semibold">AM · PM</dd>
            </div>
            <div>
              <dt className="text-xs text-foreground-tertiary uppercase tracking-wider">Ubicación</dt>
              <dd className="mt-1 font-display text-2xl font-semibold">Premium</dd>
            </div>
            <div>
              <dt className="text-xs text-foreground-tertiary uppercase tracking-wider">Reserva</dt>
              <dd className="mt-1 font-display text-2xl font-semibold">Online</dd>
            </div>
          </dl>
        </div>

        <div className="relative">
          <div className="aspect-[4/5] w-full rounded-2xl border border-[var(--border)] bg-gradient-to-br from-background-elevated to-background-surface p-8 shadow-2xl shadow-black/20">
            <div className="h-full w-full rounded-xl border border-dashed border-[var(--border)] flex flex-col items-center justify-center text-center text-foreground-secondary">
              <p className="font-display text-sm uppercase tracking-wider">Foto principal</p>
              <p className="text-xs mt-2 max-w-xs">
                Reemplaza con la foto de tu oficina en <code>public/hero.jpg</code> y descomenta el Image abajo.
              </p>
            </div>
            {/* <Image fill src="/hero.jpg" alt="Oficina" className="object-cover rounded-xl" /> */}
          </div>
          <div className="absolute -bottom-6 -left-6 rounded-xl border border-[var(--border)] bg-background-elevated p-4 shadow-xl shadow-black/30">
            <p className="text-xs text-foreground-tertiary uppercase tracking-wider">Próximo bloque</p>
            <p className="mt-1 font-display text-lg font-semibold">Hoy · PM</p>
            <p className="text-sm text-[var(--success)]">Disponible</p>
          </div>
        </div>
      </div>
    </section>
  );
}
