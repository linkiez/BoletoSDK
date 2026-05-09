import { generateBoletoPdfBuffer, generatePixPayload } from '@generators';
import type { BoletoTemplateData } from '@templates/BoletoTemplate';

describe('generateBoletoPdfBuffer', () => {
  it('should generate a PDF buffer with basic metadata', async () => {
    const data: BoletoTemplateData = {
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
      instructions: ['Pagar antes do vencimento'],
    };

    const buffer = await generateBoletoPdfBuffer(data, {
      title: 'Boleto - ITAU',
      author: 'BoletoSDK',
    });

    expect(Buffer.isBuffer(buffer)).toBe(true);
    expect(buffer.length).toBeGreaterThan(0);
    expect(buffer.subarray(0, 4).toString('ascii')).toBe('%PDF');
  });

  it('should include PIX QR code when provided', async () => {
    const pixPayload = generatePixPayload({
      key: '12345678900',
      amount: 10,
      merchantName: 'ACME STORE',
      merchantCity: 'SAO PAULO',
      transactionId: 'INV001',
    });

    const data: BoletoTemplateData = {
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
        pix: {
          payload: pixPayload,
        },
      },
      bank: {
        code: '341',
        name: 'ITAU UNIBANCO SA',
      },
    };

    const buffer = await generateBoletoPdfBuffer(data, {
      includePixQr: true,
    });

    expect(Buffer.isBuffer(buffer)).toBe(true);
    expect(buffer.length).toBeGreaterThan(0);
  });

  it('should honor layout options for instructions and additional info', async () => {
    const data: BoletoTemplateData = {
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
      instructions: ['Pagar antes do vencimento'],
      additionalInfo: {
        Referencia: 'INV-001',
      },
    };

    const detailedBuffer = await generateBoletoPdfBuffer(data, {
      layout: 'detailed',
      compress: false,
    });

    const detailedContent = detailedBuffer.toString('latin1');
    expect(detailedContent).toContain('496e737472');
    expect(detailedContent).toContain('6d61e7f565732061646963696f6e616973');

    const simpleBuffer = await generateBoletoPdfBuffer(data, {
      layout: 'simple',
      compress: false,
    });

    const simpleContent = simpleBuffer.toString('latin1');
    expect(simpleContent).not.toContain('496e737472');
    expect(simpleContent).not.toContain('6d61e7f565732061646963696f6e616973');
  });
});
