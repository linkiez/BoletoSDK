import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import { LINE_LENGTH } from '../../../../src/constants/cnab400';
import { ParseError } from '../../../../src/errors';
import { parseReturnDetailRecord } from '../../../../src/parsers/cnab400/ReturnDetailRecordParser';

describe('CNAB400 ReturnDetailRecordParser', () => {
  const getDetailLine = (): string =>
    readFileSync(join(__dirname, '../../../fixtures/cnab400/itau-retorno-sample1.ret'), 'utf-8')
      .replaceAll('\r', '')
      .split('\n')
      .filter((line) => line.length > 0)[1];

  it('should parse return detail line', () => {
    const detail = parseReturnDetailRecord(getDetailLine());

    expect(detail.recordType).toBe('1');
    expect(detail.occurrenceCode.length).toBe(2);
    expect(detail.bankCode ?? '').toHaveLength(3);
    expect(detail.payerName.length).toBeGreaterThan(0);
  });

  it('should throw on invalid line length', () => {
    const invalid = getDetailLine().slice(0, LINE_LENGTH - 1);
    expect(() => parseReturnDetailRecord(invalid)).toThrow(ParseError);
  });

  it('should throw on invalid record type', () => {
    const invalid = `2${getDetailLine().slice(1)}`;
    expect(() => parseReturnDetailRecord(invalid)).toThrow(ParseError);
  });
});
