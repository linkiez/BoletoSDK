import {
  generateDirectPdfBuffer,
  generateDirectPdfBuffers,
  generateDirectPdfStream,
  generateDirectPdfStreams,
} from '@generators/pdf/DirectPdfGenerator';
import {
  generateBoletoPdfStream,
  generateBoletosPdfBuffer,
  generateBoletosPdfStream,
} from '@generators/pdf/BoletoPdfGenerator';
import { generatePixPayload } from '@generators/qrcode/PixPayloadGenerator';
import type { BoletoTemplateData } from '@templates/BoletoTemplate';
import type { Readable } from 'node:stream';

function createData(documentNumber = 'DOC-001'): BoletoTemplateData {
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
      documentNumber,
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
    instructions: ['Pagar antes do vencimento'],
    additionalInfo: {
      Referencia: 'INV-001',
    },
  };
}

describe('generateDirectPdfBuffer', () => {
  it('should generate a valid PDF header', async () => {
    const buffer = await generateDirectPdfBuffer(createData());

    expect(Buffer.isBuffer(buffer)).toBe(true);
    expect(buffer.length).toBeGreaterThan(0);
    expect(buffer.subarray(0, 4).toString('ascii')).toBe('%PDF');
  });

  it('should respect simple layout by omitting optional sections', async () => {
    const buffer = await generateDirectPdfBuffer(createData(), {
      layout: 'simple',
      compress: false,
    });

    const content = buffer.toString('latin1');
    expect(content).not.toContain('496e737472');
    expect(content).not.toContain('6d61e7f565732061646963696f6e616973');
  });

  it('should generate PDF with barcode image by default', async () => {
    const buffer = await generateDirectPdfBuffer(createData());

    expect(Buffer.isBuffer(buffer)).toBe(true);
    expect(buffer.length).toBeGreaterThan(0);
  });

  it('should generate PDF without barcode image when includeBarcode is false', async () => {
    const buffer = await generateDirectPdfBuffer(createData(), {
      includeBarcode: false,
      compress: false,
    });

    expect(Buffer.isBuffer(buffer)).toBe(true);
    expect(buffer.length).toBeGreaterThan(0);
  });

  it('should accept custom barcode dimensions', async () => {
    const buffer = await generateDirectPdfBuffer(createData(), {
      barcode: { width: 200, height: 30 },
    });

    expect(Buffer.isBuffer(buffer)).toBe(true);
    expect(buffer.length).toBeGreaterThan(0);
  });
});

describe('generateDirectPdfStream', () => {
  it('should generate a readable stream with valid PDF signature', async () => {
    const stream = await generateDirectPdfStream(createData('DOC-201'));
    const buffer = await streamToBuffer(stream);

    expect(buffer.subarray(0, 4).toString('ascii')).toBe('%PDF');
  });
});

describe('generateDirectPdfBuffers', () => {
  it('should throw for an empty boleto list', async () => {
    await expect(generateDirectPdfBuffers([])).rejects.toThrow(
      'At least one boleto is required to generate PDF',
    );
  });

  it('should generate a valid PDF for multiple boletos', async () => {
    const buffer = await generateDirectPdfBuffers([createData('DOC-001'), createData('DOC-002')], {
      boletosPerPage: 2,
    });

    expect(buffer.subarray(0, 4).toString('ascii')).toBe('%PDF');
    expect(buffer.length).toBeGreaterThan(0);
  });
});

describe('generateDirectPdfStreams', () => {
  it('should stream a valid PDF for multiple boletos', async () => {
    const stream = await generateDirectPdfStreams([createData('DOC-301'), createData('DOC-302')]);
    const buffer = await streamToBuffer(stream);

    expect(buffer.subarray(0, 4).toString('ascii')).toBe('%PDF');
    expect(buffer.length).toBeGreaterThan(0);
  });

  it('should propagate stream errors when rendering fails', async () => {
    const data: BoletoTemplateData = {
      ...createData('DOC-303'),
      payment: {
        ...createData('DOC-303').payment,
        pix: {
          payload: generatePixPayload({
            key: '12345678900',
            amount: 10,
            merchantName: 'ACME STORE',
            merchantCity: 'SAO PAULO',
            transactionId: 'INV001',
          }),
        },
      },
    };

    const stream = await generateDirectPdfStreams(
      [data],
      { includePixQr: true },
      {
        renderPixQrCodePng: async () => {
          throw new Error('QR render failed');
        },
      },
    );

    await expect(streamToBuffer(stream)).rejects.toThrow('QR render failed');
  });
});

describe('generateBoletosPdfBuffer', () => {
  it('should expose batch generation through the public PDF API', async () => {
    const buffer = await generateBoletosPdfBuffer([createData('DOC-101'), createData('DOC-102')], {
      boletosPerPage: 1,
    });

    expect(buffer.subarray(0, 4).toString('ascii')).toBe('%PDF');
  });
});

describe('public stream PDF API', () => {
  it('should expose single stream generation through public PDF API', async () => {
    const stream = await generateBoletoPdfStream(createData('DOC-401'));
    const buffer = await streamToBuffer(stream);

    expect(buffer.subarray(0, 4).toString('ascii')).toBe('%PDF');
  });

  it('should expose batch stream generation through public PDF API', async () => {
    const stream = await generateBoletosPdfStream([createData('DOC-501'), createData('DOC-502')]);
    const buffer = await streamToBuffer(stream);

    expect(buffer.subarray(0, 4).toString('ascii')).toBe('%PDF');
  });
});

async function streamToBuffer(stream: Readable): Promise<Buffer> {
  const chunks: Buffer[] = [];
  return new Promise<Buffer>((resolve, reject) => {
    stream.on('data', (chunk: Buffer | string) => {
      chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
    });
    stream.on('end', () => resolve(Buffer.concat(chunks)));
    stream.on('error', reject);
  });
}
