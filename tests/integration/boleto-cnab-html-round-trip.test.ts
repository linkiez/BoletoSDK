import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { parseCnab240 } from '../../src/parsers/cnab240';
import { parseCnab400 } from '../../src/parsers/cnab400';
import { buildBoletoHtml } from '../../src/templates/HtmlTemplateBuilder';
import type { Cnab400File } from '../../src/types/cnab400';
import { createMinimalCnab240Content } from '../helpers/cnab240-content';
import {
  mapCnab240ToBoletoTemplateData,
  mapCnab400ToBoletoTemplateData,
} from '../helpers/boleto-template-data';

describe('Boleto CNAB -> HTML round-trip visual verification', () => {
  it('should generate visually structured HTML from CNAB400 fixture data', () => {
    const fixturePath = join(__dirname, '..', 'fixtures', 'cnab400', 'itau-remessa-sample1.ret');
    const content = readFileSync(fixturePath, 'utf-8');
    const parsed = parseCnab400(content) as Cnab400File;
    const templateData = mapCnab400ToBoletoTemplateData(parsed);

    const html = buildBoletoHtml(templateData, { layout: 'detailed' });

    expect(html).toContain('<!DOCTYPE html>');
    expect(html).toContain('<table cellspacing="0" cellpadding="0" border="0" class="Boleto">');
    expect(html).toContain('BoletoLinhaDigitavel');
    expect(html).toContain('BoletoCodigoBanco');
    expect(html).toContain('Recibo do Sacado');
    expect(html).toContain('Ficha de Compensação');
    expect(html).toContain(templateData.payment.digitableLine);
    expect(html).toContain(templateData.payer.name);
  });

  it('should generate visually structured HTML from CNAB240 parsed content', () => {
    const parsed = parseCnab240(createMinimalCnab240Content());
    const templateData = mapCnab240ToBoletoTemplateData(parsed);

    const html = buildBoletoHtml(templateData, { layout: 'detailed' });

    expect(html).toContain('<!DOCTYPE html>');
    expect(html).toContain('<meta charset="utf-8" />');
    expect(html).toContain('@media print');
    expect(html).toContain('BoletoPontilhado');
    expect(html).toContain(templateData.payment.digitableLine);
    expect(html).toContain(templateData.payment.documentNumber);
    expect(html).toContain(templateData.beneficiary.name);
    expect(html).toContain(templateData.payer.name);
  });
});
