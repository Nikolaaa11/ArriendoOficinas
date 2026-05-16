import { format, parseISO, startOfDay } from "date-fns";
import { es } from "date-fns/locale";

export function formatDate(date: Date | string, fmt = "PPP") {
  const d = typeof date === "string" ? parseISO(date) : date;
  return format(d, fmt, { locale: es });
}

export function formatShortDate(date: Date | string) {
  return formatDate(date, "dd/MM/yyyy");
}

export function formatDateLong(date: Date | string) {
  return formatDate(date, "EEEE d 'de' MMMM, yyyy");
}

export function dateOnly(date: Date) {
  return startOfDay(date);
}
