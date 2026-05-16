export type BookingError =
  | { code: "BLOCK_NOT_AVAILABLE"; message: string }
  | { code: "INVALID_DATE"; message: string }
  | { code: "BOOKING_NOT_FOUND"; message: string }
  | { code: "FORBIDDEN"; message: string }
  | { code: "INVALID_STATUS_TRANSITION"; message: string };

export const blockNotAvailable = (msg = "El bloque seleccionado no está disponible"): BookingError => ({
  code: "BLOCK_NOT_AVAILABLE",
  message: msg,
});
export const invalidDate = (msg = "Fecha inválida o en el pasado"): BookingError => ({
  code: "INVALID_DATE",
  message: msg,
});
export const bookingNotFound = (msg = "Reserva no encontrada"): BookingError => ({
  code: "BOOKING_NOT_FOUND",
  message: msg,
});
export const forbidden = (msg = "Sin permisos para esta acción"): BookingError => ({
  code: "FORBIDDEN",
  message: msg,
});
export const invalidStatusTransition = (
  msg = "Transición de estado no permitida",
): BookingError => ({ code: "INVALID_STATUS_TRANSITION", message: msg });
