import fs from 'node:fs';

// --- File System Utilities ---

/**
 * Retrieves the creation time (birthtime) of a file.
 * NOTE: 'birthtime' might not be supported or accurate on all operating systems/filesystems.
 * @param filePath The path to the file.
 * @returns A Date object representing the file's creation time.
 */
export const getCreatedDate = (filePath: string): Date => {
  try {
    const { birthtime } = fs.statSync(filePath);
    return birthtime;
  } catch (error) {
    console.error(`Error reading creation date for ${filePath}:`, error);
    throw new Error(`Failed to get file stats for: ${filePath}`);
  }
};

/**
 * Retrieves the last modification time (mtime) of a file.
 * @param filePath The path to the file.
 * @returns A Date object representing the file's last modification time.
 */
export const getModifiedDate = (filePath: string): Date => {
  try {
    const { mtime } = fs.statSync(filePath);
    return mtime;
  } catch (error) {
    console.error(`Error reading modification date for ${filePath}:`, error);
    throw new Error(`Failed to get file stats for: ${filePath}`);
  }
};

// --- Date Formatting Utilities ---

/**
 * Formats a Date object into a locale-specific short date string (e.g., "10/26/2025").
 * @param date The Date object to format.
 * @param locale Optional locale string (defaults to system locale).
 * @returns The formatted date string.
 */
export const formatDate = (date: Date, locale?: string): string => {
  return date.toLocaleDateString(locale);
};

// NOTE: The function padTwoDigits is redundant as String.prototype.padStart(2, '0')
// is used directly inside dateToTimestampString. It is removed for conciseness.

/**
 * Formats a Date object into a precise, compact timestamp string: YYYYMMDDhhmmssiii.
 * This format is commonly used for file naming or precise logging where sorting is important.
 * @param date The Date object to format.
 * @returns The timestamp string (e.g., "20251006090110345").
 */
export function dateToTimestampString(date: Date): string {
  const YYYY = date.getFullYear().toString();
  // Month is 0-indexed, so add 1.
  const MM = (date.getMonth() + 1).toString().padStart(2, '0');
  const DD = date.getDate().toString().padStart(2, '0');
  const hh = date.getHours().toString().padStart(2, '0');
  const mm = date.getMinutes().toString().padStart(2, '0');
  const ss = date.getSeconds().toString().padStart(2, '0');
  // Include milliseconds for high precision.
  const iii = date.getMilliseconds().toString().padStart(3, '0');

  return `${YYYY}${MM}${DD}${hh}${mm}${ss}${iii}`;
}
