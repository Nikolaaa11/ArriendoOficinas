"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  CalendarDays,
  CalendarPlus,
  ClipboardList,
  Home,
  LayoutDashboard,
  PieChart,
  Settings,
  User,
  Users,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { siteConfig } from "@/config/site";
import type { NavIconName, NavItem } from "@/config/navigation";

const ICONS: Record<NavIconName, LucideIcon> = {
  Home,
  LayoutDashboard,
  ClipboardList,
  CalendarDays,
  CalendarPlus,
  Users,
  PieChart,
  Settings,
  User,
};

interface Props {
  items: NavItem[];
  title?: string;
}

export function Sidebar({ items, title = "BLOQUE" }: Props) {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex w-64 shrink-0 flex-col border-r border-[var(--border)] bg-background-secondary">
      <div className="flex h-16 items-center gap-2 border-b border-[var(--border)] px-6">
        <Link href="/" className="flex items-center gap-2">
          <span className="grid size-8 place-items-center rounded-md bg-accent text-accent-foreground font-display text-sm font-bold">
            B
          </span>
          <span className="font-display text-base font-semibold">{title}</span>
        </Link>
      </div>

      <nav className="flex-1 overflow-y-auto p-3">
        <ul className="space-y-1">
          {items.map((item) => {
            const Icon = item.icon ? ICONS[item.icon] : null;
            const active =
              pathname === item.href ||
              (item.href !== "/" && pathname?.startsWith(item.href));
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-2.5 rounded-md px-3 py-2 text-sm transition-colors",
                    active
                      ? "bg-accent-muted text-accent font-medium"
                      : "text-foreground-secondary hover:bg-background-surface hover:text-foreground",
                  )}
                >
                  {Icon ? <Icon className="size-4" /> : null}
                  <span>{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="border-t border-[var(--border)] p-4 text-xs text-foreground-tertiary">
        <p>{siteConfig.name} v0.1</p>
      </div>
    </aside>
  );
}
