import { Hero } from "@/components/marketing/Hero";
import { BenefitsGrid } from "@/components/marketing/BenefitsGrid";
import { AmenitiesList } from "@/components/marketing/AmenitiesList";
import { PricingTable } from "@/components/marketing/PricingTable";
import { MapEmbed } from "@/components/marketing/MapEmbed";
import { ContactForm } from "@/components/marketing/ContactForm";
import { PhotoGallery } from "@/components/marketing/PhotoGallery";
import { prisma } from "@/infrastructure/database/prisma-client";
import { getLandingTexts } from "@/modules/site-config/site-config.service";

export const revalidate = 3600; // ISR: revalidate every hour

async function getOfficePhotos() {
  try {
    const photos = await prisma.photo.findMany({
      orderBy: { order: "asc" },
      take: 9,
    });
    return photos.map((p) => ({ url: p.url, alt: p.alt ?? "Oficina BLOQUE" }));
  } catch {
    return [];
  }
}

export default async function LandingPage() {
  const [photos, texts] = await Promise.all([getOfficePhotos(), getLandingTexts()]);

  return (
    <>
      <Hero title={texts.heroTitle} subtitle={texts.heroSubtitle} />
      <BenefitsGrid title={texts.benefitsTitle} />
      <AmenitiesList />

      <section id="galeria" className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
        <div className="mb-10 max-w-2xl">
          <p className="text-xs uppercase tracking-wider text-[var(--gold)]">Galería</p>
          <h2 className="mt-2 font-display text-3xl font-semibold tracking-tight sm:text-4xl">
            Espacios diseñados para trabajar.
          </h2>
        </div>
        <PhotoGallery photos={photos} />
      </section>

      <PricingTable />
      <MapEmbed />

      <section id="contacto" className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
        <div className="grid gap-12 lg:grid-cols-2">
          <div>
            <p className="text-xs uppercase tracking-wider text-[var(--gold)]">Contacto</p>
            <h2 className="mt-2 font-display text-3xl font-semibold tracking-tight sm:text-4xl">
              {texts.contactTitle}
            </h2>
            <p className="mt-3 max-w-md text-foreground-secondary">{texts.contactDescription}</p>
          </div>
          <div>
            <ContactForm />
          </div>
        </div>
      </section>
    </>
  );
}
