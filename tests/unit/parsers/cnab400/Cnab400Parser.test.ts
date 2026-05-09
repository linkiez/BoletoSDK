import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import { FILE_TYPE_RETORNO, LINE_LENGTH } from '../../../../src/constants/cnab400';
import { ParseError } from '../../../../src/errors';
import { parseCnab400 } from '../../../../src/parsers/cnab400/Cnab400Parser';

describe('Cnab400Parser', () => {
  const getFixture = (name: string): string =>
    readFileSync(join(__dirname, '../../../fixtures/cnab400', name), 'utf-8');

  it('should parse valid remittance file', () => {
    const content = getFixture('itau-remessa-sample1.ret');

    const parsed = parseCnab400(content);

    expect(parsed.header).toBeDefined();
    expect(parsed.details.length).toBeGreaterThan(0);
    expect(parsed.trailer).toBeDefined();
  });

  it('should parse valid return file', () => {
    const content = getFixture('itau-retorno-sample1.ret');

    const parsed = parseCnab400(content);

    expect(parsed.header.operationType).toBe(FILE_TYPE_RETORNO);
    expect(parsed.details.length).toBeGreaterThan(0);
  });

  it('should parse file content with CRLF line endings', () => {
    const content = getFixture('itau-remessa-sample1.ret').replaceAll('\n', '\r\n');

    const parsed = parseCnab400(content);

    expect(parsed.header).toBeDefined();
    expect(parsed.details.length).toBeGreaterThan(0);
    expect(parsed.trailer).toBeDefined();
  });

  it('should throw for empty content', () => {
    expect(() => parseCnab400('')).toThrow(ParseError);
    expect(() => parseCnab400('   ')).toThrow('File content cannot be empty');
  });

  it('should throw for invalid line length', () => {
    const content = getFixture('itau-remessa-sample1.ret');
    const lines = content.split('\n');
    lines[1] = lines[1].slice(0, LINE_LENGTH - 1);

    expect(() => parseCnab400(lines.join('\n'))).toThrow(ParseError);
  });

  it('should throw for invalid record type', () => {
    const content = getFixture('itau-remessa-sample1.ret');
    const lines = content.split('\n');
    lines[1] = `4${lines[1].slice(1)}`;

    expect(() => parseCnab400(lines.join('\n'))).toThrow('Invalid record type: 4');
  });
});
