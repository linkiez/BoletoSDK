/**
 * Parse numeric string to integer
 * Handles leading zeros and validates format
 *
 * @param value - Numeric string
 * @returns Parsed integer
 *
 * @example
 * ```typescript
 * parseNumber('00123'); // Returns 123
 * parseNumber('0'); // Returns 0
 * ```
 */
export function parseNumber(value: string): number {
  const trimmed = value?.trim() || '';
  if (!trimmed) return 0;

  // Validate contains only digits
  if (!/^\d+$/.test(trimmed)) {
    throw new Error('Invalid number format');
  }

  return Number.parseInt(trimmed, 10);
}

/**
 * Parse CNAB decimal value (implied decimal places)
 * CNAB files store decimal values as integers with implied decimal point
 *
 * @param value - Numeric string
 * @param decimalPlaces - Number of implied decimal places
 * @returns Parsed decimal number
 *
 * @example
 * ```typescript
 * parseDecimal('12345', 2); // Returns 123.45
 * parseDecimal('100', 2); // Returns 1.00
 * ```
 */
export function parseDecimal(value: string, decimalPlaces: number): number {
  if (!value) return 0;

  const number = parseNumber(value.trim());
  return number / Math.pow(10, decimalPlaces);
}

/**
 * Parse date from DDMMYYYY format
 *
 * @param value - Date string in DDMMYYYY format
 * @returns Parsed Date object
 *
 * @example
 * ```typescript
 * parseDate('31122025'); // Returns Date(2025, 11, 31)
 * ```
 */
export function parseDate(value: string): Date {
  if (value.length !== 8) {
    throw new Error('Invalid date format');
  }

  // Validate contains only digits
  if (!/^\d{8}$/.test(value)) {
    throw new Error('Invalid date format');
  }

  const day = Number.parseInt(value.substring(0, 2), 10);
  const month = Number.parseInt(value.substring(2, 4), 10);
  const year = Number.parseInt(value.substring(4, 8), 10);

  const date = new Date(year, month - 1, day);

  // Validate date is valid (handles invalid dates like 32/01/2026)
  if (
    date.getDate() !== day ||
    date.getMonth() !== month - 1 ||
    date.getFullYear() !== year
  ) {
    throw new Error('Invalid date');
  }

  return date;
}

/**
 * Parse short date from DDMMYY format (6 characters)
 * Assumes 21st century (20YY) for years 00-99
 *
 * @param value - Date string in DDMMYY format
 * @returns Parsed Date object
 *
 * @example
 * ```typescript
 * parseDateShort('010126'); // Returns Date(2026, 0, 1)
 * parseDateShort('311299'); // Returns Date(2099, 11, 31)
 * ```
 */
export function parseDateShort(value: string): Date {
  if (value.length !== 6) {
    throw new Error('Invalid short date format');
  }

  // Validate contains only digits
  if (!/^\d{6}$/.test(value)) {
    throw new Error('Invalid short date format');
  }

  const day = Number.parseInt(value.substring(0, 2), 10);
  const month = Number.parseInt(value.substring(2, 4), 10);
  const year = 2000 + Number.parseInt(value.substring(4, 6), 10); // Assume 21st century

  const date = new Date(year, month - 1, day);

  // Validate date is valid (handles invalid dates like 32/01/2026)
  if (
    date.getDate() !== day ||
    date.getMonth() !== month - 1 ||
    date.getFullYear() !== year
  ) {
    throw new Error('Invalid date');
  }

  return date;
}

/**
 * Parse CNAB date format (days since epoch)
 * CNAB uses days since 1997-10-07 as date representation
 *
 * @param value - Days since epoch (number or string)
 * @returns Parsed Date object
 *
 * @example
 * ```typescript
 * parseDateCnab(0); // Returns Date(1997, 9, 7) - epoch date
 * parseDateCnab(1000); // Returns date 1000 days after epoch
 * ```
 */
export function parseDateCnab(value: number | string): Date {
  const days = typeof value === 'string' ? parseNumber(value) : value;

  // CNAB epoch: 1997-10-07
  const epoch = new Date(1997, 9, 7);

  // Handle negative values as zero
  const validDays = Math.max(0, days);

  // Add days to epoch
  const result = new Date(epoch);
  result.setDate(result.getDate() + validDays);

  return result;
}
