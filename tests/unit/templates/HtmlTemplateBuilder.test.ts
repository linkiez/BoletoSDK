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
    expect(html).toContain('Boleto Itaú');
    expect(html).toContain('Código do banco: 341');
    expect(html).toContain('Beneficiário');
    expect(html).toContain('ACME Corp');
    expect(html).toContain('Pagador');
    expect(html).toContain('John Doe');
    expect(html).toContain('data-barcode="34100000000000000000000000000000000000000000"');
    expect(html).toContain('Linha digitável');
    expect(html).toContain('Pagar antes do vencimento');
  });
});
