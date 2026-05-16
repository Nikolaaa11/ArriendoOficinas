import type { Metadata } from "next";
import { PhotoGallery } from "@/components/marketing/PhotoGallery";
import { prisma } from "@/infrastructure/database/prisma-client";

export const metadata: Metadata = {
  title: "Galería",
  description: "Explora la oficina por dentro: espacios, amenidades y detalles.",
};

export const revalidate = 3600;

async function getPhotos() {
  try {
    const photos = await prisma.photo.findMany({ orderBy: { order: "asc" } });
    return photos.map((p) => ({ url: p.url, alt: p.alt ?? "Oficina BLOQUE" }));
  } catch {
    return [];
  }
}

export default async function GaleriaPage() {
  const photos = await getPhotos();
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
      <header className="mb-10">
        <p className="text-xs uppercase tracking-wider text-[var(--gold)]">Galería</p>
        <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight sm:text-4xl">
          Conoce el espacio.
        </h1>
      </header>
      <PhotoGallery photos={photos} />
    </section>
  );
}
