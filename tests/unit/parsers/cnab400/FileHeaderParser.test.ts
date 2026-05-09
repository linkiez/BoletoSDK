import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import { FILE_TYPE_RETORNO, LINE_LENGTH } from '../../../../src/constants/cnab400';
import { ParseError } from '../../../../src/errors';
import { parseFileHeader } from '../../../../src/parsers/cnab400/FileHeaderParser';

describe('CNAB400 FileHeaderParser', () => {
  const getFixtureLine = (name: string): string =>
    readFileSync(join(__dirname, '../../../fixtures/cnab400', name), 'utf-8')
      .replaceAll('\r', '')
      .split('\n')[0];

  it('should parse remittance header', () => {
    const line = getFixtureLine('itau-remessa-sample1.ret');

    const header = parseFileHeader(line);

    expect(header.recordType).toBe('0');
    expect(header.operationType).not.toBe(FILE_TYPE_RETORNO);
    expect(header.companyName.length).toBeGreaterThan(0);
    expect(header.bankCode.length).toBe(3);
    expect(header.creationDate).toBeUndefined();
  });

  it('should parse return header with creation date', () => {
    const line = getFixtureLine('itau-retorno-sample1.ret');

    const header = parseFileHeader(line);

    expect(header.recordType).toBe('0');
    expect(header.operationType).toBe(FILE_TYPE_RETORNO);
    expect(header.creationDate).toBeInstanceOf(Date);
  });

  it('should throw on invalid line length', () => {
    const line = getFixtureLine('itau-remessa-sample1.ret').slice(0, LINE_LENGTH - 1);

    expect(() => parseFileHeader(line)).toThrow(ParseError);
  });

  it('should throw on invalid record type', () => {
    const line = `1${getFixtureLine('itau-remessa-sample1.ret').slice(1)}`;

    expect(() => parseFileHeader(line)).toThrow(ParseError);
  });
});
