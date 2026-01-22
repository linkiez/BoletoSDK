import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import { LINE_LENGTH } from '../../../../src/constants/cnab400';
import { ParseError } from '../../../../src/errors';
import { parseFileTrailer } from '../../../../src/parsers/cnab400/FileTrailerParser';

describe('CNAB400 FileTrailerParser', () => {
  const getFixtureLine = (name: string): string => {
    const lines = readFileSync(join(__dirname, '../../../fixtures/cnab400', name), 'utf-8')
      .split('\n')
      .filter((line) => line.length > 0);
    return lines.at(-1)!;
  };

  it('should parse trailer totals', () => {
    const line = getFixtureLine('itau-remessa-sample1.ret');

    const trailer = parseFileTrailer(line);

    expect(trailer.recordType).toBe('9');
    expect(trailer.totalRecords).toBeGreaterThanOrEqual(0);
    expect(trailer.totalAmount).toBeGreaterThanOrEqual(0);
    expect(trailer.sequentialNumber).toBeGreaterThanOrEqual(0);
  });

  it('should throw on invalid line length', () => {
    const line = getFixtureLine('itau-remessa-sample1.ret').slice(0, LINE_LENGTH - 1);

    expect(() => parseFileTrailer(line)).toThrow(ParseError);
  });

  it('should throw on invalid record type', () => {
    const line = `0${getFixtureLine('itau-remessa-sample1.ret').slice(1)}`;

    expect(() => parseFileTrailer(line)).toThrow(ParseError);
  });
});
