"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ArrowDown, ArrowUp, Trash2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

interface Photo {
  id: string;
  url: string;
  alt: string | null;
  caption: string | null;
  order: number;
}

interface Props {
  officeId: string;
  photos: Photo[];
}

export function PhotoManager({ officeId, photos: initial }: Props) {
  const router = useRouter();
  const [photos, setPhotos] = useState<Photo[]>(initial);
  const [url, setUrl] = useState("");
  const [alt, setAlt] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function add() {
    if (!url) {
      toast.error("Pega una URL de imagen");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/admin/photos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ officeId, url, alt: alt || undefined }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json?.error?.message ?? "Error");
      setPhotos((prev) => [...prev, json.data]);
      setUrl("");
      setAlt("");
      toast.success("Foto agregada");
      router.refresh();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Error");
    } finally {
      setSubmitting(false);
    }
  }

  async function remove(id: string) {
    try {
      const res = await fetch(`/api/admin/photos?id=${id}`, { method: "DELETE" });
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json?.error?.message ?? "Error");
      setPhotos((prev) => prev.filter((p) => p.id !== id));
      toast.success("Foto eliminada");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Error");
    }
  }

  async function swap(idxA: number, idxB: number) {
    if (idxA < 0 || idxB < 0 || idxA >= photos.length || idxB >= photos.length) return;
    const next = [...photos];
    [next[idxA], next[idxB]] = [next[idxB], next[idxA]];
    setPhotos(next);
    try {
      const res = await fetch("/api/admin/photos", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: next.map((p) => p.id) }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json?.error?.message ?? "Error");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Error al reordenar");
      setPhotos(photos); // rollback
    }
  }

  return (
    <div className="space-y-4">
      <Card className="p-6">
        <div className="grid gap-4 sm:grid-cols-[2fr_2fr_auto] items-end">
          <div className="space-y-1.5">
            <Label htmlFor="ph-url">URL de imagen</Label>
            <Input
              id="ph-url"
              placeholder="https://..."
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="ph-alt">Descripción (alt)</Label>
            <Input id="ph-alt" placeholder="Sala de espera" value={alt} onChange={(e) => setAlt(e.target.value)} />
          </div>
          <Button onClick={add} disabled={submitting}>
            {submitting ? "..." : "Agregar foto"}
          </Button>
        </div>
        <p className="mt-3 text-xs text-foreground-tertiary">
          Sube las imágenes a un servicio de storage (Supabase, Imgur, S3) y pega la URL pública aquí.
        </p>
      </Card>

      {photos.length === 0 ? (
        <Card className="p-12 text-center text-foreground-secondary">
          Aún no hay fotos. Agrega la primera arriba.
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {photos.map((p, i) => (
            <Card key={p.id} className="overflow-hidden p-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={p.url} alt={p.alt ?? ""} className="w-full aspect-[4/3] object-cover" />
              <div className="p-3 flex items-center justify-between">
                <p className="text-sm font-medium truncate">{p.alt ?? "Sin descripción"}</p>
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label="Subir"
                    onClick={() => swap(i, i - 1)}
                    disabled={i === 0}
                  >
                    <ArrowUp className="size-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label="Bajar"
                    onClick={() => swap(i, i + 1)}
                    disabled={i === photos.length - 1}
                  >
                    <ArrowDown className="size-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label="Eliminar"
                    onClick={() => remove(p.id)}
                  >
                    <Trash2 className="size-4 text-[var(--danger)]" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
