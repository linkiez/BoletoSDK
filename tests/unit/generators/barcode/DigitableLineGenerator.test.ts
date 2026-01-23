import { generateBarcode, generateDigitableLine } from '@generators/barcode';

describe('generateDigitableLine', () => {
  it('should build a formatted digitable line from a barcode', () => {
    const { barcode, digitableLine } = generateBarcode({
      bankCode: '001',
      currencyCode: '9',
      dueDate: new Date(Date.UTC(1997, 9, 7)),
      amount: 1.23,
      freeField: '1234567890123456789012345',
    });

    const formatted = generateDigitableLine(barcode);

    expect(formatted).toBe(digitableLine);
    expect(formatted).toMatch(/^\d{5}\.\d{5} \d{5}\.\d{6} \d{5}\.\d{6} \d \d{14}$/);
  });

  it('should throw when barcode is invalid', () => {
    expect(() => generateDigitableLine('123')).toThrow('Barcode must have 44 digits');
  });
});
