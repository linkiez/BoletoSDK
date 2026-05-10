import { createItauAdapter } from '../../src';
import { generateCnab } from '../../src/generators';
import { parseCnab240 } from '../../src/parsers/cnab240';
import { createMinimalCnab240File } from '../helpers/cnab240';

describe('ItauAdapter - CNAB240 Integration Enrichment', () => {
  const adapter = createItauAdapter();

  it('should enrich CNAB240 details from content consistently with parser wallet extraction', () => {
    const cnab240 = createMinimalCnab240File(true);
    const content = generateCnab(cnab240);
    const parsed = parseCnab240(content);
    const expectedWalletNumber = parsed.batches[0].details[0].segmentP.portfolioCode;

    const details = adapter.buildCnab240DetailsFromContent(content);

    expect(details).toHaveLength(1);
    expect(details[0].movementType).toBe('cnab240');
    expect(details[0].walletNumber).toBe(expectedWalletNumber);
    expect(details[0].wallet?.code).toBe('109');
    expect(details[0].validation.isValid).toBe(true);
    expect(details[0].validation.errors).toEqual([]);
  });

  it('should mark CNAB240 detail as invalid when wallet is unsupported', () => {
    const cnab240 = createMinimalCnab240File(true);
    cnab240.batches[0].details[0].segmentP.portfolioCode = '888';
    const content = generateCnab(cnab240);
    const parsed = parseCnab240(content);
    const expectedWalletNumber = parsed.batches[0].details[0].segmentP.portfolioCode;

    const details = adapter.buildCnab240DetailsFromContent(content);

    expect(details).toHaveLength(1);
    expect(details[0].walletNumber).toBe(expectedWalletNumber);
    expect(details[0].wallet).toBeUndefined();
    expect(details[0].validation.isValid).toBe(false);
    expect(details[0].validation.errors).toEqual([
      `Unsupported Itau wallet code: ${expectedWalletNumber}`,
    ]);
  });
});
