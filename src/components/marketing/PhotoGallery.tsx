"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

export interface GalleryPhoto {
  url: string;
  alt: string;
}

interface Props {
  photos: GalleryPhoto[];
}

export function PhotoGallery({ photos }: Props) {
  const [open, setOpen] = useState<number | null>(null);

  if (photos.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-[var(--border)] p-12 text-center text-sm text-foreground-secondary">
        Pronto subiremos fotos.
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {photos.map((photo, i) => (
          <button
            type="button"
            key={photo.url + i}
            onClick={() => setOpen(i)}
            className={cn(
              "group relative overflow-hidden rounded-xl border border-[var(--border)] aspect-[4/3]",
              "transition-transform hover:-translate-y-0.5",
            )}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={photo.url}
              alt={photo.alt}
              className="size-full object-cover transition-transform group-hover:scale-105"
              loading="lazy"
            />
          </button>
        ))}
      </div>

      {open !== null ? (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 grid place-items-center bg-black/80 backdrop-blur-sm p-4"
          onClick={() => setOpen(null)}
        >
          <button
            type="button"
            className="absolute top-4 right-4 grid size-10 place-items-center rounded-full bg-background/80 text-foreground"
            onClick={() => setOpen(null)}
            aria-label="Cerrar"
          >
            <X />
          </button>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={photos[open].url}
            alt={photos[open].alt}
            className="max-h-full max-w-full rounded-xl"
          />
        </div>
      ) : null}
    </>
  );
}
