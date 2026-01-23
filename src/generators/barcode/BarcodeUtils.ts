import { padLeft } from '@utils/generators';

export const DEFAULT_CURRENCY_CODE = '9';
export const DEFAULT_BASE_DATE = new Date(Date.UTC(1997, 9, 7));
export const BARCODE_LENGTH = 44;
export const DIGITABLE_LINE_LENGTH = 47;

export function assertNumeric(value: string, fieldName: string, length?: number): string {
  if (!/^\d+$/.test(value)) {
    throw new Error(`${fieldName} must contain only digits`);
  }

  if (length !== undefined && value.length !== length) {
    throw new Error(`${fieldName} must have ${length} digits`);
  }

  return value;
}

export function formatAmount(amount: number): string {
  if (!Number.isFinite(amount) || amount < 0) {
    throw new Error('Amount must be a non-negative number');
  }

  const cents = Math.round(amount * 100);

  if (cents > 9_999_999_999) {
    throw new Error('Amount must fit within 10 digits');
  }

  return padLeft(cents, 10);
}

export function calculateDueDateFactor(dueDate: Date, baseDate = DEFAULT_BASE_DATE): string {
  if (!(dueDate instanceof Date) || Number.isNaN(dueDate.getTime())) {
    throw new TypeError('Due date must be a valid Date');
  }

  const utcDueDate = Date.UTC(
    dueDate.getUTCFullYear(),
    dueDate.getUTCMonth(),
    dueDate.getUTCDate(),
  );
  const utcBaseDate = Date.UTC(
    baseDate.getUTCFullYear(),
    baseDate.getUTCMonth(),
    baseDate.getUTCDate(),
  );

  const diffDays = Math.floor((utcDueDate - utcBaseDate) / (24 * 60 * 60 * 1000));

  if (diffDays < 0) {
    throw new Error('Due date factor cannot be negative');
  }

  if (diffDays > 9999) {
    throw new Error('Due date factor must fit within 4 digits');
  }

  return padLeft(diffDays, 4);
}

export function calculateBarcodeCheckDigit(value: string): string {
  assertNumeric(value, 'Barcode base', 43);

  let sum = 0;
  let weight = 2;

  for (let i = value.length - 1; i >= 0; i -= 1) {
    sum += Number.parseInt(value[i], 10) * weight;
    weight = weight === 9 ? 2 : weight + 1;
  }

  const remainder = sum % 11;
  const digit = 11 - remainder;

  if (digit === 0 || digit === 10 || digit === 11) {
    return '1';
  }

  return String(digit);
}

export function normalizeDigitableLine(digitableLine: string): string {
  return digitableLine.replaceAll(/\D/g, '');
}

export function extractBarcodeFromDigitableLine(digitableLine: string): string {
  const normalized = normalizeDigitableLine(digitableLine);
  assertNumeric(normalized, 'Digitable line', DIGITABLE_LINE_LENGTH);

  const field1 = normalized.slice(0, 9);
  const field2 = normalized.slice(10, 20);
  const field3 = normalized.slice(21, 31);
  const generalDigit = normalized[32];
  const dueDateFactor = normalized.slice(33, 37);
  const amount = normalized.slice(37, 47);

  const bankCode = field1.slice(0, 3);
  const currencyCode = field1[3];
  const freeField = `${field1.slice(4, 9)}${field2}${field3}`;

  return `${bankCode}${currencyCode}${generalDigit}${dueDateFactor}${amount}${freeField}`;
}
