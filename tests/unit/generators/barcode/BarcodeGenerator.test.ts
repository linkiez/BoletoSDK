import { generateBarcode, validateBarcode, validateDigitableLine } from '@generators/barcode';

describe('generateBarcode', () => {
  it('should generate a barcode and digitable line with expected structure', () => {
    const baseDate = new Date(Date.UTC(1997, 9, 7));
    const dueDate = new Date(Date.UTC(1997, 9, 7));

    const result = generateBarcode(
      {
        bankCode: '001',
        currencyCode: '9',
        dueDate,
        amount: 1.23,
        freeField: '1234567890123456789012345',
      },
      { baseDate },
    );

    expect(result.barcode).toMatch(/^\d{44}$/);
    expect(result.digitableLine).toMatch(/^\d{5}\.\d{5} \d{5}\.\d{6} \d{5}\.\d{6} \d \d{14}$/);
    expect(validateBarcode(result.barcode)).toBe(true);
    expect(validateDigitableLine(result.digitableLine)).toBe(true);
  });

  it('should include due date factor and amount at expected positions', () => {
    const baseDate = new Date(Date.UTC(1997, 9, 7));
    const dueDate = new Date(Date.UTC(1997, 9, 7));

    const { barcode } = generateBarcode(
      {
        bankCode: '001',
        currencyCode: '9',
        dueDate,
        amount: 1.23,
        freeField: '1234567890123456789012345',
      },
      { baseDate },
    );

    expect(barcode.slice(5, 9)).toBe('0000');
    expect(barcode.slice(9, 19)).toBe('0000000123');
  });

  it('should throw when free field is not 25 digits', () => {
    const invalidInput = {
      bankCode: '001',
      currencyCode: '9',
      dueDate: new Date(Date.UTC(1997, 9, 7)),
      amount: 10,
      freeField: '123',
    };

    expect(() => generateBarcode(invalidInput)).toThrow('Free field must have 25 digits');
  });
});
