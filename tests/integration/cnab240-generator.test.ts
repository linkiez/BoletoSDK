import { Cnab240Generator } from '../../src/generators/cnab240/Cnab240Generator';
import { createMinimalCnab240File } from '../helpers/cnab240';

describe('CNAB240 Generator - Integration', () => {
  it('should generate a 240-character file with correct record types', () => {
    const generator = new Cnab240Generator();
    const content = generator.generate(createMinimalCnab240File(true));
    const lines = content.split('\n');

    expect(lines).toHaveLength(7);
    lines.forEach((line) => expect(line).toHaveLength(240));

    expect(lines[0][7]).toBe('0');
    expect(lines[1][7]).toBe('1');
    expect(lines[2][7]).toBe('3');
    expect(lines[3][7]).toBe('3');
    expect(lines[4][7]).toBe('3');
    expect(lines[5][7]).toBe('5');
    expect(lines[6][7]).toBe('9');

    expect(lines[2][13]).toBe('P');
    expect(lines[3][13]).toBe('Q');
    expect(lines[4][13]).toBe('R');
  });
});
