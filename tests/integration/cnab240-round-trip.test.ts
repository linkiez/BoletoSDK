import { Cnab240Generator } from '../../src/generators/cnab240/Cnab240Generator';
import { parseCnab240 } from '../../src/parsers/cnab240';
import { createMinimalCnab240File } from '../helpers/cnab240';

describe('CNAB240 Round Trip - Integration', () => {
  it('should preserve key fields after generate and parse', () => {
    const file = createMinimalCnab240File(true);
    const generator = new Cnab240Generator();

    const content = generator.generate(file);
    const parsed = parseCnab240(content);

    expect(parsed.fileHeader.bankCode).toBe(file.fileHeader.bankCode);
    expect(parsed.batches).toHaveLength(1);

    const detail = parsed.batches[0].details[0];
    expect(detail.segmentP.documentNumber).toBe(file.batches[0].details[0].segmentP.documentNumber);
    expect(detail.segmentQ.payerName).toBe(
      file.batches[0].details[0].segmentQ.payerName.toUpperCase(),
    );
    expect(detail.segmentR).toBeDefined();
    expect(detail.segmentR?.discount2Code).toBe('0');
    expect(detail.segmentR?.fineCode).toBe('0');
  });
});
