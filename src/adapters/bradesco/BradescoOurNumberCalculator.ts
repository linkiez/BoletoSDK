import type { BradescoOurNumberCheckDigit, BradescoOurNumberResult } from '../../types/adapters';

/**
 * Calculates Bradesco "our number" check digit using modulo 11.
 *
 * Rule:
 * - remainder 0 -> '0'
 * - remainder 1 -> 'P'
 * - otherwise -> 11 - remainder
 *
 * @param baseNumber - Numeric base number.
 * @returns Calculated check digit.
 * @throws {Error} When input is empty or non-numeric.
 */
export function calculateBradescoOurNumberCheckDigit(
  baseNumber: string,
): BradescoOurNumberCheckDigit {
  if (!baseNumber) {
    throw new Error('Base number is required');
  }

  if (!/^\d+$/.test(baseNumber)) {
    throw new Error('Base number must contain only digits');
  }

  let weight = 2;
  let sum = 0;

  for (let index = baseNumber.length - 1; index >= 0; index -= 1) {
    sum += Number(baseNumber[index]) * weight;
    weight = weight === 7 ? 2 : weight + 1;
  }

  const remainder = sum % 11;

  if (remainder === 0) {
    return '0';
  }

  if (remainder === 1) {
    return 'P';
  }

  return String(11 - remainder) as BradescoOurNumberCheckDigit;
}

/**
 * Formats Bradesco "our number" including check digit.
 *
 * @param baseNumber - Numeric base number.
 * @returns Formatted value as "baseNumber-checkDigit".
 */
export function formatBradescoOurNumber(baseNumber: string): string {
  const checkDigit = calculateBradescoOurNumberCheckDigit(baseNumber);
  return `${baseNumber}-${checkDigit}`;
}

/**
 * Builds detailed representation of Bradesco "our number".
 *
 * @param baseNumber - Numeric base number.
 * @returns Object with base number, check digit, and formatted value.
 */
export function buildBradescoOurNumber(baseNumber: string): BradescoOurNumberResult {
  const checkDigit = calculateBradescoOurNumberCheckDigit(baseNumber);

  return {
    baseNumber,
    checkDigit,
    formatted: `${baseNumber}-${checkDigit}`,
  };
}
