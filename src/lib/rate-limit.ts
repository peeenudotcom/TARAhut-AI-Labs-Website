// Simple in-memory rate limiter.
// For production scale, swap for Upstash Redis. Good enough for MVP traffic.

type Bucket = { count: number; resetAt: number }
const buckets = new Map<string, Bucket>()

// Clean up expired buckets every 5 minutes
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const now = Date.now()
    for (const [key, bucket] of buckets.entries()) {
      if (bucket.resetAt < now) buckets.delete(key)
    }
  }, 5 * 60 * 1000)
}

export interface RateLimitOptions {
  limit: number       // max requests
  windowMs: number    // time window in milliseconds
}

export interface RateLimitResult {
  allowed: boolean
  remaining: number
  resetAt: number
}

export function rateLimit(key: string, opts: RateLimitOptions): RateLimitResult {
  const now = Date.now()
  const existing = buckets.get(key)

  if (!existing || existing.resetAt < now) {
    const resetAt = now + opts.windowMs
    buckets.set(key, { count: 1, resetAt })
    return { allowed: true, remaining: opts.limit - 1, resetAt }
  }

  if (existing.count >= opts.limit) {
    return { allowed: false, remaining: 0, resetAt: existing.resetAt }
  }

  existing.count += 1
  return { allowed: true, remaining: opts.limit - existing.count, resetAt: existing.resetAt }
}

// Refund a previously-counted hit. Use when an upstream call (e.g. Claude
// stream) failed AFTER rate-limit acquisition — the user's quota shouldn't
// burn on errors they didn't cause. No-op if the bucket has expired.
export function refundRateLimit(key: string): void {
  const bucket = buckets.get(key)
  if (bucket && bucket.count > 0) {
    bucket.count -= 1
  }
}

export function getClientIp(req: Request): string {
  const forwarded = req.headers.get('x-forwarded-for')
  if (forwarded) return forwarded.split(',')[0].trim()
  const real = req.headers.get('x-real-ip')
  if (real) return real
  return 'unknown'
}
