import {
  generateDetailRecord,
  generateDetailRecordRemessa,
  generateFileHeader,
  generateFileTrailer,
  generatePenaltyRecord,
} from '../../../../src/generators/cnab400';
import type {
  DetailRecord,
  FileHeader,
  FileTrailer,
  PenaltyRecord,
} from '../../../../src/types/cnab400';
import { formatDateShort, formatDecimal } from '../../../../src/utils/formatters';

describe('CNAB400 record generators', () => {
  const formatDateLong = (date: Date): string => {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = String(date.getFullYear());

    return `${day}${month}${year}`;
  };

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
    penaltyDate: new Date('2026-03-20T00:00:00.000Z'),
    penaltyValue: 2.5,
    sequentialNumber: 3,
  };

  it('should generate file header with creation date when provided', () => {
    const header = {
      ...baseHeader,
      creationDate: new Date('2026-02-10'),
    };

    const line = generateFileHeader(header);

    expect(line).toHaveLength(400);
    expect(line.slice(115, 121)).toBe(formatDateShort(header.creationDate));
  });

  it('should throw when header bank code is missing', () => {
    const invalidHeader = {
      ...baseHeader,
      bankCode: '',
    } as FileHeader;

    expect(() => generateFileHeader(invalidHeader)).toThrow();
  });

  it('should generate trailer with total amount when provided', () => {
    const line = generateFileTrailer(baseTrailer);

    expect(line).toHaveLength(400);
    expect(line.slice(7, 20)).toBe(formatDecimal(baseTrailer.totalAmount!, 13, 2));
  });

  it('should generate trailer with zero total amount when omitted', () => {
    const line = generateFileTrailer({
      ...baseTrailer,
      totalAmount: undefined,
    });

    expect(line).toHaveLength(400);
    expect(line.slice(7, 20)).toBe('0'.repeat(13));
  });

  it('should generate penalty record with date and value', () => {
    const line = generatePenaltyRecord(basePenalty);

    expect(line).toHaveLength(400);
    expect(line.slice(2, 10)).toBe(formatDateLong(basePenalty.penaltyDate!));
    expect(line.slice(10, 23)).toBe(formatDecimal(basePenalty.penaltyValue!, 13, 2));
  });

  it('should generate penalty record with zero date/value when omitted', () => {
    const line = generatePenaltyRecord({
      ...basePenalty,
      penaltyDate: undefined,
      penaltyValue: undefined,
    });

    expect(line).toHaveLength(400);
    expect(line.slice(2, 10)).toBe('00000000');
    expect(line.slice(10, 23)).toBe('0'.repeat(13));
  });

  it('should generate detail record with due date and amount for retorno', () => {
    const line = generateDetailRecord(baseDetail);

    expect(line).toHaveLength(400);
    expect(line.slice(146, 152)).toBe(formatDateShort(baseDetail.dueDate));
    expect(line.slice(152, 165)).toBe(formatDecimal(baseDetail.amount, 13, 2));
  });

  it('should generate detail record with zeroed fields when retorno dates are missing', () => {
    const line = generateDetailRecord({
      ...baseDetail,
      dueDate: undefined,
      amount: undefined,
    } as unknown as DetailRecord);

    expect(line).toHaveLength(400);
    expect(line.slice(146, 152)).toBe('      ');
    expect(line.slice(152, 165)).toBe('0'.repeat(13));
  });

  it('should generate detail record with due date, amount, and issue date for remessa', () => {
    const line = generateDetailRecordRemessa(baseDetail);

    expect(line).toHaveLength(400);
    expect(line.slice(120, 126)).toBe(formatDateShort(baseDetail.dueDate));
    expect(line.slice(126, 139)).toBe(formatDecimal(baseDetail.amount, 13, 2));
    expect(line.slice(150, 156)).toBe(formatDateShort(baseDetail.issueDate!));
  });

  it('should generate detail record with zeroed fields when remessa dates are missing', () => {
    const line = generateDetailRecordRemessa({
      ...baseDetail,
      dueDate: undefined,
      amount: undefined,
      issueDate: undefined,
    } as unknown as DetailRecord);

    expect(line).toHaveLength(400);
    expect(line.slice(120, 126)).toBe('000000');
    expect(line.slice(126, 139)).toBe('0'.repeat(13));
    expect(line.slice(150, 156)).toBe('000000');
  });
});
