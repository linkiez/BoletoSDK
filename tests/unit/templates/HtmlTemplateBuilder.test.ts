import { buildBoletoHtml } from '@templates';
import type { BoletoTemplateData } from '@templates/BoletoTemplate';

describe('buildBoletoHtml', () => {
  it('should render HTML with core sections and data', () => {
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

    const html = buildBoletoHtml(data, {
      title: 'Boleto - Itaú',
      heading: 'Boleto Itaú',
      bankCodeLabel: 'Código do banco',
    });

    expect(html).toContain('<title>Boleto - Itaú</title>');
    expect(html).toContain('BoletoCodigoBanco');
    expect(html).toContain('341-7');
    expect(html).toContain('Cedente');
    expect(html).toContain('ACME Corp');
    expect(html).toContain('Sacado:');
    expect(html).toContain('John Doe');
    expect(html).toContain('data-barcode="34100000000000000000000000000000000000000000"');
    expect(html).toContain('34190.00000 00000.000000 00000.000000 0 00000000000000');
    expect(html).toContain('Pagar antes do vencimento');
    expect(html).toContain('Recibo do Sacado - Autenticação Mecânica');
    expect(html).toContain('Ficha de Compensação - Autenticação Mecânica');
  });

  it('should render PIX section when payload is provided', () => {
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
          payload: '00020101021226830014br.gov.bcb.pix01091234567890260203ABC',
          qrCodeSvg: '<svg aria-label="PIX" />',
        },
      },
      bank: {
        code: '341',
        name: 'ITAU UNIBANCO SA',
      },
    };

    const html = buildBoletoHtml(data);

    expect(html).toContain('PIX');
    expect(html).toContain('BoletoPixPayload');
    expect(html).toContain('br.gov.bcb.pix');
    expect(html).toContain('<svg aria-label="PIX" />');
  });

  it('should hide instructions and additional info in simple layout', () => {
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
        Referencia: 'FAT-001',
      },
    };

    const html = buildBoletoHtml(data, { layout: 'simple' });

    expect(html).not.toContain('Instruções');
    expect(html).not.toContain('Referencia: FAT-001');
  });

  it('should show instructions only in instructions layout', () => {
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
        Referencia: 'FAT-001',
      },
    };

    const html = buildBoletoHtml(data, { layout: 'instructions' });

    expect(html).toContain('Instruções');
    expect(html).toContain('Pagar antes do vencimento');
    expect(html).not.toContain('Referencia: FAT-001');
  });
});
