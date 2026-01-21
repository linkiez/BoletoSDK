/**
 * Utilities for formatting CNAB240 file lines (240 characters)
 */

/**
 * Format field with padding (text right-padded, numeric left-padded with zeros)
 * @param value - Value to format
 * @param startPos - Starting position (1-indexed)
 * @param endPos - Ending position (1-indexed, inclusive)
 * @param type - Field type ('text' or 'numeric')
 * @returns Formatted string with exact field size
 */
export function formatField(
  value: string | number,
  startPos: number,
  endPos: number,
  type: 'text' | 'numeric',
): string {
  const size = endPos - startPos + 1;
  const strValue = String(value || '').toUpperCase();

  if (type === 'text') {
    // Text: right-pad with spaces, truncate if too long
    return strValue.padEnd(size, ' ').substring(0, size);
  } else {
    // Numeric: left-pad with zeros, take last N digits if too long
    const numericValue = strValue.replace(/[^\d]/g, '');
    return numericValue.padStart(size, '0').slice(-size);
  }
}

/**
 * Format numeric field with leading zeros
 * @param value - Numeric value
 * @param startPos - Starting position (1-indexed)
 * @param endPos - Ending position (1-indexed, inclusive)
 * @returns Formatted string with leading zeros
 */
export function formatNumericField(value: number, startPos: number, endPos: number): string {
  const size = endPos - startPos + 1;
  const absValue = Math.abs(value);
  const strValue = String(Math.floor(absValue));
  return strValue.padStart(size, '0').slice(-size);
}

/**
 * Format decimal field as integer (implied decimal places)
 * Example: 150.50 with 2 decimals becomes 15050
 * @param value - Decimal value
 * @param startPos - Starting position (1-indexed)
 * @param endPos - Ending position (1-indexed, inclusive)
 * @param decimals - Number of implied decimal places
 * @returns Formatted string representing decimal as integer
 */
export function formatDecimalField(
  value: number,
  startPos: number,
  endPos: number,
  decimals: number,
): string {
  const size = endPos - startPos + 1;
  const multiplier = Math.pow(10, decimals);
  const intValue = Math.round(value * multiplier);
  const strValue = String(Math.abs(intValue));
  return strValue.padStart(size, '0').slice(-size);
}

/**
 * Format date field in DDMMYYYY format
 * Uses UTC to avoid timezone issues
 * @param date - Date object or undefined
 * @param startPos - Starting position (1-indexed)
 * @param endPos - Ending position (1-indexed, inclusive)
 * @returns Formatted date string (DDMMYYYY) or zeros if undefined
 */
export function formatDateField(date: Date | undefined, startPos: number, endPos: number): string {
  const size = endPos - startPos + 1;

  if (!date) {
    return '0'.repeat(size);
  }

  const day = String(date.getUTCDate()).padStart(2, '0');
  const month = String(date.getUTCMonth() + 1).padStart(2, '0');
  const year = String(date.getUTCFullYear());

  return `${day}${month}${year}`;
}

/**
 * Build complete line from field map
 * Fields are concatenated in insertion order
 * @param fields - Map of field values
 * @returns Complete line string
 */
export function buildLine(fields: Map<string, string>): string {
  return Array.from(fields.values()).join('');
}
