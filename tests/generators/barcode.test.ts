import {
  generateBarcode,
  renderI2of5Svg,
  validateBarcode,
  validateDigitableLine,
} from '../../src/generators/barcode';

describe('Barcode generation roadmap coverage', () => {
  const dueDate = new Date(Date.UTC(1997, 9, 7));
  const barcodeInput = {
    bankCode: '341',
    currencyCode: '9',
    dueDate,
    amount: 150.5,
    freeField: '1234567890123456789012345',
  };

  it('should generate a valid I2of5 barcode and render SVG output', () => {
    const { barcode } = generateBarcode(barcodeInput, { baseDate: dueDate });

    const svg = renderI2of5Svg(barcode, { height: 48 });

    expect(barcode).toMatch(/^\d{44}$/);
    expect(validateBarcode(barcode)).toBe(true);
    expect(svg).toContain('<svg');
    expect(svg).toContain('<rect');
  });

  it('should generate a digitable line that matches the barcode', () => {
    const { barcode, digitableLine } = generateBarcode(barcodeInput, { baseDate: dueDate });

    expect(validateBarcode(barcode)).toBe(true);
    expect(validateDigitableLine(digitableLine)).toBe(true);
    expect(digitableLine).toMatch(/^\d{5}\.\d{5} \d{5}\.\d{6} \d{5}\.\d{6} \d \d{14}$/);
  });
});
