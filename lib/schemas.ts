import { z } from 'zod';
import { ValidationUtils } from './validation';

// Donation form schemas
export const DonationFormSchema = z.object({
  amount: ValidationUtils.amount,
  currency: ValidationUtils.enum(['USD', 'NGN', 'BTC', 'ETH', 'USDT', 'USDC', 'XRP'], 'currency'),
  category: ValidationUtils.enum(['orphan', 'widow', 'home', 'general'], 'category'),
  frequency: ValidationUtils.enum(['one-time', 'monthly', 'weekly', 'yearly'], 'frequency'),
  donorName: ValidationUtils.name.optional(),
  donorEmail: ValidationUtils.email.optional(),
  donorPhone: ValidationUtils.phone,
  message: ValidationUtils.message.optional(),
  isAnonymous: z.boolean().default(false),
  beneficiaryId: ValidationUtils.uuid.optional(),
  paymentMethod: ValidationUtils.enum(['crypto', 'paypal', 'bank_transfer', 'card'], 'payment method'),
});

export const CryptoDonationSchema = z.object({
  amount: ValidationUtils.amount,
  currency: ValidationUtils.enum(['BTC', 'ETH', 'USDT', 'USDC', 'XRP', 'BNB', 'SOL', 'TRX'], 'cryptocurrency'),
  network: z.string().min(1, 'Network is required').optional(),
  donorName: ValidationUtils.name.optional(),
  donorEmail: ValidationUtils.email.optional(),
  message: ValidationUtils.message.optional(),
  source: z.string().optional(),
  category: ValidationUtils.enum(['orphan', 'widow', 'home', 'general', 'family', 'outreach', 'emergency', 'education', 'healthcare', 'empowerment', 'infrastructure'], 'category').default('general'),
});

// Contact form schema
export const ContactFormSchema = z.object({
  name: ValidationUtils.name,
  email: ValidationUtils.email,
  phone: ValidationUtils.phone,
  subject: ValidationUtils.limitedString(1, 200, 'Subject'),
  message: ValidationUtils.limitedString(10, 2000, 'Message'),
});

// Volunteer application schema
export const VolunteerFormSchema = z.object({
  firstName: ValidationUtils.name,
  lastName: ValidationUtils.name,
  email: ValidationUtils.email,
  phone: ValidationUtils.phone,
  location: ValidationUtils.limitedString(1, 200, 'Location'),
  interests: z.array(z.string()).min(1, 'Please select at least one interest'),
  availability: ValidationUtils.limitedString(1, 500, 'Availability'),
  experience: ValidationUtils.limitedString(1, 1000, 'Experience'),
  motivation: ValidationUtils.limitedString(10, 1000, 'Motivation'),
  skills: ValidationUtils.limitedString(1, 500, 'Skills'),
  backgroundCheck: z.boolean(),
  commitment: ValidationUtils.limitedString(1, 200, 'Commitment'),
});

// Newsletter subscription schema
export const NewsletterFormSchema = z.object({
  name: ValidationUtils.name,
  email: ValidationUtils.email,
});

