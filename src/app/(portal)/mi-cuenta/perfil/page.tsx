import { redirect } from "next/navigation";
import { PageHeader } from "@/components/shared/PageHeader";
import { ProfileForm } from "@/components/portal/ProfileForm";
import { getSession } from "@/infrastructure/auth/auth.utils";
import { prisma } from "@/infrastructure/database/prisma-client";

export const metadata = { title: "Perfil" };
export const dynamic = "force-dynamic";

export default async function PerfilPage() {
  const session = await getSession();
  const userId = (session?.user as { id?: string } | undefined)?.id;
  if (!userId) redirect("/login");

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      name: true,
      email: true,
      phone: true,
      profession: true,
      company: true,
      rut: true,
    },
  });

  if (!user) redirect("/login");

  return (
    <>
      <PageHeader title="Perfil" description="Datos personales y profesionales." />
      <div className="max-w-2xl">
        <ProfileForm initial={user} />
      </div>
    </>
  );
}
