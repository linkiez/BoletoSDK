import { LINE_LENGTH } from '../../../../src/constants/cnab400';
import { ParseError } from '../../../../src/errors';
import {
  parseMessageBackRecord,
  parseMessageFrontRecord,
} from '../../../../src/parsers/cnab400/MessageRecordParser';

const setField = (line: string[], value: string, start: number, end: number): void => {
  const valueStr = value.padEnd(end - start + 1, ' ').substring(0, end - start + 1);
  for (let i = 0; i < valueStr.length; i++) {
    line[start - 1 + i] = valueStr[i];
  }
};

const createMessageLine = (recordType: '7' | '8'): string => {
  const line = new Array(LINE_LENGTH).fill(' ');
  line[0] = recordType;
  if (recordType === '7') {
    setField(line, 'F01', 2, 4);
    setField(line, '01', 5, 6);
    setField(line, 'FIRST MESSAGE LINE', 7, 134);
    setField(line, '02', 135, 136);
    setField(line, 'SECOND MESSAGE LINE', 137, 264);
    setField(line, '03', 265, 266);
    setField(line, 'THIRD MESSAGE LINE', 267, 393);
    setField(line, '1', 394, 394);
  } else {
    setField(line, 'FIRST MESSAGE LINE', 2, 81);
    setField(line, 'SECOND MESSAGE LINE', 82, 161);
  }
  setField(line, '000001', LINE_LENGTH - 5, LINE_LENGTH);
  return line.join('');
};

const createEmptyMessageLine = (recordType: '7' | '8'): string => {
  const line = new Array(LINE_LENGTH).fill(' ');
  line[0] = recordType;
  setField(line, '000001', LINE_LENGTH - 5, LINE_LENGTH);
  return line.join('');
};

describe('CNAB400 MessageRecordParser', () => {
  it('should parse message front record', () => {
    const record = parseMessageFrontRecord(createMessageLine('7'));

    expect(record.recordType).toBe('7');
    expect(record.flashCode).toBe('F01');
    expect(record.lineNumber1).toBe(1);
    expect(record.message1).toBe('FIRST MESSAGE LINE');
    expect(record.lineNumber2).toBe(2);
    expect(record.message2).toBe('SECOND MESSAGE LINE');
    expect(record.lineNumber3).toBe(3);
    expect(record.message3).toBe('THIRD MESSAGE LINE');
    expect(record.destinationCode).toBe('1');
    expect(record.sequentialNumber).toBe(1);
  });

  it('should parse message back record', () => {
    const record = parseMessageBackRecord(createMessageLine('8'));

    expect(record.recordType).toBe('8');
    expect(record.message1).toBe('FIRST MESSAGE LINE');
    expect(record.message2).toBe('SECOND MESSAGE LINE');
    expect(record.sequentialNumber).toBe(1);
  });

  it('should return undefined for empty messages', () => {
    const record = parseMessageFrontRecord(createEmptyMessageLine('7'));

    expect(record.message1).toBeUndefined();
    expect(record.message2).toBeUndefined();
    expect(record.message3).toBeUndefined();
    expect(record.destinationCode).toBeUndefined();
  });

  it('should throw on invalid line length', () => {
    const invalid = createMessageLine('7').slice(0, LINE_LENGTH - 1);
    expect(() => parseMessageFrontRecord(invalid)).toThrow(ParseError);
  });

  it('should throw on invalid record type', () => {
    const invalid = `9${createMessageLine('8').slice(1)}`;
    expect(() => parseMessageBackRecord(invalid)).toThrow(ParseError);
  });
});