// Admin authentication schemas
export const LoginSchema = z.object({
  email: ValidationUtils.email,
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

export const SignupSchema = z.object({
  email: ValidationUtils.email,
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
      'Password must contain uppercase, lowercase, number, and special character'),
  confirmPassword: z.string(),
  name: ValidationUtils.name,
  role: ValidationUtils.enum(['admin', 'manager'], 'role').default('admin'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

// Content management schemas
export const ContentSchema = z.object({
  title: ValidationUtils.limitedString(1, 200, 'Title'),
  content: ValidationUtils.limitedString(1, 10000, 'Content'),
  excerpt: ValidationUtils.limitedString(1, 500, 'Excerpt').optional(),
  type: ValidationUtils.enum(['page', 'blog', 'program', 'story', 'media', 'team', 'partnership'], 'content type'),
  status: ValidationUtils.enum(['published', 'draft', 'scheduled', 'archived'], 'status').default('draft'),
  slug: z.string()
    .regex(/^[a-z0-9-]+$/, 'Slug can only contain lowercase letters, numbers, and hyphens')
    .min(1, 'Slug is required')
    .max(200, 'Slug must be less than 200 characters'),
  featuredImage: ValidationUtils.url,
  publishDate: z.string().datetime().optional(),
  metadata: z.record(z.any()).optional(),
});

// Team member schema
export const TeamMemberSchema = z.object({
  name: ValidationUtils.name,
  role: ValidationUtils.limitedString(1, 100, 'Role'),
  expertise: ValidationUtils.limitedString(1, 200, 'Expertise'),
  experience: ValidationUtils.limitedString(1, 500, 'Experience'),
  focus: z.array(z.string()).min(1, 'Please specify at least one focus area'),
  email: ValidationUtils.email,
  phone: ValidationUtils.phone,
  status: ValidationUtils.enum(['active', 'inactive'], 'status').default('active'),
  avatar: ValidationUtils.url,
});

// Partnership application schema
export const PartnershipSchema = z.object({
  organizationName: ValidationUtils.limitedString(1, 200, 'Organization name'),
  contactPerson: ValidationUtils.name,
  contactEmail: ValidationUtils.email,
  contactPhone: ValidationUtils.phone,
  organizationType: ValidationUtils.enum(['corporate', 'ngo', 'government', 'religious', 'educational'], 'organization type'),
  partnershipType: ValidationUtils.enum(['financial', 'resource', 'service', 'advocacy'], 'partnership type'),
  description: ValidationUtils.limitedString(10, 2000, 'Description'),
  proposedContribution: ValidationUtils.limitedString(10, 1000, 'Proposed contribution'),
  timeline: ValidationUtils.limitedString(1, 200, 'Timeline'),
  website: ValidationUtils.url,
  address: ValidationUtils.limitedString(1, 500, 'Address').optional(),
});

// API query parameter schemas
export const PaginationSchema = z.object({
  page: z.number().int().positive().default(1),
  limit: z.number().int().positive().max(100).default(20),
  sort: z.string().optional(),
  order: ValidationUtils.enum(['asc', 'desc'], 'sort order').default('desc'),
});

export const SearchSchema = z.object({
  query: z.string().trim().min(1, 'Search query is required').max(200, 'Search query too long'),
  type: ValidationUtils.enum(['all', 'donations', 'content', 'team', 'partnerships'], 'search type').default('all'),
  ...PaginationSchema.shape,
});

// File upload schemas
export const ImageUploadSchema = z.object({
  file: z.object({
    name: z.string().regex(/^[a-zA-Z0-9\-_\.]+\.(jpg|jpeg|png|webp)$/i, 'Invalid image file name'),
    size: z.number().max(5 * 1024 * 1024, 'Image must be less than 5MB'),
    type: z.string().refine(
      (type) => ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'].includes(type),
      'Only JPEG, PNG, and WebP images are allowed'
    ),
  }),
  alt: ValidationUtils.limitedString(1, 200, 'Alt text').optional(),
  caption: ValidationUtils.limitedString(1, 500, 'Caption').optional(),
});

// Wallet management schemas
export const WalletGenerationSchema = z.object({
  label: ValidationUtils.limitedString(1, 100, 'Wallet label'),
  network: ValidationUtils.enum(['bitcoin', 'ethereum', 'solana', 'bsc', 'xrp', 'tron'], 'network'),
  currency: ValidationUtils.enum(['BTC', 'ETH', 'SOL', 'BNB', 'XRP', 'TRX'], 'currency'),
});

// Environment validation
export const EnvSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.string().url('Invalid Supabase URL'),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1, 'Supabase anon key is required'),
  ENCRYPTION_KEY: z.string().min(32, 'Encryption key must be at least 32 characters'),
  PAYPAL_CLIENT_ID: z.string().optional(),
  PAYPAL_CLIENT_SECRET: z.string().optional(),
});

// Rate limiting schemas
export const RateLimitConfigSchema = z.object({
  windowMs: z.number().positive().default(15 * 60 * 1000), // 15 minutes
  maxRequests: z.number().positive().default(100),
  skipSuccessfulRequests: z.boolean().default(false),
  skipFailedRequests: z.boolean().default(false),
});

// Export type definitions
export type DonationFormData = z.infer<typeof DonationFormSchema>;
export type CryptoDonationData = z.infer<typeof CryptoDonationSchema>;
export type ContactFormData = z.infer<typeof ContactFormSchema>;
export type VolunteerFormData = z.infer<typeof VolunteerFormSchema>;
export type NewsletterFormData = z.infer<typeof NewsletterFormSchema>;
export type LoginData = z.infer<typeof LoginSchema>;
export type SignupData = z.infer<typeof SignupSchema>;
export type ContentData = z.infer<typeof ContentSchema>;
export type TeamMemberData = z.infer<typeof TeamMemberSchema>;
export type PartnershipData = z.infer<typeof PartnershipSchema>;
export type PaginationParams = z.infer<typeof PaginationSchema>;
export type SearchParams = z.infer<typeof SearchSchema>;
export type ImageUploadData = z.infer<typeof ImageUploadSchema>;
export type WalletGenerationData = z.infer<typeof WalletGenerationSchema>;
export type EnvData = z.infer<typeof EnvSchema>;
export type RateLimitConfig = z.infer<typeof RateLimitConfigSchema>;