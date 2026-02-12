/**
 * Avatar Utility for Testimonials
 * Provides gender-based fallback avatars when no image is uploaded
 */

// Default avatar collections
const MALE_AVATARS = [
  'https://api.dicebear.com/7.x/avataaars/svg?seed=male1&backgroundColor=b6e3f4',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=male2&backgroundColor=c0aede',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=male3&backgroundColor=d1d4f9',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=male4&backgroundColor=ffd5dc',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=male5&backgroundColor=ffdfbf',
];

const FEMALE_AVATARS = [
  'https://api.dicebear.com/7.x/avataaars/svg?seed=female1&backgroundColor=ffd5dc',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=female2&backgroundColor=c0aede',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=female3&backgroundColor=b6e3f4',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=female4&backgroundColor=d1d4f9',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=female5&backgroundColor=ffdfbf',
];

const NEUTRAL_AVATARS = [
  'https://api.dicebear.com/7.x/bottts-neutral/svg?seed=neutral1&backgroundColor=b6e3f4',
  'https://api.dicebear.com/7.x/bottts-neutral/svg?seed=neutral2&backgroundColor=c0aede',
  'https://api.dicebear.com/7.x/bottts-neutral/svg?seed=neutral3&backgroundColor=d1d4f9',
  'https://api.dicebear.com/7.x/bottts-neutral/svg?seed=neutral4&backgroundColor=ffd5dc',
  'https://api.dicebear.com/7.x/bottts-neutral/svg?seed=neutral5&backgroundColor=ffdfbf',
];

export type Gender = 'male' | 'female' | 'other' | null | undefined;

/**
 * Get a fallback avatar based on gender
 * @param gender - The gender of the person (male, female, other, or null/undefined)
 * @param seed - Optional seed for consistent avatar selection (e.g., user ID or name)
 * @returns Avatar URL
 */
export function getAvatarFallback(gender: Gender, seed?: string): string {
  // Determine which avatar collection to use
  let avatarCollection: string[];

  if (gender === 'male') {
    avatarCollection = MALE_AVATARS;
  } else if (gender === 'female') {
    avatarCollection = FEMALE_AVATARS;
  } else {
    // For 'other', null, or undefined - randomly choose from all collections
    const allAvatars = [...MALE_AVATARS, ...FEMALE_AVATARS, ...NEUTRAL_AVATARS];
    avatarCollection = allAvatars;
  }

  // If seed is provided, use it for consistent selection
  if (seed) {
    const index = hashString(seed) % avatarCollection.length;
    return avatarCollection[index];
  }

  // Otherwise, select randomly
  const randomIndex = Math.floor(Math.random() * avatarCollection.length);
  return avatarCollection[randomIndex];
}

/**
 * Simple hash function to convert string to number
 * Used for consistent avatar selection based on name/id
 */
function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash);
}

/**
 * Get testimonial avatar with fallback
 * @param imageUrl - The uploaded image URL (may be null/empty)
 * @param gender - The person's gender
 * @param name - The person's name (used as seed for consistent avatar)
 * @returns Final avatar URL to display
 */
export function getTestimonialAvatar(
  imageUrl: string | null | undefined,
  gender: Gender,
  name?: string
): string {
  // If image URL exists and is not empty, use it
  if (imageUrl && imageUrl.trim() !== '') {
    return imageUrl;
  }

  // Otherwise, return fallback avatar
  return getAvatarFallback(gender, name);
}

/**
 * Infer gender from name (basic heuristic)
 * This is a simple helper - gender should ideally be explicitly provided
 */
export function inferGenderFromName(name: string): Gender {
  const nameLower = name.toLowerCase();

  // Common prefixes
  if (nameLower.startsWith('mr.') || nameLower.startsWith('mr ')) {
    return 'male';
  }
  if (nameLower.startsWith('mrs.') || nameLower.startsWith('mrs ') ||
      nameLower.startsWith('miss ') || nameLower.startsWith('ms.')) {
    return 'female';
  }

  // Common male names/titles
  const maleIndicators = ['chief', 'engr.', 'engineer', 'pastor', 'rev.'];
  for (const indicator of maleIndicators) {
    if (nameLower.includes(indicator)) {
      return 'male';
    }
  }

  // If no indicators found, return null for random selection
  return null;
}
