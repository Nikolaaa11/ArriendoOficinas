// Rate limiter en memoria (token bucket) por IP+key.
// Suficiente para single-server. En producción con múltiples instancias,
// usar Upstash Ratelimit con Redis.

interface Bucket {
  tokens: number;
  lastRefill: number;
}

const buckets = new Map<string, Bucket>();

interface Options {
  windowMs: number;
  max: number; // tokens por ventana
}

export function rateLimit(key: string, opts: Options): { ok: boolean; remaining: number; resetMs: number } {
  const now = Date.now();
  const bucket = buckets.get(key) ?? { tokens: opts.max, lastRefill: now };

  const elapsed = now - bucket.lastRefill;
  if (elapsed >= opts.windowMs) {
    bucket.tokens = opts.max;
    bucket.lastRefill = now;
  } else {
    // partial refill proportional to elapsed time
    const refill = Math.floor((elapsed / opts.windowMs) * opts.max);
    if (refill > 0) {
      bucket.tokens = Math.min(opts.max, bucket.tokens + refill);
      bucket.lastRefill = now;
    }
  }

  if (bucket.tokens <= 0) {
    buckets.set(key, bucket);
    return { ok: false, remaining: 0, resetMs: opts.windowMs - elapsed };
  }
  bucket.tokens -= 1;
  buckets.set(key, bucket);
  return { ok: true, remaining: bucket.tokens, resetMs: opts.windowMs - elapsed };
}

export function getClientIp(req: Request): string {
  const xff = req.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0].trim();
  return req.headers.get("x-real-ip") ?? "unknown";
}
