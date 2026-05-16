import { MessageCircle } from "lucide-react";
import { siteConfig } from "@/config/site";

export function WhatsAppButton() {
  const number = siteConfig.whatsapp.replace(/[^0-9]/g, "");
  const text = encodeURIComponent("Hola, me interesa arrendar la oficina.");
  return (
    <a
      href={`https://wa.me/${number}?text=${text}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Escribir por WhatsApp"
      className="fixed bottom-6 right-6 z-50 grid size-14 place-items-center rounded-full bg-[#25D366] text-white shadow-lg shadow-black/30 transition-transform hover:scale-110"
    >
      <MessageCircle className="size-7" />
    </a>
  );
}
