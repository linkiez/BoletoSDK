import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import { ItauAdapter, createItauAdapter } from '../../../../src/adapters/itau';
import type { IBankAdapter } from '../../../../src/adapters';
import { generateCnab } from '../../../../src/generators';
import { parseCnab240 } from '../../../../src/parsers/cnab240';
import type {
  ItauCnab240Segment,
  ItauCnab400RemittanceDetail,
  ItauCnab400ReturnDetail,
  ItauWalletConfig,
} from '../../../../src/types/adapters';
import { createMinimalCnab240File } from '../../../helpers/cnab240';

describe('ItauAdapter', () => {
  const adapter = new ItauAdapter();

  it('should create adapter instances through factory helper', () => {
    expect(createItauAdapter()).toBeInstanceOf(ItauAdapter);
  });

  it('should satisfy generic bank adapter contract', () => {
    const contract: IBankAdapter<
      ItauWalletConfig,
      ItauCnab400RemittanceDetail,
      ItauCnab400ReturnDetail,
      ItauCnab240Segment
    > = adapter;

    expect(contract.isSupportedWallet('109')).toBe(true);
    expect(contract.buildRemittanceDetailsFromContent('')).toEqual([]);
    expect(contract.buildReturnDetailsFromContent('')).toEqual([]);
    expect(
      contract.buildCnab240DetailsFromContent(generateCnab(createMinimalCnab240File(true))),
    ).toHaveLength(1);
  });

  it('should validate supported wallet code', () => {
    expect(adapter.isSupportedWallet('109')).toBe(true);
  });

  it('should reject unsupported wallet code', () => {
    expect(adapter.isSupportedWallet('999')).toBe(false);
  });

  it('should resolve supported wallet configuration through facade', () => {
    expect(adapter.getWalletConfig('109')).toEqual({
      code: '109',
      description: 'Simple collection without registration',
      cnab240PortfolioCode: '109',
      cnab400WalletType: 'I',
    });
  });

  it('should return undefined wallet configuration for unsupported wallet through facade', () => {
    expect(adapter.getWalletConfig('999')).toBeUndefined();
  });

  it('should generate formatted our number', () => {
    expect(adapter.formatOurNumber('12345678')).toBe('123456782');
  });

  it('should build detailed our number result', () => {
    expect(adapter.buildOurNumber('12345678')).toEqual({
      baseNumber: '12345678',
      checkDigit: 2,
      formatted: '123456782',
    });
  });

  it('should map Itaú occurrence codes through the facade', () => {
    expect(adapter.mapOccurrenceCode('06')).toEqual({
      code: '06',
      category: 'settlement',
      description: 'Payment liquidation',
    });
  });

  it('should map Itaú instruction codes through the facade', () => {
    expect(adapter.mapInstructionCode('01')).toEqual({
      code: '01',
      commonCode: '01',
      description: 'Protest automatically after N days',
    });
  });

  it('should map Itaú liquidation codes through the facade', () => {
    expect(adapter.mapLiquidationCode('02')).toEqual({
      code: '02',
      category: 'clearing',
      description: 'Liquidation channel 02 (clearing)',
    });
  });

  it('should trim Itaú liquidation code through the facade', () => {
    expect(adapter.mapLiquidationCode(' 02 ')).toEqual({
      code: '02',
      category: 'clearing',
      description: 'Liquidation channel 02 (clearing)',
    });
  });

  it('should normalize single-digit Itaú liquidation code through the facade', () => {
    expect(adapter.mapLiquidationCode('2')).toEqual({
      code: '02',
      category: 'clearing',
      description: 'Liquidation channel 02 (clearing)',
    });
  });

  it('should normalize Itaú rejection message through the facade', () => {
    expect(adapter.mapRejectionMessage('12345678')).toEqual({
      raw: '12345678',
      category: 'code',
      code: '12345678',
      source: 'fallback',
      description: 'Itaú rejection code from return message area: 12345678',
    });
  });

  it('should normalize short Itaú rejection code through the facade', () => {
    expect(adapter.mapRejectionMessage('1')).toEqual({
      raw: '1',
      category: 'code',
      code: '00000001',
      source: 'catalog',
      description: 'Rejected due to invalid wallet code',
    });
  });

  it('should trim Itaú rejection message through the facade', () => {
    expect(adapter.mapRejectionMessage('   123   ')).toEqual({
      raw: '123',
      category: 'code',
      code: '00000123',
      source: 'fallback',
      description: 'Itaú rejection code from return message area: 00000123',
    });
  });

  it('should parse Itaú remittance-specific CNAB400 fields through the facade', () => {
    const line =
      '10213598863000154489700174506    0000                         000008240000000000000109                     I01000000082404052000000000346803410000001A060420980000000000000120000000000000000000000000000000000000000000000268104538000180SUDESTE PRE FABRICADOS LTDA             ESTRADA DE VASCONCELOS, 199             CHACARAS REU13388680NOVA ODESSA    SP                                  00000000 000002';

    expect(adapter.parseRemittanceFields(line)).toEqual({
      instructionCancellationCode: '0000',
      bankUseOperation: undefined,
      walletNumber: '109',
      walletType: 'I',
      occurrenceCode: '01',
      daysCount: 0,
    });
  });

  it('should validate Itaú remittance-specific CNAB400 fields through the facade', () => {
    expect(
      adapter.validateRemittanceFields({
        instructionCancellationCode: '0000',
        walletNumber: '109',
        walletType: 'I',
        occurrenceCode: '01',
        daysCount: 0,
      }),
    ).toEqual({
      isValid: true,
      errors: [],
    });
  });

  it('should validate Itaú return-specific CNAB400 fields through the facade', () => {
    expect(
      adapter.validateReturnFields({
        walletNumber: '109',
        walletType: 'I',
        creditDate: new Date(2021, 1, 19),
        bankOurNumber: '00004965',
        bankOurNumberDigit: '3',
        confirmedOurNumber: '00004965',
        canceledInstructionCode: '0000',
        liquidationCode: '02',
      }),
    ).toEqual({
      isValid: true,
      errors: [],
    });
  });

  it('should build enriched Itaú remittance detail from a CNAB400 line', () => {
    const line =
      '10213598863000154489700174506    0000                         000008240000000000000109                     I01000000082404052000000000346803410000001A060420980000000000000120000000000000000000000000000000000000000000000268104538000180SUDESTE PRE FABRICADOS LTDA             ESTRADA DE VASCONCELOS, 199             CHACARAS REU13388680NOVA ODESSA    SP                                  00000000 000002';

    const result = adapter.buildRemittanceDetail(line);

    expect(result.movementType).toBe('remittance');
    expect(result.detail.recordType).toBe('1');
    expect(result.fields.walletNumber).toBe('109');
    expect(result.wallet?.code).toBe('109');
    expect(result.validation.isValid).toBe(true);
  });

  it('should build enriched Itaú return detail from a CNAB400 line', () => {
    const line =
      '10213598863000154489700174506                                 00004965            109000049653             I02010221000000496500004965            19022100000000030003410277401000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000010000000000000         000000000000000000000002B AUTOMACAO E USINAGEM LTDA                                          000002';

    const result = adapter.buildReturnDetail(line);

    expect(result.movementType).toBe('return');
    expect(result.detail.recordType).toBe('1');
    expect(result.fields.walletNumber).toBe('109');
    expect(result.fields.ddaIndicator).toBeUndefined();
    expect(result.fields.creditDate).toBeUndefined();
    expect(result.wallet?.code).toBe('109');
    expect(result.liquidation).toBeUndefined();
    expect(result.rejection).toBeUndefined();
    expect(result.occurrence).toEqual({
      code: '02',
      category: 'entry',
      description: 'Entry confirmed',
    });
    expect(result.validation.isValid).toBe(true);
  });

  it('should map return liquidation and rejection metadata when present', () => {
    const baseLine =
      '10213598863000154489700174506                                 00004965            109000049653             I02010221000000496500004965            19022100000000030003410277401000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000010000000000000         000000000000000000000002B AUTOMACAO E USINAGEM LTDA                                          000002';

    const withLiquidation = `${baseLine.slice(0, 392)}02${baseLine.slice(394)}`;
    const withRejection = `${withLiquidation.slice(0, 377)}12345678${withLiquidation.slice(385)}`;

    const result = adapter.buildReturnDetail(withRejection);

    expect(result.liquidation).toEqual({
      code: '02',
      category: 'clearing',
      description: 'Liquidation channel 02 (clearing)',
    });
    expect(result.rejection).toEqual({
      raw: '12345678',
      category: 'code',
      code: '12345678',
      source: 'fallback',
      description: 'Itaú rejection code from return message area: 12345678',
    });
  });

  it('should build enriched Itaú remittance details from full CNAB400 content', () => {
    const content = readFileSync(
      join(__dirname, '../../../fixtures/cnab400/itau-remessa-sample1.ret'),
      'utf-8',
    );

    const results = adapter.buildRemittanceDetailsFromContent(content);

    expect(results.length).toBeGreaterThan(0);
    expect(results[0].movementType).toBe('remittance');
    expect(results[0].validation.isValid).toBe(true);
  });

  it('should build enriched Itaú return details from full CNAB400 content', () => {
    const content = readFileSync(
      join(__dirname, '../../../fixtures/cnab400/itau-retorno-sample1.ret'),
      'utf-8',
    );

    const results = adapter.buildReturnDetailsFromContent(content);

    expect(results.length).toBeGreaterThan(0);
    expect(results[0].movementType).toBe('return');
    expect(results[0].occurrence).toBeDefined();
    expect(results[0].liquidation).toBeUndefined();
    expect(results[0].rejection).toBeUndefined();
    expect(results[0].validation.isValid).toBe(true);
  });

  it('should build enriched Itaú CNAB240 detail from parsed segments', () => {
    const cnab240 = createMinimalCnab240File(true);
    const detail = cnab240.batches[0].details[0];

    const result = adapter.buildCnab240Detail(detail);

    expect(result.movementType).toBe('cnab240');
    expect(result.walletNumber).toBe('109');
    expect(result.wallet?.code).toBe('109');
    expect(result.occurrence).toBeUndefined();
    expect(result.validation.isValid).toBe(true);
  });

  it('should build enriched Itaú CNAB240 details array from parsed segments', () => {
    const cnab240 = createMinimalCnab240File(true);
    const details = cnab240.batches[0].details;

    const result = adapter.buildCnab240Details(details);

    expect(result).toHaveLength(1);
    expect(result[0].movementType).toBe('cnab240');
    expect(result[0].walletNumber).toBe('109');
    expect(result[0].validation.isValid).toBe(true);
  });

  it('should build enriched Itaú CNAB240 details from a parsed batch', () => {
    const cnab240 = createMinimalCnab240File(true);
    const batch = cnab240.batches[0];

    const result = adapter.buildCnab240DetailsFromBatch(batch);

    expect(result).toHaveLength(1);
    expect(result[0].movementType).toBe('cnab240');
    expect(result[0].walletNumber).toBe('109');
    expect(result[0].validation.isValid).toBe(true);
  });

  it('should build enriched Itaú CNAB240 details from a parsed file', () => {
    const cnab240 = createMinimalCnab240File(true);

    const result = adapter.buildCnab240DetailsFromFile(cnab240);

    expect(result).toHaveLength(1);
    expect(result[0].movementType).toBe('cnab240');
    expect(result[0].walletNumber).toBe('109');
    expect(result[0].validation.isValid).toBe(true);
  });

  it('should build enriched Itaú CNAB240 details from raw CNAB240 content', () => {
    const content = generateCnab(createMinimalCnab240File(true));
    const parsed = parseCnab240(content);
    const expectedWalletNumber = parsed.batches[0].details[0].segmentP.portfolioCode;
    const expectedWallet = adapter.getWalletConfig(expectedWalletNumber);

    const result = adapter.buildCnab240DetailsFromContent(content);

    expect(result).toHaveLength(1);
    expect(result[0].movementType).toBe('cnab240');
    expect(result[0].walletNumber).toBe(expectedWalletNumber);
    expect(result[0].wallet).toEqual(expectedWallet);
    expect(result[0].validation.isValid).toBe(Boolean(expectedWallet));
  });

  it('should throw when CNAB240 content is invalid', () => {
    expect(() => adapter.buildCnab240DetailsFromContent('invalid')).toThrow();
  });

  it('should throw when asserting unsupported wallet code', () => {
    expect(() => adapter.assertSupportedWallet('999')).toThrow('Unsupported Itau wallet code: 999');
  });
});
