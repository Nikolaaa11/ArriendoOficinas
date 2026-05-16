export const BLOCK_TYPES = ["AM", "PM", "FULL"] as const;
export type BlockType = (typeof BLOCK_TYPES)[number];

export const BOOKING_STATUS = [
  "PENDING",
  "CONFIRMED",
  "CANCELLED",
  "COMPLETED",
  "NO_SHOW",
] as const;
export type BookingStatus = (typeof BOOKING_STATUS)[number];

export const PAYMENT_STATUS = [
  "PENDING",
  "PAID",
  "PARTIAL",
  "REFUNDED",
  "WAIVED",
] as const;
export type PaymentStatus = (typeof PAYMENT_STATUS)[number];

export const ROLES = ["SUPER_ADMIN", "ADMIN", "TENANT"] as const;
export type Role = (typeof ROLES)[number];

export const BOOKING_STATUS_LABEL: Record<BookingStatus, string> = {
  PENDING: "Pendiente",
  CONFIRMED: "Confirmada",
  CANCELLED: "Cancelada",
  COMPLETED: "Completada",
  NO_SHOW: "No asistió",
};

export const PAYMENT_STATUS_LABEL: Record<PaymentStatus, string> = {
  PENDING: "Pendiente",
  PAID: "Pagado",
  PARTIAL: "Parcial",
  REFUNDED: "Reembolsado",
  WAIVED: "Eximido",
};

export const DAYS_OF_WEEK = [
  "domingo",
  "lunes",
  "martes",
  "miércoles",
  "jueves",
  "viernes",
  "sábado",
] as const;
