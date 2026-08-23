import fs from 'node:fs';

/**
 * Returns filesystem birth time. Some filesystems synthesize this value, so
 * callers must not treat it as an authoritative publication timestamp.
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
 * Returns filesystem modification time and converts stat failures into a
 * path-specific error suitable for build logs.
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

/** Formats a date using the requested locale, or the runtime locale when omitted. */
export const formatDate = (date: Date, locale?: string): string => {
  return date.toLocaleDateString(locale);
};

/**
 * Produces a fixed-width local-time timestamp (`YYYYMMDDhhmmssiii`) whose
 * lexicographic order matches chronological order within one timezone.
 */
export function dateToTimestampString(date: Date): string {
  const YYYY = date.getFullYear().toString();
  const MM = (date.getMonth() + 1).toString().padStart(2, '0');
  const DD = date.getDate().toString().padStart(2, '0');
  const hh = date.getHours().toString().padStart(2, '0');
  const mm = date.getMinutes().toString().padStart(2, '0');
  const ss = date.getSeconds().toString().padStart(2, '0');
  const iii = date.getMilliseconds().toString().padStart(3, '0');

  return `${YYYY}${MM}${DD}${hh}${mm}${ss}${iii}`;
}
