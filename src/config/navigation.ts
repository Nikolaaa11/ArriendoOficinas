import type { LucideIcon } from "lucide-react";
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
} from "lucide-react";

export type NavItem = {
  label: string;
  href: string;
  icon?: LucideIcon;
};

export const marketingNav: NavItem[] = [
  { label: "Inicio", href: "/" },
  { label: "Disponibilidad", href: "/disponibilidad" },
  { label: "Galería", href: "/galeria" },
  { label: "Contacto", href: "/contacto" },
];

export const dashboardNav: NavItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Reservas", href: "/dashboard/reservas", icon: ClipboardList },
  { label: "Calendario", href: "/dashboard/calendario", icon: CalendarDays },
  { label: "Arrendatarios", href: "/dashboard/arrendatarios", icon: Users },
  { label: "Reportes", href: "/dashboard/reportes", icon: PieChart },
  { label: "Configuración", href: "/dashboard/configuracion", icon: Settings },
];

export const portalNav: NavItem[] = [
  { label: "Mi cuenta", href: "/mi-cuenta", icon: Home },
  { label: "Reservar", href: "/reservar", icon: CalendarPlus },
  { label: "Mis reservas", href: "/mi-cuenta/mis-reservas", icon: ClipboardList },
  { label: "Perfil", href: "/mi-cuenta/perfil", icon: User },
];
