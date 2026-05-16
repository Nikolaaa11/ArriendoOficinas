import { describe, expect, it } from "vitest";
import { rateLimit } from "../rate-limit";

describe("rateLimit", () => {
  it("allows up to `max` calls and then denies", () => {
    const key = `test-allow-${Math.random()}`;
    const opts = { windowMs: 60_000, max: 3 };
    expect(rateLimit(key, opts).ok).toBe(true);
    expect(rateLimit(key, opts).ok).toBe(true);
    expect(rateLimit(key, opts).ok).toBe(true);
    expect(rateLimit(key, opts).ok).toBe(false);
  });

  it("uses independent buckets per key", () => {
    const opts = { windowMs: 60_000, max: 1 };
    expect(rateLimit("k1", opts).ok).toBe(true);
    expect(rateLimit("k2", opts).ok).toBe(true);
    expect(rateLimit("k1", opts).ok).toBe(false);
  });
});
