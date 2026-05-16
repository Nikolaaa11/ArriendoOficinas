import { prisma } from "@/infrastructure/database/prisma-client";

export interface LandingTexts {
  heroTitle: string;
  heroSubtitle: string;
  benefitsTitle: string;
  contactTitle: string;
  contactDescription: string;
}

export const DEFAULT_LANDING_TEXTS: LandingTexts = {
  heroTitle: "Tu oficina, a tu hora.",
  heroSubtitle:
    "Arrienda una oficina profesional por bloques AM o PM. Sin contratos largos, sin sobrecosto. Reserva en línea en menos de un minuto.",
  benefitsTitle: "Una oficina, sin las amarras de un arriendo tradicional.",
  contactTitle: "¿Tienes una duda? Conversemos.",
  contactDescription:
    "Cuéntanos qué necesitas y te respondemos en menos de 24 horas. También puedes escribirnos por WhatsApp para algo más rápido.",
};

const KEY = "landing.texts";

export async function getLandingTexts(): Promise<LandingTexts> {
  try {
    const row = await prisma.siteConfig.findUnique({ where: { key: KEY } });
    if (!row?.value) return DEFAULT_LANDING_TEXTS;
    const parsed = JSON.parse(row.value) as Partial<LandingTexts>;
    return { ...DEFAULT_LANDING_TEXTS, ...parsed };
  } catch {
    return DEFAULT_LANDING_TEXTS;
  }
}

export async function setLandingTexts(input: Partial<LandingTexts>) {
  const current = await getLandingTexts();
  const next = { ...current, ...input };
  await prisma.siteConfig.upsert({
    where: { key: KEY },
    create: { key: KEY, value: JSON.stringify(next) },
    update: { value: JSON.stringify(next) },
  });
  return next;
}
