import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import { CnabError } from '../../../src/errors';
import { generateCnab } from '../../../src/generators/CnabGeneratorFactory';
import { parseCnab400 } from '../../../src/parsers/cnab400';
import { createMinimalCnab240File } from '../../helpers/cnab240';

describe('CnabGeneratorFactory', () => {
  it('should generate CNAB240 content from CNAB240 data', () => {
    const data = createMinimalCnab240File(true);

    const content = generateCnab(data);
    const lines = content.split('\n');

    expect(lines[0]).toHaveLength(240);
    expect(lines[0][7]).toBe('0');
  });

  it('should generate CNAB400 content from CNAB400 data', () => {
    const fixturePath = join(__dirname, '../../fixtures/cnab400/itau-remessa-sample1.ret');
    const parsed = parseCnab400(readFileSync(fixturePath, 'utf-8'));

    const content = generateCnab(parsed);
    const lines = content.split('\n');

    expect(lines[0]).toHaveLength(400);
    expect(lines.at(-1)![0]).toBe('9');
  });

  it('should throw for invalid CNAB data', () => {
    expect(() => generateCnab({} as never)).toThrow(CnabError);
  });
});
