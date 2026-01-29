/**
 * Text utility functions for consistent text handling across the application
 */

/**
 * Truncates text to a specified number of lines with ellipsis
 * @param text - The text to truncate
 * @param lines - Number of lines to show (default: 3)
 * @param charsPerLine - Approximate characters per line (default: 80)
 * @returns Truncated text with ellipsis if needed
 */
export function truncateToLines(text: string, lines: number = 3, charsPerLine: number = 80): string {
  if (!text) return '';

  const maxChars = lines * charsPerLine;

  if (text.length <= maxChars) {
    return text;
  }

  // Find the last complete word within the character limit
  const truncated = text.substring(0, maxChars);
  const lastSpaceIndex = truncated.lastIndexOf(' ');

  // If we found a space, truncate there; otherwise use the full limit
  const finalText = lastSpaceIndex > 0 ? truncated.substring(0, lastSpaceIndex) : truncated;

  return finalText + '...';
}

/**
 * Truncates text to a specified number of words
 * @param text - The text to truncate
 * @param wordCount - Number of words to keep (default: 30)
 * @returns Truncated text with ellipsis if needed
 */
export function truncateToWords(text: string, wordCount: number = 30): string {
  if (!text) return '';

  const words = text.split(/\s+/);

  if (words.length <= wordCount) {
    return text;
  }

  return words.slice(0, wordCount).join(' ') + '...';
}

/**
 * Truncates text to a specified character length
 * @param text - The text to truncate
 * @param maxLength - Maximum character length (default: 150)
 * @returns Truncated text with ellipsis if needed
 */
export function truncateToLength(text: string, maxLength: number = 150): string {
  if (!text) return '';

  if (text.length <= maxLength) {
    return text;
  }

  // Find the last complete word within the character limit
  const truncated = text.substring(0, maxLength);
  const lastSpaceIndex = truncated.lastIndexOf(' ');

  // If we found a space, truncate there; otherwise use the full limit
  const finalText = lastSpaceIndex > 0 ? truncated.substring(0, lastSpaceIndex) : truncated;

  return finalText + '...';
}

/**
 * Strips HTML tags from text (useful for displaying rich text content)
 * @param html - HTML string to strip
 * @returns Plain text without HTML tags
 */
export function stripHtmlTags(html: string): string {
  if (!html) return '';
  return html.replace(/<[^>]*>/g, '');
}

/**
 * Truncates text for card displays - combines stripping HTML and line truncation
 * @param text - The text to truncate (may contain HTML)
 * @param lines - Number of lines to show (default: 3)
 * @returns Truncated plain text with ellipsis if needed
 */
export function truncateForCard(text: string, lines: number = 3): string {
  const plainText = stripHtmlTags(text);
  return truncateToLines(plainText, lines);
}
