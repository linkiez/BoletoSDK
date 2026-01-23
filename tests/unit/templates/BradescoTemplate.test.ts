import { BradescoTemplate } from '@templates';
import type { BoletoTemplateData } from '@templates/BoletoTemplate';

describe('BradescoTemplate', () => {
  it('should render core boleto information for Bradesco', () => {
    const template = new BradescoTemplate();
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
        barcode: '23700000000000000000000000000000000000000000',
        digitableLine: '23790.00000 00000.000000 00000.000000 0 00000000000000',
      },
      bank: {
        code: '237',
        name: 'BRADESCO S.A.',
      },
    };

    const html = template.render(data);

    expect(html).toContain('Bradesco');
    expect(html).toContain('Código do banco: 237');
    expect(html).toContain('Beneficiário');
    expect(html).toContain('ACME Corp');
    expect(html).toContain('Pagador');
    expect(html).toContain('John Doe');
  });
});
