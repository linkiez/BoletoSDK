import { PdfFormCanvas } from '@generators/pdf/PdfFormCanvas';
import PDFDocument from 'pdfkit';

function createCanvas(): PdfFormCanvas {
  const document = new PDFDocument({ size: 'A4', margin: 40 });
  document.resume();
  return new PdfFormCanvas(document, {
    regular: 'Helvetica',
    bold: 'Helvetica-Bold',
    mono: 'Courier',
  });
}

describe('PdfFormCanvas', () => {
  it('should render borderless summary fields with measured line spacing and sans-serif labels', () => {
    const canvas = createCanvas();
    const cells = [
      {
        label: 'PAYMENT SUMMARY',
        value: 'First line\nSecond line',
        detail: 'Additional details',
        fraction: 1,
        borderless: true,
        shaded: true,
        style: { size: 12, lineGap: 4 },
      },
    ];
    const strokeSpy = jest.spyOn(canvas.document, 'fillAndStroke');
    const textSpy = jest.spyOn(canvas.document, 'text');
    const fontSpy = jest.spyOn(canvas.document, 'font');
    const height = canvas.rowHeight(cells);

    canvas.row(cells);

    expect(strokeSpy).not.toHaveBeenCalled();
    expect(textSpy.mock.calls.find(([text]) => text === cells[0].value)?.at(-1)).toMatchObject({
      lineGap: 4,
    });
    expect(fontSpy).not.toHaveBeenCalledWith('Courier');
    expect(canvas.document.y).toBeCloseTo(40 + height);
    canvas.document.end();
  });

  it('should match wrapped text height to cell height without clipping or ellipses', () => {
    const canvas = createCanvas();
    const value = 'Value with several words '.repeat(8);
    const cells = [{ label: 'WRAPPED LABEL', value, fraction: 1, detail: 'Address details' }];
    const height = canvas.rowHeight(cells, 180);
    const textSpy = jest.spyOn(canvas.document, 'text');

    canvas.drawRow(cells, 40, 40, 180, height);

    expect(height).toBeGreaterThan(canvas.textHeight(value, 168));
    const valueCall = textSpy.mock.calls.find(([text]) => text === value);
    expect(valueCall?.at(-1)).not.toHaveProperty('height');
    expect(valueCall?.at(-1)).not.toHaveProperty('ellipsis');
    canvas.document.end();
  });

  it('should move an entire row to a new page if it does not fit', () => {
    const canvas = createCanvas();
    canvas.document.y = canvas.document.page.height - 42;
    const pageSpy = jest.spyOn(canvas.document, 'addPage');
    const rectSpy = jest.spyOn(canvas.document, 'rect');

    canvas.row([{ label: 'FIELD', value: 'Value', fraction: 1 }]);

    expect(pageSpy).toHaveBeenCalledTimes(1);
    expect(rectSpy.mock.calls[0]?.[1]).toBe(40);
    expect(canvas.document.y).toBeGreaterThan(40);
    canvas.document.end();
  });

  it('should fail explicitly rather than silently truncating a block larger than a page', () => {
    const canvas = createCanvas();
    expect(() => canvas.reserve(canvas.pageHeight + 1)).toThrow(
      'PDF form block exceeds the printable page height',
    );
    canvas.document.end();
  });

  it('should reject columns without usable text width', () => {
    const canvas = createCanvas();
    expect(() => canvas.rowHeight([{ label: '', value: 'Value', fraction: 1 }], 10)).toThrow(
      'PDF form column is too narrow',
    );
    canvas.document.end();
  });

  it('should allocate the tallest cell height to all cells in the row', () => {
    const canvas = createCanvas();
    const rectSpy = jest.spyOn(canvas.document, 'rect');
    canvas.row([
      { label: 'SHORT', value: 'One', fraction: 0.5 },
      { label: 'LONG', value: 'Line\n'.repeat(10), fraction: 0.5 },
    ]);
    const firstHeight = rectSpy.mock.calls[0]?.[3];
    expect(firstHeight).toBeGreaterThan(30);
    expect(rectSpy.mock.calls[1]?.[3]).toBe(firstHeight);
    canvas.document.end();
  });
});
