import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import { createItauAdapter } from '../../src';

describe('ItauAdapter - Integration Enrichment', () => {
  const fixturesPath = join(__dirname, '..', 'fixtures', 'cnab400');
  const adapter = createItauAdapter();

  let remessaContent: string;
  let retornoContent: string;

  beforeAll(() => {
    remessaContent = readFileSync(
      join(fixturesPath, 'itau-remessa-sample1.ret'),
      'utf-8',
    ).replaceAll('\r', '');
    retornoContent = readFileSync(
      join(fixturesPath, 'itau-retorno-sample1.ret'),
      'utf-8',
    ).replaceAll('\r', '');
  });

  it('should enrich remittance details with wallet config, instructions and validation', () => {
    const details = adapter.buildRemittanceDetailsFromContent(remessaContent);

    expect(details.length).toBeGreaterThan(0);

    const first = details[0];
    expect(first.movementType).toBe('remittance');
    expect(first.fields.walletNumber).toBe('109');
    expect(first.wallet?.code).toBe('109');
    expect(first.wallet?.cnab400WalletType).toBe('I');
    expect(first.validation.isValid).toBe(true);

    const allInstructionMappingsAreConsistent = details.every(
      (detail) =>
        detail.instructionCode1 === undefined || detail.instructionCode1.code.length === 2,
    );
    expect(allInstructionMappingsAreConsistent).toBe(true);
  });

  it('should enrich return details with wallet config, occurrence mapping and validation', () => {
    const details = adapter.buildReturnDetailsFromContent(retornoContent);

    expect(details.length).toBeGreaterThan(0);

    const first = details[0];
    expect(first.movementType).toBe('return');
    expect(first.fields.walletNumber).toBe('109');
    expect(first.fields.ddaIndicator).toBeUndefined();
    expect(first.fields.creditDate).toBeUndefined();
    expect(first.wallet?.code).toBe('109');
    expect(first.occurrence?.code).toBe('02');
    expect(first.occurrence?.category).toBe('entry');
    expect(first.liquidation).toBeUndefined();
    expect(first.rejection).toBeUndefined();
    expect(first.validation.isValid).toBe(true);
  });

  it('should enrich return detail with occurrence, liquidation and rejection metadata in a synthetic line', () => {
    const lines = retornoContent.split('\n').filter((line) => line.length > 0);
    const withCreditDate = `${lines[1].slice(0, 295)}190221${lines[1].slice(301)}`;
    const withRejection = `${withCreditDate.slice(0, 377)}12345678${withCreditDate.slice(385)}`;
    const enrichedDetailLine = `${withRejection.slice(0, 392)}02${withRejection.slice(394)}`;
    const syntheticContent = [lines[0], enrichedDetailLine, ...lines.slice(2)].join('\n');

    const details = adapter.buildReturnDetailsFromContent(syntheticContent);

    expect(details.length).toBeGreaterThan(0);
    expect(details[0].occurrence?.code).toBe('02');
    expect(details[0].liquidation).toEqual({
      code: '02',
      category: 'clearing',
      description: 'Liquidation channel 02 (clearing)',
    });
    expect(details[0].rejection).toEqual({
      raw: '12345678',
      category: 'code',
      code: '12345678',
      source: 'fallback',
      description: 'Itaú rejection code from return message area: 12345678',
    });
    expect(details[0].fields.creditDate).toEqual(new Date(2021, 1, 19));
    expect(details[0].validation.isValid).toBe(true);
  });

  it('should normalize short padded rejection code from return line to catalog mapping', () => {
    const lines = retornoContent.split('\n').filter((line) => line.length > 0);
    const withCreditDate = `${lines[1].slice(0, 295)}190221${lines[1].slice(301)}`;
    const withShortRejection = `${withCreditDate.slice(0, 377)}       1${withCreditDate.slice(385)}`;
    const syntheticContent = [lines[0], withShortRejection, ...lines.slice(2)].join('\n');

    const details = adapter.buildReturnDetailsFromContent(syntheticContent);

    expect(details.length).toBeGreaterThan(0);
    expect(details[0].rejection).toEqual({
      raw: '1',
      category: 'code',
      code: '00000001',
      source: 'catalog',
      description: 'Rejected due to invalid wallet code',
    });
    expect(details[0].validation.isValid).toBe(true);
  });
});
