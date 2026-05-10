import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import {
  parseItauRemittanceFields,
  parseItauReturnFields,
} from '../../../../src/adapters/itau/ItauFieldParser';

function readFixtureLine(fileName: string): string {
  return readFileSync(join(__dirname, '../../../fixtures/cnab400', fileName), 'utf-8')
    .replaceAll('\r', '')
    .split('\n')
    .filter((line) => line.length > 0)[1];
}

describe('ItauFieldParser', () => {
  const remittanceLine = readFixtureLine('itau-remessa-sample1.ret');
  const returnLine = readFixtureLine('itau-retorno-sample1.ret');

  it('should parse remittance-specific Itaú fields from the bank-use area', () => {
    expect(parseItauRemittanceFields(remittanceLine)).toEqual({
      instructionCancellationCode: '0000',
      bankUseOperation: undefined,
      walletNumber: '109',
      walletType: 'I',
      occurrenceCode: '01',
      daysCount: 0,
    });
  });

  it('should parse return-specific Itaú confirmation fields', () => {
    expect(parseItauReturnFields(returnLine)).toEqual({
      walletNumber: '109',
      walletType: 'I',
      bankOurNumber: '00004965',
      bankOurNumberDigit: '3',
      confirmedOurNumber: '00004965',
      canceledInstructionCode: '0000',
      rejectionMessage: undefined,
      liquidationCode: undefined,
    });
  });

  it('should reject invalid remittance lines', () => {
    expect(() => parseItauRemittanceFields('short')).toThrow(
      'Invalid Itaú remittance detail line length: 5',
    );
  });

  it('should reject invalid return lines', () => {
    expect(() => parseItauReturnFields('short')).toThrow(
      'Invalid Itaú return detail line length: 5',
    );
  });
});
