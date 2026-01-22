import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import { LINE_LENGTH } from '../../../../src/constants/cnab400';
import { ParseError } from '../../../../src/errors';
import { parseDetailRecord } from '../../../../src/parsers/cnab400/DetailRecordParser';

describe('CNAB400 DetailRecordParser', () => {
  const getDetailLine = (): string =>
    readFileSync(join(__dirname, '../../../fixtures/cnab400/itau-remessa-sample1.ret'), 'utf-8')
      .split('\n')
      .filter((line) => line.length > 0)[1];

  it('should parse remittance detail line', () => {
    const detail = parseDetailRecord(getDetailLine());

    expect(detail.recordType).toBe('1');
    expect(detail.bankCode ?? '').toHaveLength(3);
    expect(detail.payerName.length).toBeGreaterThan(0);
    expect(detail.dueDate).toBeInstanceOf(Date);
    expect(detail.amount).toBeGreaterThanOrEqual(0);
    expect(detail.sequentialNumber).toBeGreaterThan(0);
  });

  it('should throw on invalid line length', () => {
    const invalid = getDetailLine().slice(0, LINE_LENGTH - 1);
    expect(() => parseDetailRecord(invalid)).toThrow(ParseError);
  });

  it('should throw on invalid record type', () => {
    const invalid = `2${getDetailLine().slice(1)}`;
    expect(() => parseDetailRecord(invalid)).toThrow(ParseError);
  });
});
