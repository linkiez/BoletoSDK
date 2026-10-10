import { renderBoletoToPdf } from '@generators/pdf/PdfRenderer';
import { PdfFormCanvas } from '@generators/pdf/PdfFormCanvas';
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
  it('should use the associated company name and logo in the PDF header', async () => {
    const document = new PDFDocument({ size: 'A4', margin: 40 });
    const logo = Buffer.alloc(24);
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]).copy(logo);
    logo.writeUInt32BE(1, 16);
    logo.writeUInt32BE(1, 20);
    const imageSpy = jest.spyOn(document, 'image').mockReturnThis();
    const textSpy = jest.spyOn(PdfFormCanvas.prototype, 'text');
    const data = {
      ...createData(),
      company: { name: 'Bank Account Company', logo },
    };

    await renderAndCollect(document, data, resolvePdfTemplateOptions());

    expect(textSpy.mock.calls.some(([text]) => text === 'Bank Account Company')).toBe(true);
    expect(imageSpy).toHaveBeenCalledWith(
      logo,
      expect.any(Number),
      expect.any(Number),
      expect.objectContaining({ fit: [32, 32] }),
    );
    expect(textSpy).toHaveBeenCalledWith(
      'ACME Corp',
      expect.any(Number),
      expect.any(Number),
      expect.any(Number),
      expect.objectContaining({ font: 'bold' }),
    );
    textSpy.mockRestore();
  });

  it.each([
    ['missing', undefined],
    ['invalid', Buffer.from('not-an-image')],
  ])('should use company initials when the associated company logo is %s', async (_state, logo) => {
    const document = new PDFDocument({ size: 'A4', margin: 40 });
    const textSpy = jest.spyOn(PdfFormCanvas.prototype, 'text');
    const data = {
      ...createData(),
      company: { name: 'Bank Account Company', logo },
    };

    await renderAndCollect(document, data, resolvePdfTemplateOptions());

    expect(textSpy).toHaveBeenCalledWith(
      'Bank Account Company',
      expect.any(Number),
      expect.any(Number),
      expect.any(Number),
      expect.objectContaining({ font: 'bold' }),
    );
    expect(textSpy).toHaveBeenCalledWith(
      'B',
      expect.any(Number),
      expect.any(Number),
      28,
      expect.objectContaining({ color: '#FFFFFF' }),
    );
    textSpy.mockRestore();
  });

  it('should fall back to company initials when PDFKit rejects logo bytes', async () => {
    const document = new PDFDocument({ size: 'A4', margin: 40 });
    const logo = Buffer.alloc(24);
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]).copy(logo);
    logo.writeUInt32BE(1, 16);
    logo.writeUInt32BE(1, 20);
    const imageSpy = jest.spyOn(document, 'image').mockImplementation(() => {
      throw new Error('Invalid image data');
    });
    const textSpy = jest.spyOn(PdfFormCanvas.prototype, 'text');
    const data = {
      ...createData(),
      company: { name: 'Bank Account Company', logo },
    };

    try {
      await renderAndCollect(document, data, {
        ...resolvePdfTemplateOptions(),
        includeBarcode: false,
      });

      expect(imageSpy).toHaveBeenCalledWith(
        logo,
        expect.any(Number),
        expect.any(Number),
        expect.objectContaining({ fit: [32, 32] }),
      );
      expect(textSpy).toHaveBeenCalledWith(
        'B',
        expect.any(Number),
        expect.any(Number),
        28,
        expect.objectContaining({ color: '#FFFFFF' }),
      );
    } finally {
      textSpy.mockRestore();
      imageSpy.mockRestore();
    }
  });

  it('should give the receipt a side-by-side party layout and a prominent payment summary', async () => {
    const document = new PDFDocument({ size: 'A4', margin: 40 });
    const fillSpy = jest.spyOn(document, 'fill');
    const textSpy = jest.spyOn(PdfFormCanvas.prototype, 'text');
    const data = createData();

    await renderAndCollect(document, data, resolvePdfTemplateOptions());

    const beneficiary = textSpy.mock.calls.filter(([text]) => text === data.beneficiary.name).at(1);
    const payer = textSpy.mock.calls.find(([text]) => text === data.payer.name);
    const amount = textSpy.mock.calls.find(([text]) => text.endsWith('150,50'));
    const dueDate = textSpy.mock.calls.find(([text]) => text === '10/02/2026');
    expect(beneficiary).toBeDefined();
    expect(payer).toBeDefined();
    expect(payer?.[2]).toBe(beneficiary?.[2]);
    expect(payer?.[1]).toBeGreaterThan(beneficiary?.[1] ?? 0);
    expect(amount?.[4]).toMatchObject({ size: 18, font: 'bold', align: 'right' });
    expect(dueDate?.[4]).toMatchObject({ size: 12, font: 'bold', color: '#E30016' });
    expect(fillSpy).toHaveBeenCalledWith('#E30016');
    textSpy.mockRestore();
  });

  it('should render a compact payer receipt and compensation form with actual party data', async () => {
    const document = new PDFDocument({ size: 'A4', margin: 40 });
    const textSpy = jest.spyOn(document, 'text');
    const pageSpy = jest.spyOn(document, 'addPage');

    await renderAndCollect(document, createData(), resolvePdfTemplateOptions());

    const text = textSpy.mock.calls.map(([value]) => value).join('\n');
    expect(text).toContain('RECIBO DO PAGADOR');
    expect(text).toContain('DESTAQUE AQUI');
    expect(text).toContain('FICHA DE COMPENSAÇÃO');
    expect(text).toContain('Main Avenue, 1000');
    expect(text).toContain('Sunset Street, 10');
    expect(text).toContain('DOC-001');
    expect(text).not.toContain('INDUSTRIAL INTEGRITY');
    expect(text).not.toContain('REGISTRO EFETIVO');
    expect(pageSpy).not.toHaveBeenCalled();
  });

  it('should fit the detailed form, instructions and PIX on one A4 page without duplicate fields', async () => {
    const document = new PDFDocument({ size: 'A4', margin: 40 });
    const textSpy = jest.spyOn(document, 'text');
    const pageSpy = jest.spyOn(document, 'addPage');
    const data = createData();
    data.instructions = [
      'Documento de demonstração. Não utilizar para pagamento.',
      'Juros de mora de 1,00% ao mês após o vencimento.',
      'Multa de 2,00% após o vencimento.',
      'Referente ao fornecimento de peças usinadas.',
      'Não receber após 30 dias do vencimento.',
    ];
    data.additionalInfo = {
      agenciaCodigoCedente: '0000 / 00000-0',
      dataDocumento: '01/02/2026',
      dataProcessamento: '01/02/2026',
      especie: 'DM',
      aceite: 'N',
      Carteira: '109',
      Referencia: 'DEMO-001',
    };
    data.payment.pix = {
      payload: generatePixPayload({
        key: 'demonstracao@example.invalid',
        amount: data.payment.amount,
        merchantName: 'DEMONSTRACAO',
        merchantCity: 'SAO PAULO',
        transactionId: 'DEMO001',
      }),
    };

    await renderAndCollect(document, data, resolvePdfTemplateOptions({ includePixQr: true }));

    const text = textSpy.mock.calls.map(([value]) => value).join('\n');
    expect(text).toContain('Referencia: DEMO-001');
    expect(text).toContain(data.payment.pix.payload);
    expect(text).not.toContain('agenciaCodigoCedente:');
    expect(text).not.toContain('INDUSTRIAL INTEGRITY');
    expect(pageSpy).not.toHaveBeenCalled();
    expect(document.y).toBeLessThanOrEqual(document.page.height - 40);
  });

  it.each(['simple', 'instructions', 'detailed'] as const)(
    'should preserve optional section visibility in the %s layout',
    async (layout) => {
      const document = new PDFDocument({ size: 'A4', margin: 40 });
      const textSpy = jest.spyOn(document, 'text');
      const data = createData();
      data.instructions = ['UNIQUE_INSTRUCTION'];
      data.additionalInfo = { Referencia: 'UNIQUE_REFERENCE', walletCode: '109' };

      await renderAndCollect(document, data, resolvePdfTemplateOptions({ layout }));

      const text = textSpy.mock.calls.map(([value]) => value).join('\n');
      expect(text.includes('UNIQUE_INSTRUCTION')).toBe(layout !== 'simple');
      expect(text.includes('UNIQUE_REFERENCE')).toBe(layout === 'detailed');
      expect(text).toContain('109');
      expect(text).not.toContain('PAGUE COM PIX');
      expect(text).not.toContain('PIX COPIA E COLA');
    },
  );

  it('should keep standard bank identifiers on the same text baseline', async () => {
    const document = new PDFDocument({ size: 'A4', margin: 40 });
    const textSpy = jest.spyOn(PdfFormCanvas.prototype, 'text');
    const data = createData();
    data.additionalInfo = {
      dataDocumento: '01/02/2026',
      dataProcessamento: '02/02/2026',
      especie: 'DM',
      aceite: 'N',
    };

    await renderAndCollect(document, data, resolvePdfTemplateOptions());

    const identifiers = [
      '01/02/2026',
      data.payment.documentNumber,
      'DM / N',
      '02/02/2026',
      data.payment.ourNumber,
    ];
    const baselines = identifiers.map(
      (value) => textSpy.mock.calls.filter(([text]) => text === value).at(-1)?.[2],
    );
    for (const baseline of baselines) {
      expect(baseline).toBeDefined();
      expect(baseline).toBe(baselines[0]);
    }
    textSpy.mockRestore();
  });

  it('should wrap long party data inside measured cells without crossing page margins', async () => {
    const document = new PDFDocument({ size: 'A4', margin: 40 });
    const textSpy = jest.spyOn(document, 'text');
    const rectSpy = jest.spyOn(document, 'rect');
    const data = createData();
    data.beneficiary.name = 'BENEFICIARY WITH A LONG COMPANY NAME '.repeat(4);
    data.payer.name = 'PAYER WITH A LONG COMPANY NAME '.repeat(4);
    data.payer.address = 'Long street address and neighborhood information '.repeat(4);
    data.payment.documentNumber = 'DOCUMENT-'.repeat(8);

    await renderAndCollect(document, data, resolvePdfTemplateOptions());

    const text = textSpy.mock.calls.map(([value]) => value).join('\n');
    expect(text).toContain(data.beneficiary.name);
    expect(text).toContain(data.payer.address);
    expect(text).toContain(data.payment.documentNumber);
    for (const [x, y, width, height] of rectSpy.mock.calls) {
      expect(x).toBeGreaterThanOrEqual(40);
      expect(y).toBeGreaterThanOrEqual(40);
      expect(x + width).toBeLessThanOrEqual(document.page.width - 40 + 0.01);
      expect(y + height).toBeLessThanOrEqual(document.page.height - 40 + 0.01);
    }
  });

  it('should paginate a long list of instructions without losing content', async () => {
    const document = new PDFDocument({ size: 'A4', margin: 40 });
    const pageSpy = jest.spyOn(document, 'addPage');
    const textSpy = jest.spyOn(document, 'text');
    const data = createData();
    data.instructions = Array.from({ length: 90 }, (_, index) => `Instruction ${index + 1}.`);
    data.additionalInfo = { Referencia: 'LAST_REFERENCE' };

    await renderAndCollect(document, data, resolvePdfTemplateOptions());

    const text = textSpy.mock.calls.map(([value]) => value).join('\n');
    for (const instruction of data.instructions) expect(text).toContain(instruction);
    expect(text).toContain('LAST_REFERENCE');
    expect(text).toContain('FICHA DE COMPENSAÇÃO');
    expect(pageSpy).toHaveBeenCalled();
  });

  it.each([2, 20])(
    'should align the adjustment column with a panel of %i instructions',
    async (count) => {
      const document = new PDFDocument({ size: 'A4', margin: 40 });
      const rowSpy = jest.spyOn(PdfFormCanvas.prototype, 'drawRow');
      const data = createData();
      data.instructions = Array.from({ length: count }, (_, index) => `Instruction ${index + 1}.`);

      await renderAndCollect(document, data, resolvePdfTemplateOptions());

      const notes = rowSpy.mock.calls.find(([cells]) =>
        cells[0]?.label.startsWith('INSTRUÇÕES DE RESPONSABILIDADE'),
      );
      const total = rowSpy.mock.calls.find(([cells]) => cells[0]?.label === '(=) VALOR COBRADO');
      expect(notes).toBeDefined();
      expect(total).toBeDefined();
      expect((total?.[2] ?? 0) + (total?.[4] ?? 0)).toBeCloseTo(
        (notes?.[2] ?? 0) + (notes?.[4] ?? 0),
      );
      rowSpy.mockRestore();
    },
  );

  it('should use the supplied fonts and highlight the due date without changing its value', async () => {
    const document = new PDFDocument({ size: 'A4', margin: 40 });
    const fontSpy = jest.spyOn(document, 'font');
    const colorSpy = jest.spyOn(document, 'fillColor');
    const textSpy = jest.spyOn(document, 'text');
    const data = createData();
    const before = JSON.stringify(data);

    await renderAndCollect(document, data, resolvePdfTemplateOptions(), {
      fonts: { regular: 'Times-Roman', bold: 'Times-Bold', mono: 'Courier-Bold' },
    });

    expect(fontSpy).toHaveBeenCalledWith('Times-Roman');
    expect(fontSpy).toHaveBeenCalledWith('Times-Bold');
    expect(fontSpy).toHaveBeenCalledWith('Courier-Bold');
    expect(colorSpy).toHaveBeenCalledWith('#E30016');
    expect(textSpy.mock.calls.filter(([text]) => text === '10/02/2026')).toHaveLength(2);
    expect(JSON.stringify(data)).toBe(before);
  });

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
