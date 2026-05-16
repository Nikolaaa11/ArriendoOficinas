import { redirect } from "next/navigation";
import { Sidebar } from "@/components/layout/Sidebar";
import { TopBar } from "@/components/layout/TopBar";
import { portalNav } from "@/config/navigation";
import { getSession } from "@/infrastructure/auth/auth.utils";

export default async function PortalLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  if (!session?.user) {
    redirect("/login?callbackUrl=/mi-cuenta");
  }
  return (
    <div className="flex min-h-screen">
      <Sidebar items={portalNav} title="Mi BLOQUE" />
      <div className="flex-1 flex flex-col">
        <TopBar user={session.user} />
        <div className="flex-1 p-6 lg:p-8 bg-background">{children}</div>
      </div>
    </div>
  );
}
