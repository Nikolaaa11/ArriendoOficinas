import Link from "next/link";
import { PageHeader } from "@/components/shared/PageHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getSession } from "@/infrastructure/auth/auth.utils";
import { prisma } from "@/infrastructure/database/prisma-client";
import { CalendarDays, Clock, UserCog } from "lucide-react";

export const metadata = { title: "Mi cuenta" };

export default async function MiCuentaPage() {
  const session = await getSession();
  const userId = (session?.user as { id?: string } | undefined)?.id;

  let totalBookings = 0;
  let next: { date: Date; block: { label: string } } | null = null;
  if (userId) {
    try {
      totalBookings = await prisma.booking.count({ where: { userId } });
      next = await prisma.booking.findFirst({
        where: { userId, date: { gte: new Date() }, status: { in: ["PENDING", "CONFIRMED"] } },
        orderBy: { date: "asc" },
        include: { block: true },
      });
    } catch {
      /* DB not ready yet */
    }
  }

  return (
    <>
      <PageHeader
        title={`Hola, ${session?.user?.name ?? "bienvenido"}`}
        description="Aquí está tu actividad reciente y reservas."
      />
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader>
            <div className="grid size-10 place-items-center rounded-lg bg-accent-muted text-accent">
              <CalendarDays className="size-5" />
            </div>
            <CardTitle className="mt-3 text-base">Total de reservas</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-display text-3xl font-semibold">{totalBookings}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="grid size-10 place-items-center rounded-lg bg-[var(--gold-muted)] text-[var(--gold)]">
              <Clock className="size-5" />
            </div>
            <CardTitle className="mt-3 text-base">Próxima reserva</CardTitle>
          </CardHeader>
          <CardContent>
            {next ? (
              <p className="font-display text-lg font-semibold">
                {new Intl.DateTimeFormat("es-CL", { weekday: "long", day: "numeric", month: "long" }).format(next.date)}{" "}
                · {next.block.label}
              </p>
            ) : (
              <p className="text-sm text-foreground-secondary">Sin próximas reservas.</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="grid size-10 place-items-center rounded-lg bg-background-surface text-foreground">
              <UserCog className="size-5" />
            </div>
            <CardTitle className="mt-3 text-base">Perfil</CardTitle>
            <CardDescription>Actualiza tus datos y preferencias.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild variant="outline" size="sm">
              <Link href="/mi-cuenta/perfil">Editar perfil</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
