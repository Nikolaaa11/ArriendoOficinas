import Link from "next/link";
import { ThemeToggle } from "@/components/shared/ThemeToggle";
import { Button } from "@/components/ui/button";

interface Props {
  user?: { name?: string | null; email?: string | null } | null;
}

export function TopBar({ user }: Props) {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-[var(--border)] bg-background/80 px-4 backdrop-blur-xl sm:px-6">
      <div className="md:hidden">
        <Link href="/" className="font-display font-semibold">BLOQUE</Link>
      </div>
      <div className="ml-auto flex items-center gap-3">
        <ThemeToggle />
        {user ? (
          <div className="hidden sm:flex flex-col text-right">
            <span className="text-sm font-medium leading-tight">{user.name ?? user.email}</span>
            <span className="text-xs text-foreground-secondary leading-tight">{user.email}</span>
          </div>
        ) : (
          <Button variant="ghost" size="sm" asChild>
            <Link href="/login">Ingresar</Link>
          </Button>
        )}
      </div>
    </header>
  );
}
