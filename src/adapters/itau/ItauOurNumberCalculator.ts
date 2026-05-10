import type { ItauOurNumberResult } from '../../types/adapters';
import { calculateModulo10 } from '@utils/generators';

/**
 * Calculates Ita\u00fa "our number" check digit using modulo 10.
 *
 * @param baseNumber - Numeric base value used to calculate the check digit.
 * @returns Check digit in range 0-9.
 * @throws {Error} When the input is empty.
 * @throws {Error} When the input contains non-numeric characters.
 * @example
 * ```typescript
 * calculateItauOurNumberCheckDigit('12345678'); // 2
 * ```
 */
export function calculateItauOurNumberCheckDigit(baseNumber: string): number {
  if (!baseNumber) {
    throw new Error('Base number is required');
  }

  if (!/^\d+$/.test(baseNumber)) {
    throw new Error('Base number must contain only digits');
  }

  return calculateModulo10(baseNumber);
}

/**
 * Formats Ita\u00fa "our number" by appending its modulo 10 check digit.
 *
 * @param baseNumber - Numeric base value used to calculate the check digit.
 * @returns Concatenation of base number + check digit.
 */
export function formatItauOurNumber(baseNumber: string): string {
  const checkDigit = calculateItauOurNumberCheckDigit(baseNumber);
  return `${baseNumber}${checkDigit}`;
}

/**
 * Builds a detailed representation for Ita\u00fa "our number".
 *
 * @param baseNumber - Numeric base value used to calculate the check digit.
 * @returns Object containing base number, check digit and formatted value.
 */
export function buildItauOurNumber(baseNumber: string): ItauOurNumberResult {
  const checkDigit = calculateItauOurNumberCheckDigit(baseNumber);

  return {
    baseNumber,
    checkDigit,
    formatted: `${baseNumber}${checkDigit}`,
  };
}
