import { calculateModulo10 } from '@utils/generators';
import {
  assertNumeric,
  calculateBarcodeCheckDigit,
  extractBarcodeFromDigitableLine,
  normalizeDigitableLine,
} from './BarcodeUtils';

export function validateBarcode(barcode: string): boolean {
  try {
    assertNumeric(barcode, 'Barcode', 44);
  } catch {
    return false;
  }

  const base = `${barcode.slice(0, 4)}${barcode.slice(5)}`;
  const expectedDigit = calculateBarcodeCheckDigit(base);

  return barcode[4] === expectedDigit;
}

export function validateDigitableLine(digitableLine: string): boolean {
  const normalized = normalizeDigitableLine(digitableLine);

  try {
    assertNumeric(normalized, 'Digitable line', 47);
  } catch {
    return false;
  }

  const field1Data = normalized.slice(0, 9);
  const field1Digit = normalized[9];
  const field2Data = normalized.slice(10, 20);
  const field2Digit = normalized[20];
  const field3Data = normalized.slice(21, 31);
  const field3Digit = normalized[31];

  if (String(calculateModulo10(field1Data)) !== field1Digit) return false;
  if (String(calculateModulo10(field2Data)) !== field2Digit) return false;
  if (String(calculateModulo10(field3Data)) !== field3Digit) return false;

  const barcode = extractBarcodeFromDigitableLine(normalized);
  return validateBarcode(barcode);
}
