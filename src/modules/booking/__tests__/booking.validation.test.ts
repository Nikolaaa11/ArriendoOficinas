import { describe, expect, it } from "vitest";
import { createBookingSchema, cancelBookingSchema } from "../booking.validation";

describe("booking validation", () => {
  it("accepts a valid create booking payload", () => {
    const parsed = createBookingSchema.safeParse({
      blockId: "block-am-seed",
      date: "2026-06-01",
    });
    expect(parsed.success).toBe(true);
  });

  it("rejects invalid date format", () => {
    const parsed = createBookingSchema.safeParse({ blockId: "x", date: "01/06/2026" });
    expect(parsed.success).toBe(false);
  });

  it("rejects empty cancel reason", () => {
    const parsed = cancelBookingSchema.safeParse({ reason: "" });
    expect(parsed.success).toBe(false);
  });

  it("accepts cancel with valid reason", () => {
    const parsed = cancelBookingSchema.safeParse({ reason: "Cambio de planes" });
    expect(parsed.success).toBe(true);
  });
});
