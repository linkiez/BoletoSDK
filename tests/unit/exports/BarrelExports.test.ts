import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import { CNAB240, CNAB400 } from '../../../src/constants';
import { Cnab240RecordType, Cnab400RecordType } from '../../../src/enums';
import { generateCnab } from '../../../src/generators';
import { parseCnab, parseCnab400FileHeader } from '../../../src/parsers';
import { cnab240Schemas, cnab400Schemas, AddressSchema } from '../../../src/schemas';
import { cnab240Validators, validateCnab240File } from '../../../src/validators';
import { createMinimalCnab240Content } from '../../helpers/cnab240-content';
import { createMinimalCnab240File } from '../../helpers/cnab240';

describe('Barrel exports', () => {
  it('should expose constants and enums', () => {
    expect(CNAB240.LINE_LENGTH).toBe(240);
    expect(CNAB400.LINE_LENGTH).toBe(400);
    expect(Cnab240RecordType.FILE_HEADER).toBe('0');
    expect(Cnab400RecordType.HEADER).toBe('0');
  });

  it('should expose schemas from index', () => {
    const addressResult = AddressSchema.safeParse({
      street: 'Rua A',
      district: 'Centro',
      city: 'Sao Paulo',
      state: 'SP',
      postalCode: '01001000',
    });

    expect(addressResult.success).toBe(true);
    expect(cnab240Schemas.Cnab240FileSchema).toBeDefined();
    expect(cnab400Schemas.Cnab400FileSchema).toBeDefined();
  });

  it('should expose parsers from index', () => {
    const content = createMinimalCnab240Content();
    const parsed = parseCnab(content);

    expect('fileHeader' in parsed).toBe(true);

    const headerLine = readFileSync(
      join(__dirname, '../../fixtures/cnab400/itau-remessa-sample1.ret'),
      'utf-8',
    ).split('\n')[0];

    const header = parseCnab400FileHeader(headerLine);
    expect(header.recordType).toBe('0');
  });

  it('should expose generators and validators from index', () => {
    const content = generateCnab(createMinimalCnab240File(true));
    expect(content.split('\n')[0]).toHaveLength(240);

    const validation = validateCnab240File(createMinimalCnab240File(true));
    expect(validation.isValid).toBe(true);

    const structure = cnab240Validators.validateFileStructure(createMinimalCnab240File(true));
    expect(structure.isValid).toBe(true);
  });
});
