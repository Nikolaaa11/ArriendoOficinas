import Link from "next/link";
import { PageHeader } from "@/components/shared/PageHeader";
import { EmptyState } from "@/components/shared/EmptyState";
import { Card } from "@/components/ui/card";
import { Users, MessageCircle, ChevronRight } from "lucide-react";
import { prisma } from "@/infrastructure/database/prisma-client";
import { formatShortDate } from "@/lib/dates";

export const metadata = { title: "Arrendatarios" };
export const dynamic = "force-dynamic";

export default async function ArrendatariosPage() {
  const tenants = await prisma.user.findMany({
    where: { role: "TENANT" },
    include: {
      bookings: {
        orderBy: { date: "desc" },
        take: 1,
        select: { date: true },
      },
      _count: { select: { bookings: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <>
      <PageHeader title="Arrendatarios" description="Historial y contacto rápido." />
      {tenants.length === 0 ? (
        <EmptyState icon={Users} title="Sin arrendatarios" description="Cuando registren su primera cuenta, aparecerán aquí." />
      ) : (
        <Card className="p-0 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-background-surface text-left">
                <tr>
                  <th className="px-4 py-3 font-display font-semibold">Nombre</th>
                  <th className="px-4 py-3 font-display font-semibold">Contacto</th>
                  <th className="px-4 py-3 font-display font-semibold">Profesión / empresa</th>
                  <th className="px-4 py-3 font-display font-semibold text-center">Reservas</th>
                  <th className="px-4 py-3 font-display font-semibold">Última reserva</th>
                  <th className="px-4 py-3 font-display font-semibold"></th>
                </tr>
              </thead>
              <tbody>
                {tenants.map((t) => (
                  <tr key={t.id} className="border-t border-[var(--border)]">
                    <td className="px-4 py-3 font-medium">{t.name}</td>
                    <td className="px-4 py-3">
                      <p>{t.email}</p>
                      {t.phone ? (
                        <p className="text-xs text-foreground-secondary">{t.phone}</p>
                      ) : null}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      {t.profession ? <p>{t.profession}</p> : null}
                      {t.company ? (
                        <p className="text-xs text-foreground-secondary">{t.company}</p>
                      ) : null}
                    </td>
                    <td className="px-4 py-3 text-center font-mono">{t._count.bookings}</td>
                    <td className="px-4 py-3">
                      {t.bookings[0]?.date ? formatShortDate(t.bookings[0].date) : "—"}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="inline-flex items-center gap-2">
                        {t.phone ? (
                          <a
                            href={`https://wa.me/${t.phone.replace(/[^0-9]/g, "")}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 rounded-md border border-[var(--border)] px-2 py-1 text-xs hover:bg-background-surface"
                          >
                            <MessageCircle className="size-3.5" /> WhatsApp
                          </a>
                        ) : null}
                        <Link
                          href={`/dashboard/arrendatarios/${t.id}`}
                          className="inline-flex items-center gap-1 rounded-md border border-[var(--border)] px-2 py-1 text-xs hover:bg-background-surface"
                        >
                          Ver <ChevronRight className="size-3.5" />
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </>
  );
}
