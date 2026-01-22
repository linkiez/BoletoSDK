import { ParseError } from '../../src/errors';
import { parseCnab240 } from '../../src/parsers/cnab240';
import { createMinimalCnab240Content, updateLineField } from '../helpers/cnab240-content';

describe('CNAB240 Error Handling - Integration', () => {
  it('should throw for files with less than 3 lines', () => {
    const content = ['HEADER', 'TRAILER'].join('\n');
    expect(() => parseCnab240(content)).toThrow(ParseError);
  });

  it('should throw for invalid line length', () => {
    const content = createMinimalCnab240Content();
    const lines = content.split('\n');
    lines[2] = lines[2].slice(0, 200); // invalid length

    expect(() => parseCnab240(lines.join('\n'))).toThrow(ParseError);
  });

  it('should throw for invalid file header record type', () => {
    const content = createMinimalCnab240Content();
    const lines = content.split('\n');
    lines[0] = updateLineField(lines[0], '1', 8, 8); // invalid record type for header

    expect(() => parseCnab240(lines.join('\n'))).toThrow(ParseError);
  });
});
