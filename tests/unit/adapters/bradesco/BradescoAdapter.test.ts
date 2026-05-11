import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import { BradescoAdapter, createBradescoAdapter } from '../../../../src/adapters/bradesco';
import type { IBankAdapter } from '../../../../src/adapters';
import { generateCnab } from '../../../../src/generators';
import type {
  BradescoCnab240Segment,
  BradescoCnab400RemittanceDetail,
  BradescoCnab400ReturnDetail,
  BradescoWalletConfig,
} from '../../../../src/types/adapters';
import { createMinimalCnab240File } from '../../../helpers/cnab240';

function createMinimalBradescoCnab240Content(walletCode: string, occurrenceCode: string): string {
  const cnab = createMinimalCnab240File(true);
  cnab.batches[0].details[0].segmentP.portfolioCode = walletCode;
  cnab.batches[0].details[0].segmentP.occurrenceCode = occurrenceCode;
  return generateCnab(cnab);
}

function replaceAt(line: string, start: number, end: number, value: string): string {
  const normalizedValue = value.padEnd(end - start + 1, ' ').slice(0, end - start + 1);
  return `${line.slice(0, start - 1)}${normalizedValue}${line.slice(end)}`;
}

function readFixtureLines(fileName: string): string[] {
  return readFileSync(join(__dirname, '../../../fixtures/cnab400', fileName), 'utf-8')
    .replaceAll('\r', '')
    .split('\n')
    .filter((line) => line.length > 0);
}

