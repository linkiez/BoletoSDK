import { generateBarcode, validateBarcode, validateDigitableLine } from '@generators/barcode';

describe('barcode validators', () => {
  it('should validate a generated barcode and digitable line', () => {
    const { barcode, digitableLine } = generateBarcode({
      bankCode: '001',
      currencyCode: '9',
      dueDate: new Date(Date.UTC(1997, 9, 7)),
      amount: 1.23,
      freeField: '1234567890123456789012345',
    });

    expect(validateBarcode(barcode)).toBe(true);
    expect(validateDigitableLine(digitableLine)).toBe(true);
    expect(validateDigitableLine(digitableLine.replaceAll(/\D/g, ''))).toBe(true);
  });

  it('should reject barcode with invalid check digit', () => {
    const { barcode } = generateBarcode({
      bankCode: '001',
      currencyCode: '9',
      dueDate: new Date(Date.UTC(1997, 9, 7)),
      amount: 1.23,
      freeField: '1234567890123456789012345',
    });

    const invalidDigit = barcode[4] === '9' ? '0' : '9';
    const invalidBarcode = `${barcode.slice(0, 4)}${invalidDigit}${barcode.slice(5)}`;

    expect(validateBarcode(invalidBarcode)).toBe(false);
  });

  it('should reject digitable line with invalid field digit', () => {
    const { digitableLine } = generateBarcode({
      bankCode: '001',
      currencyCode: '9',
      dueDate: new Date(Date.UTC(1997, 9, 7)),
      amount: 1.23,
      freeField: '1234567890123456789012345',
    });

    const normalized = digitableLine.replaceAll(/\D/g, '');
    const invalid = `${normalized.slice(0, 2)}9${normalized.slice(3)}`;

    expect(validateDigitableLine(invalid)).toBe(false);
  });
});
