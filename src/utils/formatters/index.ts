/**
 * Format tax ID (CPF or CNPJ) with standard Brazilian formatting
 *
 * @param taxId - Tax ID (11 digits for CPF or 14 digits for CNPJ)
 * @returns Formatted tax ID
 *
 * @example
 * ```typescript
 * formatTaxId('12345678901'); // Returns '123.456.789-01' (CPF)
 * formatTaxId('12345678000195'); // Returns '12.345.678/0001-95' (CNPJ)
 * ```
 */
export function formatTaxId(taxId: string): string {
  if (!taxId) return '';

  // Remove existing formatting
  const digits = taxId.replace(/\D/g, '');

  // Validate contains only digits in original
  if (taxId.replace(/[.\-/]/g, '') !== digits) {
    throw new Error('Tax ID must contain only digits');
  }

  // CPF: 11 digits -> 123.456.789-01
  if (digits.length === 11) {
    return digits.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  }

  // CNPJ: 14 digits -> 12.345.678/0001-95
  if (digits.length === 14) {
    return digits.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
  }

  throw new Error('Invalid tax ID length');
}

/**
 * Format options for money formatting
 */
export interface FormatMoneyOptions {
  /** Show currency symbol (default: true) */
  showSymbol?: boolean;
  /** Number of decimal places (default: 2) */
  decimalPlaces?: number;
}

/**
 * Format number as Brazilian Real currency
 *
 * @param value - Numeric value to format
 * @param options - Formatting options
 * @returns Formatted money string
 *
 * @example
 * ```typescript
 * formatMoney(1500.50); // Returns 'R$ 1.500,50'
 * formatMoney(100, { showSymbol: false }); // Returns '100,00'
 * ```
 */
export function formatMoney(value: number, options: FormatMoneyOptions = {}): string {
  const { showSymbol = true, decimalPlaces = 2 } = options;

  // Round to specified decimal places
  const rounded = Math.round(value * Math.pow(10, decimalPlaces)) / Math.pow(10, decimalPlaces);

  // Split into integer and decimal parts
  const [integerPart, decimalPart = ''] = Math.abs(rounded).toFixed(decimalPlaces).split('.');

  // Add thousand separators
  const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, '.');

  // Combine parts with Brazilian format
  const formattedValue = `${formattedInteger},${decimalPart}`;

  // Add negative sign if needed
  const withSign = rounded < 0 ? `-${formattedValue}` : formattedValue;

  // Add currency symbol if requested
  return showSymbol ? `R$ ${withSign}` : withSign;
}

/**
 * Format Date to DDMMYY (6-character) format for CNAB400
 *
 * @param date - Date object to format
 * @returns 6-character date string (DDMMYY)
 *
 * @example
 * ```typescript
 * formatDateShort(new Date('2026-01-15')); // Returns '150126'
 * ```
 */
export function formatDateShort(date: Date): string {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = String(date.getFullYear()).slice(-2);

  return `${day}${month}${year}`;
}

/**
 * Format Date to DDMMYYYY (8-character) format for CNAB240
 *
 * @param date - Date object to format
 * @returns 8-character date string (DDMMYYYY)
 *
 * @example
 * ```typescript
 * formatDateLong(new Date('2026-01-15')); // Returns '15012026'
 * ```
 */
export function formatDateLong(date: Date): string {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = String(date.getFullYear());

  return `${day}${month}${year}`;
}

/**
 * Format decimal number for CNAB (remove decimal point, pad with zeros)
 *
 * @param value - Decimal number
 * @param length - Total length including decimal places
 * @param decimalPlaces - Number of decimal places (default: 2)
 * @returns Zero-padded string without decimal point
 *
 * @example
 * ```typescript
 * formatDecimal(150.50, 13, 2); // Returns '0000000015050'
 * formatDecimal(1000, 13, 2); // Returns '0000000100000'
 * ```
 */
export function formatDecimal(value: number, length: number, decimalPlaces = 2): string {
  // Convert to integer by multiplying by 10^decimalPlaces
  const intValue = Math.round(value * Math.pow(10, decimalPlaces));

  // Pad left with zeros
  return String(intValue).padStart(length, '0');
}
