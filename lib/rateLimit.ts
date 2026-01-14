/**
 * Simple in-memory rate limiter for API endpoints
 * SECURITY: Prevents spam and abuse of API endpoints
 */

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

class RateLimiter {
  private storage: Map<string, RateLimitEntry> = new Map();
  private cleanupInterval: NodeJS.Timeout | null = null;

  constructor() {
    // Clean up expired entries every minute
    this.cleanupInterval = setInterval(() => this.cleanup(), 60000);
  }

  /**
   * Check if a request should be rate limited
   * @param identifier - Unique identifier (IP address, user ID, etc.)
   * @param maxRequests - Maximum number of requests allowed
   * @param windowMs - Time window in milliseconds
   * @returns Object with allowed status and remaining requests
   */
  check(
    identifier: string,
    maxRequests: number = 10,
    windowMs: number = 60000
  ): {
    allowed: boolean;
    remaining: number;
    resetAt: number;
  } {
    const now = Date.now();
    const entry = this.storage.get(identifier);

    // No entry or expired entry - allow request
    if (!entry || now > entry.resetAt) {
      this.storage.set(identifier, {
        count: 1,
        resetAt: now + windowMs,
      });

      return {
        allowed: true,
        remaining: maxRequests - 1,
        resetAt: now + windowMs,
      };
    }

    // Entry exists and not expired
    if (entry.count < maxRequests) {
      entry.count++;
      this.storage.set(identifier, entry);

      return {
        allowed: true,
        remaining: maxRequests - entry.count,
        resetAt: entry.resetAt,
      };
    }

    // Rate limit exceeded
    return {
      allowed: false,
      remaining: 0,
      resetAt: entry.resetAt,
    };
  }

  /**
   * Clean up expired entries from storage
   */
  private cleanup() {
    const now = Date.now();
    for (const [key, entry] of this.storage.entries()) {
      if (now > entry.resetAt) {
        this.storage.delete(key);
      }
    }
  }

  /**
   * Clear all rate limit data (for testing)
   */
  reset() {
    this.storage.clear();
  }

  /**
   * Cleanup on shutdown
   */
  destroy() {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
    }
    this.storage.clear();
  }
}

// Create a global instance
const globalRateLimiter = new RateLimiter();

/**
 * Rate limit configuration presets
 */
export const RateLimitPresets = {
  // Strict limits for sensitive operations
  STRICT: { maxRequests: 5, windowMs: 60000 }, // 5 requests per minute

  // Standard limits for regular API calls
  STANDARD: { maxRequests: 30, windowMs: 60000 }, // 30 requests per minute

  // Lenient limits for read-only operations
  LENIENT: { maxRequests: 100, windowMs: 60000 }, // 100 requests per minute

  // Very strict for authentication attempts
  AUTH: { maxRequests: 3, windowMs: 300000 }, // 3 attempts per 5 minutes

  // Crypto payment requests
  CRYPTO_PAYMENT: { maxRequests: 5, windowMs: 300000 }, // 5 payment requests per 5 minutes

  // Newsletter signups
  NEWSLETTER: { maxRequests: 2, windowMs: 3600000 }, // 2 signups per hour

  // Contact form
  CONTACT: { maxRequests: 3, windowMs: 600000 }, // 3 messages per 10 minutes
};

/**
 * Helper function to get client identifier from request
 */
export function getClientIdentifier(req: any): string {
  // Try to get IP from various headers (for proxies/load balancers)
  const forwarded = req.headers['x-forwarded-for'];
  const realIp = req.headers['x-real-ip'];
  const ip = forwarded
    ? (typeof forwarded === 'string' ? forwarded.split(',')[0] : forwarded[0])
    : realIp || req.socket?.remoteAddress || 'unknown';

  return ip;
}

/**
 * Main rate limiting function
 * @param identifier - Unique identifier (usually IP address)
 * @param preset - Rate limit preset or custom config
 * @returns Result of rate limit check
 */
export function rateLimit(
  identifier: string,
  preset: keyof typeof RateLimitPresets | { maxRequests: number; windowMs: number } = 'STANDARD'
): {
  allowed: boolean;
  remaining: number;
  resetAt: number;
} {
  const config = typeof preset === 'string' ? RateLimitPresets[preset] : preset;
  return globalRateLimiter.check(identifier, config.maxRequests, config.windowMs);
}

/**
 * Express/Next.js middleware for rate limiting
 * Usage in API route:
 *
 * export default function handler(req, res) {
 *   const result = rateLimitMiddleware(req, 'STRICT');
 *   if (!result.allowed) {
 *     return res.status(429).json({ error: 'Too many requests' });
 *   }
 *   // ... rest of handler
 * }
 */
export function rateLimitMiddleware(
  req: any,
  preset: keyof typeof RateLimitPresets | { maxRequests: number; windowMs: number } = 'STANDARD'
): {
  allowed: boolean;
  remaining: number;
  resetAt: number;
  headers: Record<string, string>;
} {
  const identifier = getClientIdentifier(req);
  const result = rateLimit(identifier, preset);

  return {
    ...result,
    headers: {
      'X-RateLimit-Limit': String(
        typeof preset === 'string' ? RateLimitPresets[preset].maxRequests : preset.maxRequests
      ),
      'X-RateLimit-Remaining': String(result.remaining),
      'X-RateLimit-Reset': new Date(result.resetAt).toISOString(),
    },
  };
}

/**
 * Reset all rate limits (useful for testing)
 */
export function resetRateLimits() {
  globalRateLimiter.reset();
}

export default {
  rateLimit,
  rateLimitMiddleware,
  getClientIdentifier,
  RateLimitPresets,
  resetRateLimits,
};
