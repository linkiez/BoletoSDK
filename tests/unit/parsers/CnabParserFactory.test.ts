import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import { CnabError } from '../../../src/errors';
import { parseCnab } from '../../../src/parsers/CnabParserFactory';
import { createMinimalCnab240Content } from '../../helpers/cnab240-content';

describe('CnabParserFactory', () => {
  it('should parse CNAB240 content based on line length', () => {
    const content = createMinimalCnab240Content();

    const parsed = parseCnab(content);

    expect('fileHeader' in parsed).toBe(true);
  });

  it('should parse CNAB400 content based on line length', () => {
    const fixturePath = join(__dirname, '../../fixtures/cnab400/itau-remessa-sample1.ret');
    const content = readFileSync(fixturePath, 'utf-8');

    const parsed = parseCnab(content);

    expect('header' in parsed).toBe(true);
  });

  it('should throw for empty content', () => {
    expect(() => parseCnab('')).toThrow(CnabError);
    expect(() => parseCnab('   ')).toThrow('File content cannot be empty');
  });

  it('should throw for invalid line length', () => {
    const invalidContent = '1234567890';

    expect(() => parseCnab(invalidContent)).toThrow(CnabError);
    expect(() => parseCnab(invalidContent)).toThrow(
      'Invalid CNAB format: line length 10 (expected 240 or 400)',
    );
  });
});
