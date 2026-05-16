import { redirect } from "next/navigation";
import { Sidebar } from "@/components/layout/Sidebar";
import { TopBar } from "@/components/layout/TopBar";
import { dashboardNav } from "@/config/navigation";
import { getSession } from "@/infrastructure/auth/auth.utils";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  const role = (session?.user as { role?: string } | undefined)?.role;
  if (!session?.user || (role !== "ADMIN" && role !== "SUPER_ADMIN")) {
    redirect("/login?callbackUrl=/dashboard");
  }
  return (
    <div className="flex min-h-screen">
      <Sidebar items={dashboardNav} title="BLOQUE Admin" />
      <div className="flex-1 flex flex-col">
        <TopBar user={session.user} />
        <div className="flex-1 p-6 lg:p-8 bg-background">{children}</div>
      </div>
    </div>
  );
}
