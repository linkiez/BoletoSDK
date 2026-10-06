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
    companyControl: 'TITLE-1',
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

    const lines = generateCnab400(file).split('\r\n').slice(0, -1);

    expect(lines).toHaveLength(4);
    expect(lines[0].startsWith('0')).toBe(true);
    expect(lines[1].startsWith('1')).toBe(true);
    expect(lines[2].startsWith('2')).toBe(true);
    expect(lines[3].startsWith('9')).toBe(true);
  });

  it('should leave Itaú remittance trailer positions 002-394 blank', () => {
    const file: Cnab400File = {
      header: baseHeader,
      details: [baseDetail],
      trailer: baseTrailer,
    };

    const trailer = generateCnab400(file).split('\r\n').at(-2)!;

    expect(trailer.slice(1, 394)).toBe(' '.repeat(393));
    expect(trailer.slice(394, 400)).toBe('000003');
  });

  it('should retain the existing trailer totals for return files', () => {
    const file: Cnab400File = {
      header: {
        ...baseHeader,
        operationType: '2',
        operationLiteral: 'RETORNO',
      },
      details: [baseDetail],
      trailer: baseTrailer,
    };

    const trailer = generateCnab400(file).split('\r\n').at(-2)!;

    expect(trailer.slice(1, 7)).toBe('000003');
    expect(trailer.slice(7, 20)).toBe('0000000015025');
  });

  it('should delimit records with CRLF and terminate the trailer', () => {
    const file: Cnab400File = {
      header: baseHeader,
      details: [baseDetail],
      trailer: baseTrailer,
    };

    const records = generateCnab400(file).split('\r\n');

    expect(records).toHaveLength(4);
    expect(records.at(-1)).toBe('');
    expect(records.slice(0, -1).map((record) => record.length)).toEqual(Array(3).fill(400));
  });

  it('should place a linked penalty immediately after its detail record', () => {
    const secondDetail = {
      ...baseDetail,
      companyControl: 'TITLE-2',
      documentNumber: 'DOC-2',
      sequentialNumber: 3,
    };
    const penalty = {
      ...basePenalty,
      detailCompanyControl: 'TITLE-1',
      sequentialNumber: 4,
    };
    const file: Cnab400File = {
      header: baseHeader,
      details: [baseDetail, secondDetail],
      penaltyRecords: [penalty],
      trailer: {
        ...baseTrailer,
        totalRecords: 5,
        sequentialNumber: 5,
      },
    };

    const lines = generateCnab400(file).split('\r\n').slice(0, -1);

    expect(lines.map((line) => line.charAt(0))).toEqual(['0', '1', '2', '1', '9']);
  });

  it('should place a parsed penalty by detail index without company controls', () => {
    const file: Cnab400File = {
      header: baseHeader,
      details: [
        { ...baseDetail, companyControl: undefined },
        {
          ...baseDetail,
          companyControl: undefined,
          documentNumber: 'DOC-2',
          sequentialNumber: 3,
        },
      ],
      penaltyRecords: [{ ...basePenalty, detailIndex: 1, sequentialNumber: 4 }],
      trailer: {
        ...baseTrailer,
        totalRecords: 5,
        sequentialNumber: 5,
      },
    };

    const lines = generateCnab400(file).split('\r\n').slice(0, -1);

    expect(lines.map((line) => line.charAt(0))).toEqual(['0', '1', '1', '2', '9']);
  });

  it('should reject an unlinked penalty when multiple details exist', () => {
    const file: Cnab400File = {
      header: baseHeader,
      details: [
        baseDetail,
        {
          ...baseDetail,
          companyControl: 'TITLE-2',
          documentNumber: 'DOC-2',
          sequentialNumber: 3,
        },
      ],
      penaltyRecords: [basePenalty],
      trailer: {
        ...baseTrailer,
        totalRecords: 5,
        sequentialNumber: 5,
      },
    };

    expect(() => generateCnab400(file)).toThrow('Penalty record must reference exactly one detail');
  });

  it('should include front message records before the trailer', () => {
    const file: Cnab400File = {
      header: baseHeader,
      details: [baseDetail],
      messageFrontRecords: [
        {
          recordType: '7',
          message1: 'PAYMENT FOR SERVICES',
          sequentialNumber: 3,
        },
      ],
      trailer: {
        ...baseTrailer,
        totalRecords: 4,
        sequentialNumber: 4,
      },
    };

    const lines = generateCnab400(file).split('\r\n').slice(0, -1);

    expect(lines.map((line) => line.charAt(0))).toEqual(['0', '1', '7', '9']);
    expect(lines[2]).toHaveLength(400);
    expect(lines[2].slice(6, 134)).toBe('PAYMENT FOR SERVICES'.padEnd(128));
    expect(lines[2].slice(134, 136)).toBe('00');
    expect(lines[2].slice(264, 266)).toBe('00');
    expect(lines[2][393]).toBe(' ');
    expect(lines[2].slice(394)).toBe('000003');
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

    const lines = generateCnab400(file).split('\r\n').slice(0, -1);

    expect(lines).toHaveLength(3);
    expect(lines.some((line) => line.startsWith('2'))).toBe(false);
  });
});
