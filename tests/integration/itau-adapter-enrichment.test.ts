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
    expect(first.wallet?.code).toBe('109');
    expect(first.occurrence?.code).toBe('02');
    expect(first.occurrence?.category).toBe('entry');
    expect(first.validation.isValid).toBe(true);
  });
});
