import { ItauTemplate } from '@templates';
import type { BoletoTemplateData } from '@templates/BoletoTemplate';

describe('ItauTemplate', () => {
  it('should render core boleto information for Itau', () => {
    const template = new ItauTemplate();
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
    };

    const html = template.render(data);

    expect(html).toContain('Itaú');
    expect(html).toContain('341-7');
    expect(html).toContain('Cedente');
    expect(html).toContain('ACME Corp');
    expect(html).toContain('Sacado:');
    expect(html).toContain('John Doe');
  });
});
