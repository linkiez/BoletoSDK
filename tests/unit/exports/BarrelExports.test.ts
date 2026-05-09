import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import { CNAB240, CNAB400 } from '../../../src/constants';
import { Cnab240RecordType, Cnab400RecordType } from '../../../src/enums';
import {
  generateCnab,
  generateCnab400,
  generateDetailRecord,
  generateDetailRecordRemessa,
  generateFileHeader,
  generateFileTrailer,
  generatePenaltyRecord,
} from '../../../src/generators';
import {
  parseCnab,
  parseCnab400,
  parseCnab400FileHeader,
  parseFileTrailer as parseCnab400FileTrailer,
  parseDetailRecord,
  parseGuarantorRecord,
  parseMessageBackRecord,
  parseMessageFrontRecord,
  parsePenaltyRecord,
  parseReturnDetailRecord,
} from '../../../src/parsers';
import { AddressSchema, cnab240Schemas, cnab400Schemas } from '../../../src/schemas';
import {
  cnab240Validators,
  cnab400Validators,
  validateAddress,
  validateBankAccount,
  validateBeneficiary,
  validateCnab240File,
  validateCnab400File,
  validatePayer,
} from '../../../src/validators';
import { createMinimalCnab240File } from '../../helpers/cnab240';
import { createMinimalCnab240Content } from '../../helpers/cnab240-content';

describe('Barrel exports', () => {
  const remessaLines = readFileSync(
    join(__dirname, '../../fixtures/cnab400/itau-remessa-sample1.ret'),
    'utf-8',
  )
    .replaceAll('\r', '')
    .split('\n')
    .filter((line) => line.length > 0);

  const retornoLines = readFileSync(
    join(__dirname, '../../fixtures/cnab400/itau-retorno-sample1.ret'),
    'utf-8',
  )
    .replaceAll('\r', '')
    .split('\n')
    .filter((line) => line.length > 0);

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

    const header = parseCnab400FileHeader(remessaLines[0]);
    expect(header.recordType).toBe('0');

    const detail = parseDetailRecord(remessaLines[1]);
    expect(detail.recordType).toBe('1');

    const returnDetail = parseReturnDetailRecord(retornoLines[1]);
    expect(returnDetail.occurrenceCode).toHaveLength(2);

    const trailer = parseCnab400FileTrailer(remessaLines.at(-1)!);
    expect(trailer.recordType).toBe('9');
  });

  it('should expose generators and validators from index', () => {
    const content = generateCnab(createMinimalCnab240File(true));
    expect(content.split('\n')[0]).toHaveLength(240);

    const parsedCnab400 = parseCnab400(remessaLines.join('\n'));
    const headerLine = generateFileHeader(parsedCnab400.header);
    expect(headerLine).toHaveLength(400);

    const detailLine = generateDetailRecord(parsedCnab400.details[0]);
    expect(detailLine).toHaveLength(400);

    const detailRemessaLine = generateDetailRecordRemessa(parsedCnab400.details[0]);
    expect(detailRemessaLine).toHaveLength(400);

    const trailerLine = generateFileTrailer(parsedCnab400.trailer);
    expect(trailerLine).toHaveLength(400);

    const penaltyLine = generatePenaltyRecord({
      recordType: '2',
      penaltyCode: '2',
      penaltyDate: new Date('2026-01-01'),
      penaltyValue: 2.5,
      sequentialNumber: 3,
    });
    expect(penaltyLine).toHaveLength(400);

    const generatedCnab400 = generateCnab400(parsedCnab400);
    expect(generatedCnab400.split('\n')[0]).toHaveLength(400);

    const validation = validateCnab240File(createMinimalCnab240File(true));
    expect(validation.isValid).toBe(true);

    const structure = cnab240Validators.validateFileStructure(createMinimalCnab240File(true));
    expect(structure.isValid).toBe(true);

    const validateCnab400Result = validateCnab400File(parsedCnab400);
    expect(validateCnab400Result.isValid).toBe(false);
    expect(validateCnab400Result.errors.length).toBeGreaterThan(0);

    const address = validateAddress({
      street: 'Rua A',
      district: 'Centro',
      city: 'Sao Paulo',
      state: 'SP',
      postalCode: '01001000',
    });
    expect(address.isValid).toBe(true);

    const bankAccount = validateBankAccount({
      bankCode: '341',
      branch: '1234',
      account: '12345',
      accountDigit: '6',
    });
    expect(bankAccount.isValid).toBe(true);

    const beneficiary = validateBeneficiary({
      name: 'ACME Corp',
      taxId: { type: 'CNPJ', number: '12345678000195' },
      bankAccount: { bankCode: '341', branch: '1234', account: '12345', accountDigit: '6' },
    });
    expect(beneficiary.isValid).toBe(true);

    const payer = validatePayer({
      name: 'John Doe',
      taxId: { type: 'CPF', number: '11144477735' },
      address: {
        street: 'Rua A',
        district: 'Centro',
        city: 'Sao Paulo',
        state: 'SP',
        postalCode: '01001000',
      },
    });
    expect(payer.isValid).toBe(true);

    const guarantorLine = ((): string => {
      const line = new Array(CNAB400.LINE_LENGTH).fill(' ');
      line[0] = '5';
      line[1] = '0';
      line[2] = '2';
      return line.join('');
    })();
    expect(parseGuarantorRecord(guarantorLine).recordType).toBe('5');

    const messageFrontLine = ((): string => {
      const line = new Array(CNAB400.LINE_LENGTH).fill(' ');
      line[0] = '7';
      return line.join('');
    })();
    expect(parseMessageFrontRecord(messageFrontLine).recordType).toBe('7');

    const messageBackLine = ((): string => {
      const line = new Array(CNAB400.LINE_LENGTH).fill(' ');
      line[0] = '8';
      return line.join('');
    })();
    expect(parseMessageBackRecord(messageBackLine).recordType).toBe('8');

    const penaltyParseLine = ((): string => {
      const line = new Array(CNAB400.LINE_LENGTH).fill(' ');
      line[0] = '2';
      line[1] = '1';
      return line.join('');
    })();
    expect(parsePenaltyRecord(penaltyParseLine).recordType).toBe('2');

    const returnDetailLine = ((): string => {
      const line = new Array(CNAB400.LINE_LENGTH).fill(' ');
      line[0] = '1';
      return line.join('');
    })();
    expect(() => parseReturnDetailRecord(returnDetailLine)).toThrow();

    const cnab400Structure = cnab400Validators.validateFileStructure(parsedCnab400);
    expect(cnab400Structure.isValid).toBe(false);
    expect(cnab400Structure.errors.length).toBeGreaterThan(0);
  });
});
