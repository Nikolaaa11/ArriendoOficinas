import Link from "next/link";
import { Instagram, Mail, MapPin, Phone } from "lucide-react";
import { siteConfig } from "@/config/site";

export function Footer() {
  return (
    <footer className="border-t border-[var(--border)] bg-background-secondary">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="grid size-8 place-items-center rounded-md bg-accent text-accent-foreground font-display text-sm font-bold">
              B
            </span>
            <span className="font-display text-lg font-semibold">{siteConfig.name}</span>
          </div>
          <p className="mt-3 text-sm text-foreground-secondary max-w-xs">{siteConfig.tagline}.</p>
        </div>

        <div>
          <p className="font-display text-sm font-semibold mb-3">Producto</p>
          <ul className="space-y-2 text-sm text-foreground-secondary">
            <li><Link href="/disponibilidad" className="hover:text-foreground">Disponibilidad</Link></li>
            <li><Link href="/galeria" className="hover:text-foreground">Galería</Link></li>
            <li><Link href="/contacto" className="hover:text-foreground">Contacto</Link></li>
          </ul>
        </div>

        <div>
          <p className="font-display text-sm font-semibold mb-3">Cuenta</p>
          <ul className="space-y-2 text-sm text-foreground-secondary">
            <li><Link href="/login" className="hover:text-foreground">Ingresar</Link></li>
            <li><Link href="/register" className="hover:text-foreground">Crear cuenta</Link></li>
            <li><Link href="/mi-cuenta" className="hover:text-foreground">Mi cuenta</Link></li>
          </ul>
        </div>

        <div>
          <p className="font-display text-sm font-semibold mb-3">Contacto</p>
          <ul className="space-y-2 text-sm text-foreground-secondary">
            <li className="flex items-start gap-2">
              <MapPin className="size-4 mt-0.5 shrink-0" />
              <span>{siteConfig.address}</span>
            </li>
            <li className="flex items-center gap-2">
              <Phone className="size-4 shrink-0" />
              <a href={`https://wa.me/${siteConfig.whatsapp.replace(/[^0-9]/g, "")}`} className="hover:text-foreground">
                {siteConfig.whatsapp}
              </a>
            </li>
            <li className="flex items-center gap-2">
              <Mail className="size-4 shrink-0" />
              <a href={`mailto:${siteConfig.email}`} className="hover:text-foreground">
                {siteConfig.email}
              </a>
            </li>
            <li className="flex items-center gap-2">
              <Instagram className="size-4 shrink-0" />
              <a href={siteConfig.social.instagram} className="hover:text-foreground">@bloque.cl</a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-[var(--border)]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-foreground-secondary">
          <p>© {new Date().getFullYear()} {siteConfig.name}. Todos los derechos reservados.</p>
          <p>Diseñado en Santiago, Chile.</p>
        </div>
      </div>
    </footer>
  );
}