describe('BradescoAdapter', () => {
  const adapter = new BradescoAdapter();

  it('should create adapter instances through factory helper', () => {
    expect(createBradescoAdapter()).toBeInstanceOf(BradescoAdapter);
  });

  it('should satisfy generic bank adapter contract', () => {
    const contract: IBankAdapter<
      BradescoWalletConfig,
      BradescoCnab400RemittanceDetail,
      BradescoCnab400ReturnDetail,
      BradescoCnab240Segment
    > = adapter;

    expect(contract.isSupportedWallet('19')).toBe(true);
    expect(contract.buildRemittanceDetailsFromContent('')).toEqual([]);
    expect(contract.buildReturnDetailsFromContent('')).toEqual([]);
    expect(
      contract.buildCnab240DetailsFromContent(createMinimalBradescoCnab240Content('09', '06')),
    ).toHaveLength(1);
  });

  it('should validate supported wallet code', () => {
    expect(adapter.isSupportedWallet('19')).toBe(true);
  });

  it('should reject unsupported wallet code', () => {
    expect(adapter.isSupportedWallet('99')).toBe(false);
  });

  it('should resolve supported wallet configuration through facade', () => {
    expect(adapter.getWalletConfig('019')).toEqual({
      code: '19',
      description: 'Registered collection portfolio',
      cnab240PortfolioCode: '19',
      cnab400WalletType: 'R',
      aliases: ['19', '019'],
    });
  });

  it('should return undefined wallet configuration for unsupported wallet through facade', () => {
    expect(adapter.getWalletConfig('999')).toBeUndefined();
  });

  it('should generate formatted our number', () => {
    expect(adapter.formatOurNumber('12345678901')).toBe('12345678901-8');
  });

  it('should build detailed our number result', () => {
    expect(adapter.buildOurNumber('12345678901')).toEqual({
      baseNumber: '12345678901',
      checkDigit: '8',
      formatted: '12345678901-8',
    });
  });

  it('should map Bradesco occurrence codes through the facade', () => {
    expect(adapter.mapOccurrenceCode('06')).toEqual({
      code: '06',
      category: 'settlement',
      description: 'Payment liquidation',
    });
  });

  it('should validate Bradesco remittance fields through facade', () => {
    expect(
      adapter.validateRemittanceFields({
        instructionCode: '00',
        walletNumber: '19',
        walletType: 'R',
        occurrenceCode: '01',
        daysCount: 0,
      }),
    ).toEqual({
      isValid: true,
      errors: [],
    });
  });

  it('should validate Bradesco return fields through facade', () => {
    expect(
      adapter.validateReturnFields({
        walletNumber: '19',
        walletType: 'R',
        occurrenceCode: '06',
        ourNumber: '12345678901',
        ourNumberCheckDigit: '8',
      }),
    ).toEqual({
      isValid: true,
      errors: [],
    });
  });

  it('should build enriched Bradesco CNAB240 detail payloads from content', () => {
    const result = adapter.buildCnab240DetailsFromContent(
      createMinimalBradescoCnab240Content('09', '06'),
    );

    expect(result).toHaveLength(1);
    expect(result[0].movementType).toBe('cnab240');
    expect(result[0].walletNumber).toBe('09');
    expect(result[0].wallet?.code).toBe('09');
    expect(result[0].occurrence).toEqual({
      code: '06',
      category: 'settlement',
      description: 'Payment liquidation',
    });
    expect(result[0].validation.isValid).toBe(true);
  });

  it('should mark unsupported CNAB240 wallet as invalid', () => {
    const result = adapter.buildCnab240DetailsFromContent(
      createMinimalBradescoCnab240Content('77', '06'),
    );

    expect(result).toHaveLength(1);
    expect(result[0].wallet).toBeUndefined();
    expect(result[0].validation).toEqual({
      isValid: false,
      errors: ['Unsupported Bradesco wallet code: 07'],
    });
  });

  it('should build enriched Bradesco remittance details from full CNAB400 content', () => {
    const lines = readFixtureLines('itau-remessa-sample1.ret');
    const baseDetailLine = lines[1];
    const trailerLine = lines.at(-1);

    const firstDetail = replaceAt(
      replaceAt(
        replaceAt(
          replaceAt(replaceAt(baseDetailLine, 157, 158, '00'), 84, 86, '019'),
          108,
          108,
          'R',
        ),
        109,
        110,
        '01',
      ),
      392,
      393,
      '05',
    );
    const secondDetail = replaceAt(
      replaceAt(
        replaceAt(
          replaceAt(replaceAt(baseDetailLine, 157, 158, '00'), 84, 86, '026'),
          108,
          108,
          'R',
        ),
        109,
        110,
        '06',
      ),
      392,
      393,
      '00',
    );

    const content = [lines[0], firstDetail, secondDetail, trailerLine].join('\n');
    const result = adapter.buildRemittanceDetailsFromContent(content);

    expect(result).toHaveLength(2);
    expect(result[0].movementType).toBe('remittance');
    expect(result[0].fields).toEqual({
      instructionCode: '00',
      walletNumber: '019',
      walletType: 'R',
      occurrenceCode: '01',
      daysCount: 5,
    });
    expect(result[0].wallet?.code).toBe('19');
    expect(result[0].validation.isValid).toBe(true);
    expect(result[1].fields.walletNumber).toBe('026');
    expect(result[1].wallet?.code).toBe('26');
    expect(result[1].validation.isValid).toBe(true);
  });

  it('should build enriched Bradesco return details from full CNAB400 content', () => {
    const lines = readFixtureLines('itau-retorno-sample1.ret');
    const baseDetailLine = lines[1];
    const trailerLine = lines.at(-1);

    const firstDetail = replaceAt(
      replaceAt(replaceAt(replaceAt(baseDetailLine, 84, 86, '019'), 108, 108, 'R'), 109, 110, '06'),
      71,
      71,
      ' ',
    );
    const secondDetail = replaceAt(
      replaceAt(replaceAt(replaceAt(baseDetailLine, 84, 86, '026'), 108, 108, 'R'), 109, 110, '03'),
      71,
      71,
      ' ',
    );

    const content = [lines[0], firstDetail, secondDetail, trailerLine].join('\n');
    const result = adapter.buildReturnDetailsFromContent(content);

    expect(result).toHaveLength(2);
    expect(result[0].movementType).toBe('return');
    expect(result[0].fields.walletNumber).toBe('019');
    expect(result[0].wallet?.code).toBe('19');
    expect(result[0].occurrence).toEqual({
      code: '06',
      category: 'settlement',
      description: 'Payment liquidation',
    });
    expect(result[0].validation.isValid).toBe(true);
    expect(result[1].fields.walletNumber).toBe('026');
    expect(result[1].wallet?.code).toBe('26');
    expect(result[1].occurrence).toEqual({
      code: '03',
      category: 'rejection',
      description: 'Entry rejected',
    });
    expect(result[1].validation.isValid).toBe(true);
  });

  it('should throw when asserting unsupported wallet code', () => {
    expect(() => adapter.assertSupportedWallet('99')).toThrow(
      'Unsupported Bradesco wallet code: 99',
    );
  });
});
