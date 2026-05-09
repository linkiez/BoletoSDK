import { parseCnab240 } from '../../src/parsers/cnab240';
import { generateBoletoPdfBuffer } from '../../src/generators/pdf/BoletoPdfGenerator';
import { createMinimalCnab240Content } from '../helpers/cnab240-content';
import { mapCnab240ToBoletoTemplateData } from '../helpers/boleto-template-data';

describe('Boleto PDF from CNAB240 - Integration', () => {
  it('should generate a valid PDF buffer using parsed CNAB240 data', async () => {
    const cnabContent = createMinimalCnab240Content();
    const parsed = parseCnab240(cnabContent);

    const templateData = mapCnab240ToBoletoTemplateData(parsed);
    const pdfBuffer = await generateBoletoPdfBuffer(templateData, {
      includeBarcode: true,
      includePixQr: false,
      layout: 'simple',
    });

    expect(Buffer.isBuffer(pdfBuffer)).toBe(true);
    expect(pdfBuffer.length).toBeGreaterThan(0);
    expect(pdfBuffer.subarray(0, 4).toString('ascii')).toBe('%PDF');
  });
});
