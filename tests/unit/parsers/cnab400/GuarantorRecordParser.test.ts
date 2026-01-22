import { LINE_LENGTH } from '../../../../src/constants/cnab400';
import { ParseError } from '../../../../src/errors';
import { parseGuarantorRecord } from '../../../../src/parsers/cnab400/GuarantorRecordParser';

const setField = (line: string[], value: string, start: number, end: number): void => {
  const valueStr = value.padEnd(end - start + 1, ' ').substring(0, end - start + 1);
  for (let i = 0; i < valueStr.length; i++) {
    line[start - 1 + i] = valueStr[i];
  }
};

const createGuarantorLine = (): string => {
  const line = new Array(LINE_LENGTH).fill(' ');
  line[0] = '5';
  setField(line, '02', 2, 3);
  setField(line, '12345678000195', 4, 17);
  setField(line, 'DOC1234567', 88, 97);
  setField(line, 'GUARANTOR NAME', 215, 244);
  setField(line, '000001', LINE_LENGTH - 5, LINE_LENGTH);
  return line.join('');
};

describe('CNAB400 GuarantorRecordParser', () => {
  it('should parse guarantor record', () => {
    const record = parseGuarantorRecord(createGuarantorLine());

    expect(record.recordType).toBe('5');
    expect(record.companyRegistrationType).toBe('02');
    expect(record.companyRegistrationNumber).toBe('12345678000195');
    expect(record.documentNumber).toBe('DOC1234567');
    expect(record.guarantorName).toBe('GUARANTOR NAME');
    expect(record.guarantorAddress).toBeUndefined();
    expect(record.sequentialNumber).toBe(1);
  });

  it('should throw on invalid line length', () => {
    const invalid = createGuarantorLine().slice(0, LINE_LENGTH - 1);
    expect(() => parseGuarantorRecord(invalid)).toThrow(ParseError);
  });

  it('should throw on invalid record type', () => {
    const invalid = `1${createGuarantorLine().slice(1)}`;
    expect(() => parseGuarantorRecord(invalid)).toThrow(ParseError);
  });
});
