import { renderBoletoToPdf } from '@generators/pdf/PdfRenderer';
import { PdfFormCanvas } from '@generators/pdf/PdfFormCanvas';
import { resolvePdfTemplateOptions } from '@generators/pdf/PdfTemplate';
import type { BoletoTemplateData } from '@templates/BoletoTemplate';
import PDFDocument from 'pdfkit';

describe('PDF collection amount fields', () => {
  afterEach(() => jest.restoreAllMocks());

  it.each(['simple', 'instructions', 'detailed'] as const)(
    'should print supplied charges in the %s form without changing nominal identifiers',
    async (layout) => {
      const document = new PDFDocument({ size: 'A4', margin: 40 });
      document.resume();
      const rowSpy = jest.spyOn(PdfFormCanvas.prototype, 'drawRow');
      const textSpy = jest.spyOn(document, 'text');
      const data: BoletoTemplateData = {
        beneficiary: { name: 'DEMO', document: '00000000000000', address: 'Demo street' },
        payer: { name: 'DEMO PAYER', document: '00000000000', address: 'Demo street' },
        bank: { code: '341', name: 'ITAU' },
        payment: {
          documentNumber: 'DEMO-1',
          ourNumber: '109/00000001-0',
          amount: 10,
          dueDate: new Date('2026-10-19'),
          barcode: '34100000000000000000000000000000000000000000',
          digitableLine: '34190.00000 00000.000000 00000.000000 0 00000000001000',
        },
        additionalInfo: {
          penaltyAmount: 'R$ 0,20',
          interestAmount: 'R$ 0,10',
          chargedAmount: 'R$ 10,30',
        },
      };
      const originalPayment = { ...data.payment };

      try {
        await renderBoletoToPdf(
          document,
          data,
          resolvePdfTemplateOptions({ layout, includeBarcode: false }),
        );
        for (const [label, value] of [
          ['(+) MORA / MULTA', 'R$ 0,20'],
          ['(+) OUTROS ACRÉSCIMOS', 'R$ 0,10'],
          ['(=) VALOR COBRADO', 'R$ 10,30'],
        ]) {
          expect(
            rowSpy.mock.calls.flatMap(([cells]) => cells).find((cell) => cell.label === label),
          ).toMatchObject({ value });
        }
        expect(data.payment).toEqual(originalPayment);
        const text = textSpy.mock.calls.map(([value]) => value).join('\n');
        expect(text).not.toContain('penaltyAmount:');
        expect(text).not.toContain('interestAmount:');
        expect(text).not.toContain('chargedAmount:');
        expect(text).toContain('10,00');
        expect(text).toContain(data.payment.digitableLine);
      } finally {
        document.end();
      }
    },
  );

  it('should keep adjustment fields blank when no amounts were supplied', async () => {
    const document = new PDFDocument({ size: 'A4', margin: 40 });
    document.resume();
    const rowSpy = jest.spyOn(PdfFormCanvas.prototype, 'drawRow');
    const data: BoletoTemplateData = {
      beneficiary: { name: 'DEMO', document: '00000000000000', address: 'Demo' },
      payer: { name: 'DEMO', document: '00000000000', address: 'Demo' },
      bank: { code: '341', name: 'ITAU' },
      payment: {
        documentNumber: 'DEMO',
        ourNumber: '1',
        amount: 10,
        dueDate: new Date('2026-10-19'),
        barcode: '',
        digitableLine: '',
      },
    };

    try {
      await renderBoletoToPdf(document, data, resolvePdfTemplateOptions({ includeBarcode: false }));
      for (const label of ['(+) MORA / MULTA', '(+) OUTROS ACRÉSCIMOS', '(=) VALOR COBRADO']) {
        expect(
          rowSpy.mock.calls.flatMap(([cells]) => cells).find((cell) => cell.label === label),
        ).toMatchObject({ value: '' });
      }
    } finally {
      document.end();
    }
  });
});
