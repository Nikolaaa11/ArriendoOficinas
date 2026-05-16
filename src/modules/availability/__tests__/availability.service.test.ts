import { describe, expect, it, vi, beforeEach } from "vitest";

// Mock the prisma module before importing the service
vi.mock("@/infrastructure/database/prisma-client", () => {
  return {
    prisma: {
      office: { findUnique: vi.fn(), findFirst: vi.fn() },
      booking: { findMany: vi.fn(), findFirst: vi.fn() },
      blockedDate: { findMany: vi.fn(), findFirst: vi.fn() },
      block: { findMany: vi.fn() },
    },
  };
});

import { prisma } from "@/infrastructure/database/prisma-client";
import { getAvailability, isBlockAvailable } from "../availability.service";

const officeId = "o1";

beforeEach(() => {
  vi.clearAllMocks();
});

describe("availability.getAvailability", () => {
  it("returns CLOSED for every Sunday", async () => {
    (prisma.office.findUnique as ReturnType<typeof vi.fn>).mockResolvedValue({
      id: officeId,
      createdAt: new Date(),
    });
    (prisma.booking.findMany as ReturnType<typeof vi.fn>).mockResolvedValue([]);
    (prisma.blockedDate.findMany as ReturnType<typeof vi.fn>).mockResolvedValue([]);
    (prisma.block.findMany as ReturnType<typeof vi.fn>).mockResolvedValue([
      { id: "am", type: "AM", isActive: true },
      { id: "pm", type: "PM", isActive: true },
    ]);

    const days = await getAvailability(officeId, "2026-06");
    // June 7 2026 is a Sunday → date string 2026-06-07
    const sunday = days.find((d) => d.date === "2026-06-07");
    expect(sunday?.state).toBe("CLOSED");
    expect(sunday?.am.available).toBe(false);
  });

  it("returns AVAILABLE for a weekday with no bookings", async () => {
    (prisma.office.findUnique as ReturnType<typeof vi.fn>).mockResolvedValue({
      id: officeId,
      createdAt: new Date(),
    });
    (prisma.booking.findMany as ReturnType<typeof vi.fn>).mockResolvedValue([]);
    (prisma.blockedDate.findMany as ReturnType<typeof vi.fn>).mockResolvedValue([]);
    (prisma.block.findMany as ReturnType<typeof vi.fn>).mockResolvedValue([
      { id: "am", type: "AM", isActive: true },
      { id: "pm", type: "PM", isActive: true },
    ]);
    const days = await getAvailability(officeId, "2026-06");
    // June 1 2026 is a Monday
    const monday = days.find((d) => d.date === "2026-06-01");
    expect(monday?.state).toBe("AVAILABLE");
    expect(monday?.am.available).toBe(true);
    expect(monday?.pm.available).toBe(true);
  });

  it("returns FULL when both AM and PM are CONFIRMED", async () => {
    (prisma.office.findUnique as ReturnType<typeof vi.fn>).mockResolvedValue({
      id: officeId,
      createdAt: new Date(),
    });
    (prisma.booking.findMany as ReturnType<typeof vi.fn>).mockResolvedValue([
      {
        blockId: "am",
        status: "CONFIRMED",
        date: new Date(2026, 5, 1),
        block: { id: "am", type: "AM" },
      },
      {
        blockId: "pm",
        status: "CONFIRMED",
        date: new Date(2026, 5, 1),
        block: { id: "pm", type: "PM" },
      },
    ]);
    (prisma.blockedDate.findMany as ReturnType<typeof vi.fn>).mockResolvedValue([]);
    (prisma.block.findMany as ReturnType<typeof vi.fn>).mockResolvedValue([
      { id: "am", type: "AM", isActive: true },
      { id: "pm", type: "PM", isActive: true },
    ]);
    const days = await getAvailability(officeId, "2026-06");
    const monday = days.find((d) => d.date === "2026-06-01");
    expect(monday?.state).toBe("FULL");
    expect(monday?.am.available).toBe(false);
    expect(monday?.pm.available).toBe(false);
  });

  it("returns CLOSED for an explicitly blocked date", async () => {
    (prisma.office.findUnique as ReturnType<typeof vi.fn>).mockResolvedValue({
      id: officeId,
      createdAt: new Date(),
    });
    (prisma.booking.findMany as ReturnType<typeof vi.fn>).mockResolvedValue([]);
    (prisma.blockedDate.findMany as ReturnType<typeof vi.fn>).mockResolvedValue([
      { date: new Date(2026, 5, 1) },
    ]);
    (prisma.block.findMany as ReturnType<typeof vi.fn>).mockResolvedValue([
      { id: "am", type: "AM", isActive: true },
      { id: "pm", type: "PM", isActive: true },
    ]);
    const days = await getAvailability(officeId, "2026-06");
    expect(days.find((d) => d.date === "2026-06-01")?.state).toBe("CLOSED");
  });
});

describe("availability.isBlockAvailable", () => {
  it("returns false when the date is in BlockedDate", async () => {
    (prisma.blockedDate.findFirst as ReturnType<typeof vi.fn>).mockResolvedValue({ id: "x" });
    (prisma.booking.findFirst as ReturnType<typeof vi.fn>).mockResolvedValue(null);
    const ok = await isBlockAvailable("o", "am", new Date(2026, 5, 1));
    expect(ok).toBe(false);
  });

  it("returns false when a PENDING or CONFIRMED booking exists", async () => {
    (prisma.blockedDate.findFirst as ReturnType<typeof vi.fn>).mockResolvedValue(null);
    (prisma.booking.findFirst as ReturnType<typeof vi.fn>).mockResolvedValue({ id: "b" });
    const ok = await isBlockAvailable("o", "am", new Date(2026, 5, 1));
    expect(ok).toBe(false);
  });

  it("returns true when no blocked date and no booking", async () => {
    (prisma.blockedDate.findFirst as ReturnType<typeof vi.fn>).mockResolvedValue(null);
    (prisma.booking.findFirst as ReturnType<typeof vi.fn>).mockResolvedValue(null);
    const ok = await isBlockAvailable("o", "am", new Date(2026, 5, 1));
    expect(ok).toBe(true);
  });
});
