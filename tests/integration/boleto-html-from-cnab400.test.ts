import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { buildBoletoHtml } from '../../src/templates/HtmlTemplateBuilder';
import { parseCnab400 } from '../../src/parsers/cnab400';
import type { Cnab400File } from '../../src/types/cnab400';
import { mapCnab400ToBoletoTemplateData } from '../helpers/boleto-template-data';

describe('Boleto HTML from CNAB400 - Integration', () => {
  it('should generate boleto HTML using parsed CNAB400 fixture data', () => {
    const fixturePath = join(__dirname, '..', 'fixtures', 'cnab400', 'itau-remessa-sample1.ret');
    const content = readFileSync(fixturePath, 'utf-8');
    const parsed = parseCnab400(content) as Cnab400File;

    const templateData = mapCnab400ToBoletoTemplateData(parsed);
    const html = buildBoletoHtml(templateData, { layout: 'detailed' });

    expect(html).toContain('<!DOCTYPE html>');
    expect(html).toContain('ITAU');
    expect(html).toContain(templateData.payer.name);
    expect(html).toContain(templateData.payment.digitableLine);
    expect(html).toContain('Ficha de Compensação');
  });
});
