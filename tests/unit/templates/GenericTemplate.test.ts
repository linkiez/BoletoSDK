import type { BoletoTemplateData } from '@templates/BoletoTemplate';
import { GenericTemplate } from '@templates/GenericTemplate';

describe('GenericTemplate', () => {
  it('should render basic boleto information', () => {
    const template = new GenericTemplate();
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

    const html = template.render(data);

    expect(html).toContain('Boleto');
    expect(html).toContain('Cedente');
    expect(html).toContain('ACME Corp');
    expect(html).toContain('Sacado:');
    expect(html).toContain('John Doe');
    expect(html).toContain('341-7');
  });
});
