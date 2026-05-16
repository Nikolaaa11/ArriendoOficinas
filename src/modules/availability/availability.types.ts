export type DayState = "AVAILABLE" | "PARTIAL" | "FULL" | "CLOSED";

export interface BlockSlot {
  available: boolean;
  pending: boolean;
}

export interface DayAvailability {
  date: string; // YYYY-MM-DD
  am: BlockSlot;
  pm: BlockSlot;
  state: DayState;
}
