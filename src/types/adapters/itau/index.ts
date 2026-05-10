/**
 * Supported Ita\u00fa wallet codes.
 */
export type ItauWalletCode = '109' | '112' | '115' | '180';

/**
 * Detailed result for an Ita\u00fa "our number" calculation.
 */
export interface ItauOurNumberResult {
  /** Base numeric value received as input. */
  baseNumber: string;
  /** Modulo 10 check digit for the base number. */
  checkDigit: number;
  /** Concatenation of base number + check digit. */
  formatted: string;
}
