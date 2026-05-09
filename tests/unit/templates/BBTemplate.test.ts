import { BBTemplate } from '@templates';
import type { BoletoTemplateData } from '@templates/BoletoTemplate';

describe('BBTemplate', () => {
  it('should render core boleto information for Banco do Brasil', () => {
    const template = new BBTemplate();
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
        barcode: '00100000000000000000000000000000000000000000',
        digitableLine: '00190.00000 00000.000000 00000.000000 0 00000000000000',
      },
      bank: {
        code: '001',
        name: 'BANCO DO BRASIL S.A.',
      },
    };

    const html = template.render(data);

    expect(html).toContain('Banco do Brasil');
    expect(html).toContain('001-9');
    expect(html).toContain('Cedente');
    expect(html).toContain('ACME Corp');
    expect(html).toContain('Sacado:');
    expect(html).toContain('John Doe');
  });
});
