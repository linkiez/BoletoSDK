import { LINE_LENGTH } from '../../../../src/constants/cnab400';
import { ParseError } from '../../../../src/errors';
import { parsePenaltyRecord } from '../../../../src/parsers/cnab400/PenaltyRecordParser';

const setField = (line: string[], value: string, start: number, end: number): void => {
  const valueStr = value.padEnd(end - start + 1, ' ').substring(0, end - start + 1);
  for (let i = 0; i < valueStr.length; i++) {
    line[start - 1 + i] = valueStr[i];
  }
};

const createPenaltyLine = (): string => {
  const line = new Array(LINE_LENGTH).fill(' ');
  line[0] = '2';
  setField(line, '1', 2, 2);
  setField(line, '01012026', 3, 10);
  setField(line, '0000000001500', 11, 23);
  setField(line, '000001', LINE_LENGTH - 5, LINE_LENGTH);
  return line.join('');
};

const createPenaltyLineWithoutOptionalFields = (): string => {
  const line = new Array(LINE_LENGTH).fill(' ');
  line[0] = '2';
  setField(line, '1', 2, 2);
  setField(line, '000001', LINE_LENGTH - 5, LINE_LENGTH);
  return line.join('');
};

describe('CNAB400 PenaltyRecordParser', () => {
  it('should parse penalty record', () => {
    const record = parsePenaltyRecord(createPenaltyLine());

    expect(record.recordType).toBe('2');
    expect(record.penaltyCode).toBe('1');
    expect(record.penaltyDate).toBeInstanceOf(Date);
    expect(record.penaltyValue).toBe(15);
    expect(record.sequentialNumber).toBe(1);
  });

  it('should allow missing optional fields', () => {
    const record = parsePenaltyRecord(createPenaltyLineWithoutOptionalFields());

    expect(record.penaltyDate).toBeUndefined();
    expect(record.penaltyValue).toBeUndefined();
  });

  it('should throw on invalid line length', () => {
    const invalid = createPenaltyLine().slice(0, LINE_LENGTH - 1);
    expect(() => parsePenaltyRecord(invalid)).toThrow(ParseError);
  });

  it('should throw on invalid record type', () => {
    const invalid = `1${createPenaltyLine().slice(1)}`;
    expect(() => parsePenaltyRecord(invalid)).toThrow(ParseError);
  });
});
