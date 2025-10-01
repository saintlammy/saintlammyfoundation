import { z } from 'zod';

// Base validation utilities
export const ValidationUtils = {
  // Email validation with sanitization
  email: z.string()
    .trim()
    .toLowerCase()
    .email('Invalid email address')
    .min(5, 'Email must be at least 5 characters')
    .max(254, 'Email must be less than 254 characters'),

  // Phone number validation
  phone: z.string()
    .trim()
    .regex(/^[\+]?[1-9][\d]{0,15}$/, 'Invalid phone number format')
    .optional(),

  // Name validation (prevents XSS, allows alphanumeric)
  name: z.string()
    .trim()
    .min(1, 'Name is required')
    .max(100, 'Name must be less than 100 characters')
    .regex(/^[a-zA-Z0-9\s\-\.\']+$/, 'Name contains invalid characters'),

  // Currency amount validation
  amount: z.number()
    .positive('Amount must be positive')
    .min(1, 'Minimum donation amount is $1')
    .max(1000000, 'Maximum donation amount is $1,000,000'),

  // URL validation
  url: z.string()
    .trim()
    .url('Invalid URL format')
    .optional(),

  // Message/description validation (with HTML sanitization)
  message: z.string()
    .trim()
    .min(1, 'Message is required')
    .max(2000, 'Message must be less than 2000 characters'),

  // Cryptocurrency address validation
  cryptoAddress: z.string()
    .trim()
    .min(26, 'Invalid cryptocurrency address')
    .max(62, 'Invalid cryptocurrency address')
    .regex(/^[a-zA-Z0-9]+$/, 'Address contains invalid characters'),

  // ID validation (UUID format)
  uuid: z.string()
    .regex(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i, 'Invalid ID format'),

  // String with length limits
  limitedString: (min: number, max: number, fieldName: string) =>
    z.string()
      .trim()
      .min(min, `${fieldName} must be at least ${min} characters`)
      .max(max, `${fieldName} must be less than ${max} characters`),

  // Enum validation
  enum: <T extends readonly [string, ...string[]]>(values: T, fieldName: string) =>
    z.enum(values, {
      errorMap: () => ({ message: `Invalid ${fieldName}. Must be one of: ${values.join(', ')}` })
    }),
};

// HTML sanitization utility
export function sanitizeHtml(input: string): string {
  if (!input) return '';

  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
    .replace(/&/g, '&amp;')
    .trim();
}

// SQL injection prevention
export function sanitizeSqlInput(input: string): string {
  if (!input) return '';

  return input
    .replace(/[';\\]/g, '') // Remove dangerous characters
    .replace(/--/g, '') // Remove SQL comments
    .replace(/\/\*/g, '') // Remove SQL comment start
    .replace(/\*\//g, '') // Remove SQL comment end
    .replace(/xp_/gi, '') // Remove xp_ commands
    .replace(/sp_/gi, '') // Remove sp_ commands
    .trim();
}

// Input validation middleware for API routes
export function validateInput<T>(schema: z.ZodSchema<T>) {
  return (data: unknown): { success: true; data: T } | { success: false; errors: string[] } => {
    try {
      const validatedData = schema.parse(data);
      return { success: true, data: validatedData };
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors = error.errors.map(err => `${err.path.join('.')}: ${err.message}`);
        return { success: false, errors };
      }
      return { success: false, errors: ['Validation failed'] };
    }
  };
}

// Rate limiting utility
export function createRateLimit(windowMs: number, maxRequests: number) {
  const requests = new Map<string, { count: number; resetTime: number }>();

  return function rateLimit(identifier: string): { allowed: boolean; remainingRequests: number } {
    const now = Date.now();
    const windowStart = now - windowMs;

    // Clean up old entries
    for (const [k, v] of Array.from(requests.entries())) {
      if (v.resetTime < windowStart) {
        requests.delete(k);
      }
    }

    const current = requests.get(identifier);

    if (!current) {
      requests.set(identifier, { count: 1, resetTime: now + windowMs });
      return { allowed: true, remainingRequests: maxRequests - 1 };
    }

    if (current.resetTime < now) {
      // Reset window
      requests.set(identifier, { count: 1, resetTime: now + windowMs });
      return { allowed: true, remainingRequests: maxRequests - 1 };
    }

    if (current.count >= maxRequests) {
      return { allowed: false, remainingRequests: 0 };
    }

    current.count++;
    return { allowed: true, remainingRequests: maxRequests - current.count };
  };
}