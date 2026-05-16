export const siteConfig = {
  name: "BLOQUE",
  tagline: "Tu oficina, a tu hora",
  description:
    "Arriendo de oficinas profesionales por bloques horarios AM y PM en Las Condes, Santiago. Reserva online en segundos.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  whatsapp: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "+56963037492",
  address: "Av. Manquehue Norte, Las Condes — Santiago",
  email: "reservas@bloque.cl",
  social: {
    instagram: "https://instagram.com/bloque.cl",
  },
  metro: "Metro Manquehue (Línea 1)",
  blocks: {
    am: { label: "Mañana", time: "08:00 – 14:00" },
    pm: { label: "Tarde", time: "14:00 – 20:00" },
  },
} as const;

export type SiteConfig = typeof siteConfig;
