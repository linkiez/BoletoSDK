import {
  assertNumeric,
  calculateBarcodeCheckDigit,
  calculateDueDateFactor,
  DEFAULT_CURRENCY_CODE,
  formatAmount,
} from './BarcodeUtils';
import { generateDigitableLine } from './DigitableLineGenerator';

export interface BarcodeGenerationInput {
  bankCode: string;
  currencyCode?: string;
  dueDate: Date;
  amount: number;
  freeField: string;
}

export interface BarcodeGenerationOptions {
  baseDate?: Date;
}

export interface BarcodeResult {
  barcode: string;
  digitableLine: string;
}

export function generateBarcode(
  input: BarcodeGenerationInput,
  options: BarcodeGenerationOptions = {},
): BarcodeResult {
  const bankCode = assertNumeric(input.bankCode, 'Bank code', 3);
  const currencyCode = assertNumeric(
    input.currencyCode ?? DEFAULT_CURRENCY_CODE,
    'Currency code',
    1,
  );
  const freeField = assertNumeric(input.freeField, 'Free field', 25);

  const dueDateFactor = calculateDueDateFactor(input.dueDate, options.baseDate);
  const amount = formatAmount(input.amount);

  const base = `${bankCode}${currencyCode}${dueDateFactor}${amount}${freeField}`;
  const checkDigit = calculateBarcodeCheckDigit(base);
  const barcode = `${bankCode}${currencyCode}${checkDigit}${dueDateFactor}${amount}${freeField}`;

  return {
    barcode,
    digitableLine: generateDigitableLine(barcode),
  };
}
