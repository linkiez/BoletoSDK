import type { BoletoTemplate, BoletoTemplateData } from '@templates/BoletoTemplate';
import { TemplateRenderer } from '@templates/TemplateRenderer';
import { generatePixPayload } from '@generators';

describe('TemplateRenderer', () => {
  it('should render HTML using the provided template', () => {
    const renderer = new TemplateRenderer();
    const template: BoletoTemplate = {
      render: (data: BoletoTemplateData) => `Hello ${data.payer.name}`,
    };

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
        name: 'BANCO ITAU SA',
      },
    };

    const result = renderer.render(template, data);

    expect(result).toBe('Hello John Doe');
  });

  it('should render HTML with PIX QR code when payload is provided', async () => {
    const renderer = new TemplateRenderer();
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
        name: 'BANCO ITAU SA',
      },
    };

    const html = await renderer.renderHtmlWithPixQrCode(data, undefined, {
      renderPixQrCodeSvg: jest.fn(async (payload: string) => `<svg data-payload="${payload}" />`),
    });

    expect(html).toContain('PIX');
    expect(html).toContain('data-payload');
    expect(html).toContain(pixPayload);
  });
});
