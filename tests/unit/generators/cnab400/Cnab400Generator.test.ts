import { generateCnab400 } from '../../../../src/generators/cnab400';
import type {
  Cnab400File,
  DetailRecord,
  FileHeader,
  FileTrailer,
  PenaltyRecord,
} from '../../../../src/types/cnab400';

describe('Cnab400Generator', () => {
  const baseHeader: FileHeader = {
    recordType: '0',
    operationType: '1',
    operationLiteral: 'REMESSA',
    serviceCode: '01',
    serviceLiteral: 'COBRANCA',
    agency: '1234',
    zeros: '00',
    account: '12345',
    accountDigit: '6',
    companyName: 'ACME CORP',
    bankCode: '341',
    bankName: 'BANCO ITAU S.A.',
    generationDate: new Date('2026-02-01'),
    sequenceNumber: 1,
  };

  const baseDetail: DetailRecord = {
    recordType: '1',
    companyRegistrationType: '02',
    companyRegistrationNumber: '12345678000195',
    agency: '1234',
    account: '56789',
    accountDigit: '0',
    ourNumber: '12345678',
    documentNumber: 'DOC123',
    dueDate: new Date('2026-03-15'),
    amount: 150.25,
    bankCode: '341',
    acceptance: 'N',
    issueDate: new Date('2026-02-01'),
    payerName: 'John Doe',
    payerAddress: 'Rua A',
    payerCity: 'Sao Paulo',
    payerState: 'SP',
    payerZipCode: '01001000',
    sequentialNumber: 2,
  };

  const baseTrailer: FileTrailer = {
    recordType: '9',
    totalRecords: 3,
    totalAmount: 150.25,
    sequentialNumber: 3,
  };

  const basePenalty: PenaltyRecord = {
    recordType: '2',
    penaltyCode: '2',
    penaltyDate: new Date('2026-03-20'),
    penaltyValue: 2.5,
    sequentialNumber: 3,
  };

  it('should throw when header is missing', () => {
    const file = {
      details: [baseDetail],
      trailer: baseTrailer,
    } as unknown as Cnab400File;

    expect(() => generateCnab400(file)).toThrow();
  });

  it('should throw when trailer is missing', () => {
    const file = {
      header: baseHeader,
      details: [baseDetail],
    } as unknown as Cnab400File;

    expect(() => generateCnab400(file)).toThrow();
  });

  it('should throw when details is not an array', () => {
    const file = {
      header: baseHeader,
      trailer: baseTrailer,
      details: null,
    } as unknown as Cnab400File;

    expect(() => generateCnab400(file)).toThrow();
  });

  it('should generate remessa lines including penalty records', () => {
    const file: Cnab400File = {
      header: baseHeader,
      details: [baseDetail],
      trailer: baseTrailer,
      penaltyRecords: [basePenalty],
    };

    const lines = generateCnab400(file).split('\n');

    expect(lines).toHaveLength(4);
    expect(lines[0].startsWith('0')).toBe(true);
    expect(lines[1].startsWith('1')).toBe(true);
    expect(lines[2].startsWith('2')).toBe(true);
    expect(lines[3].startsWith('9')).toBe(true);
  });

  it('should ignore penalty records for retorno files', () => {
    const file: Cnab400File = {
      header: {
        ...baseHeader,
        operationType: '2',
        operationLiteral: 'RETORNO',
      },
      details: [baseDetail],
      trailer: {
        ...baseTrailer,
        totalRecords: 3,
        sequentialNumber: 3,
      },
      penaltyRecords: [basePenalty],
    };

    const lines = generateCnab400(file).split('\n');

    expect(lines).toHaveLength(3);
    expect(lines.some((line) => line.startsWith('2'))).toBe(false);
  });
});
