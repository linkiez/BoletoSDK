import { renderBoletoToPdf } from '@generators/pdf/PdfRenderer';
import { generatePixPayload } from '@generators/qrcode/PixPayloadGenerator';
import { resolvePdfTemplateOptions } from '@generators/pdf/PdfTemplate';
import type { BoletoTemplateData } from '@templates/BoletoTemplate';
import PDFDocument from 'pdfkit';

function createData(): BoletoTemplateData {
  return {
    beneficiary: {
      name: 'ACME Corp',
      document: '12345678000195',
      address: 'Main Avenue, 1000',
    },
    payer: {
      name: 'John Doe',
      document: '12345678901',
      address: 'Sunset Street, 10',
    },
    payment: {
      documentNumber: 'DOC-001',
      ourNumber: '12345678',
      amount: 150.5,
      dueDate: new Date('2026-02-10'),
      barcode: '34100000000000000000000000000000000000000000',
      digitableLine: '34190.00000 00000.000000 00000.000000 0 00000000000000',
    },
    bank: {
      code: '341',
      name: 'ITAU UNIBANCO SA',
    },
  };
}

async function renderAndCollect(
  document: InstanceType<typeof PDFDocument>,
  data: BoletoTemplateData,
  options: ReturnType<typeof resolvePdfTemplateOptions>,
  dependencies: Parameters<typeof renderBoletoToPdf>[3] = {},
): Promise<Buffer> {
  await renderBoletoToPdf(document, data, options, dependencies);
  return new Promise<Buffer>((resolve) => {
    const chunks: Buffer[] = [];
    document.on('data', (chunk: Buffer) => chunks.push(chunk));
    document.on('end', () => resolve(Buffer.concat(chunks)));
    document.end();
  });
}

describe('renderBoletoToPdf - barcode rendering', () => {
  it('should call renderBarcodePng when includeBarcode is true', async () => {
    const document = new PDFDocument({ autoFirstPage: true, compress: false });
    const imageSpy = jest.spyOn(document, 'image').mockReturnThis();
    const barcodeCalls: string[] = [];
    const mockBarcode = jest.fn((code: string): Buffer => {
      barcodeCalls.push(code);
      return Buffer.alloc(10);
    });

    const options = resolvePdfTemplateOptions({ includeBarcode: true });
    await renderAndCollect(document, createData(), options, {
      renderBarcodePng: mockBarcode,
    });

    expect(mockBarcode).toHaveBeenCalledTimes(1);
    expect(barcodeCalls[0]).toBe('34100000000000000000000000000000000000000000');
    expect(imageSpy).toHaveBeenCalledTimes(1);
  });

  it('should not call barcode renderer when includeBarcode is false', async () => {
    const document = new PDFDocument({ autoFirstPage: true, compress: false });
    const mockBarcode = jest.fn((): Buffer => Buffer.alloc(10));

    const options = resolvePdfTemplateOptions({ includeBarcode: false });
    await renderAndCollect(document, createData(), options, {
      renderBarcodePng: mockBarcode,
    });

    expect(mockBarcode).not.toHaveBeenCalled();
  });

  it('should not call barcode renderer when barcode field is empty', async () => {
    const document = new PDFDocument({ autoFirstPage: true, compress: false });
    const mockBarcode = jest.fn((): Buffer => Buffer.alloc(10));
    const dataWithoutBarcode: BoletoTemplateData = {
      ...createData(),
      payment: { ...createData().payment, barcode: '' },
    };

    const options = resolvePdfTemplateOptions({ includeBarcode: true });
    await renderAndCollect(document, dataWithoutBarcode, options, {
      renderBarcodePng: mockBarcode,
    });

    expect(mockBarcode).not.toHaveBeenCalled();
  });

  it('should not call document.image when includeBarcode is false', async () => {
    const document = new PDFDocument({ autoFirstPage: true, compress: false });
    const imageSpy = jest.spyOn(document, 'image').mockReturnThis();

    const options = resolvePdfTemplateOptions({ includeBarcode: false });
    await renderAndCollect(document, createData(), options);

    expect(imageSpy).not.toHaveBeenCalled();
  });

  it('should pass barcode dimensions to document.image', async () => {
    const document = new PDFDocument({ autoFirstPage: true, compress: false });
    const imageSpy = jest.spyOn(document, 'image').mockReturnThis();

    const options = resolvePdfTemplateOptions({
      includeBarcode: true,
      barcode: { width: 200, height: 30 },
    });
    await renderAndCollect(document, createData(), options, {
      renderBarcodePng: jest.fn((): Buffer => Buffer.alloc(10)),
    });

    expect(imageSpy).toHaveBeenCalledWith(
      expect.any(Buffer),
      expect.any(Number),
      expect.any(Number),
      expect.objectContaining({ width: 200, height: 30 }),
    );
  });

  it('should validate PIX payload before rendering QR code', async () => {
    const document = new PDFDocument({ autoFirstPage: true, compress: false });
    const validPixPayload = generatePixPayload({
      key: '12345678900',
      amount: 10,
      merchantName: 'ACME STORE',
      merchantCity: 'SAO PAULO',
      transactionId: 'INV001',
    });
    const dataWithPix: BoletoTemplateData = {
      ...createData(),
      payment: {
        ...createData().payment,
        pix: {
          payload: `${validPixPayload.slice(0, -4)}FFFF`,
        },
      },
    };

    const options = resolvePdfTemplateOptions({ includePixQr: true });

    await expect(renderAndCollect(document, dataWithPix, options)).rejects.toThrow(
      'PIX payload CRC is invalid',
    );
  });
});
