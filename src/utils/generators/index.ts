/**
 * Pad string or number on the left to specified length
 *
 * @param value - Value to pad
 * @param length - Target length
 * @param fillChar - Character to pad with (default: '0')
 * @returns Padded string
 *
 * @example
 * ```typescript
 * padLeft('123', 5); // Returns '00123'
 * padLeft(42, 4, ' '); // Returns '  42'
 * ```
 */
export function padLeft(value: string | number, length: number, fillChar = '0'): string {
  if (length <= 0) return '';

  const str = String(value);

  if (str.length >= length) {
    // Truncate from left if longer
    return str.slice(-length);
  }

  return fillChar.repeat(length - str.length) + str;
}

/**
 * Pad string or number on the right to specified length
 *
 * @param value - Value to pad
 * @param length - Target length
 * @param fillChar - Character to pad with (default: '0')
 * @returns Padded string
 *
 * @example
 * ```typescript
 * padRight('123', 5); // Returns '12300'
 * padRight('ABC', 5, ' '); // Returns 'ABC  '
 * ```
 */
export function padRight(value: string | number, length: number, fillChar = '0'): string {
  if (length <= 0) return '';

  const str = String(value);

  if (str.length >= length) {
    // Truncate from right if longer
    return str.slice(0, length);
  }

  return str + fillChar.repeat(length - str.length);
}

/**
 * Options for modulo 11 calculation
 */
export interface Modulo11Options {
  /** Maximum weight value (default: 9) */
  maxWeight?: number;
  /** Value to return when result is 10 (default: 0) */
  replace10?: number;
  /** Value to return when result is 11 (default: 0) */
  replace11?: number;
}

/**
 * Calculate check digit using modulo 10 algorithm
 * Used in barcode validation
 *
 * @param value - Numeric string to calculate check digit
 * @returns Check digit (0-9)
 *
 * @example
 * ```typescript
 * calculateModulo10('123456'); // Returns 4
 * ```
 */
export function calculateModulo10(value: string): number {
  let sum = 0;
  let multiplier = 2;

  // Process from right to left
  for (let i = value.length - 1; i >= 0; i--) {
    let digit = parseInt(value[i]) * multiplier;

    // If result is two digits, sum them
    if (digit > 9) {
      digit = Math.floor(digit / 10) + (digit % 10);
    }

    sum += digit;
    multiplier = multiplier === 2 ? 1 : 2;
  }

  const remainder = sum % 10;
  return remainder === 0 ? 0 : 10 - remainder;
}

/**
 * Calculate check digit using modulo 11 algorithm
 * Used in CPF, CNPJ, and bank account validation
 *
 * @param value - Numeric string to calculate check digit
 * @param options - Calculation options
 * @returns Check digit
 *
 * @example
 * ```typescript
 * calculateModulo11('123456789'); // Returns 0
 * calculateModulo11('123456', { maxWeight: 7 }); // Returns 6
 * ```
 */
export function calculateModulo11(value: string, options: Modulo11Options = {}): number {
  const { maxWeight = 9, replace10 = 0, replace11 = 0 } = options;

  if (!value) return 0;

  let sum = 0;
  let weight = 2;

  // Process from right to left
  for (let i = value.length - 1; i >= 0; i--) {
    sum += parseInt(value[i]) * weight;
    weight = weight >= maxWeight ? 2 : weight + 1;
  }

  const remainder = sum % 11;
  const result = 11 - remainder;

  if (result === 10) return replace10;
  if (result === 11) return replace11;

  return result;
}
