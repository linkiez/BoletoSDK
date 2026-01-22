/**
 * CNAB400 Schemas - Unit Tests
 */

import {
  Cnab400FileSchema,
  Cnab400ReturnFileSchema,
  DetailRecordSchema,
  FileHeaderSchema,
  FileTrailerSchema,
  GuarantorRecordSchema,
  MessageBackRecordSchema,
  MessageFrontRecordSchema,
  PenaltyRecordSchema,
  ReturnDetailRecordSchema,
} from '@schemas/cnab400';
import type {
  Cnab400File,
  Cnab400ReturnFile,
  DetailRecord,
  FileHeader,
  FileTrailer,
  GuarantorRecord,
  MessageBackRecord,
  MessageFrontRecord,
  PenaltyRecord,
  ReturnDetailRecord,
} from '../../../src/types/cnab400';

describe('CNAB400 Schemas', () => {
  const createFileHeader = (): FileHeader => ({
    recordType: '0',
    operationType: '1',
    operationLiteral: 'REMESSA',
    serviceCode: '01',
    serviceLiteral: 'COBRANCA',
    agency: '0001',
    zeros: '00',
    account: '12345',
    accountDigit: '6',
    companyName: 'ACME CORPORATION LTDA',
    bankCode: '341',
    bankName: 'BANCO ITAU SA',
    generationDate: new Date('2026-01-20'),
    sequenceNumber: 1,
  });

  const createDetailRecord = (): DetailRecord => ({
    recordType: '1',
    companyRegistrationType: '02',
    companyRegistrationNumber: '12345678000195',
    agency: '0001',
    account: '12345',
    accountDigit: '6',
    ourNumber: '12345678',
    dueDate: new Date('2026-03-01'),
    amount: 150.0,
    payerName: 'JOHN DOE',
    sequentialNumber: 2,
  });

  const createReturnDetailRecord = (): ReturnDetailRecord => ({
    ...createDetailRecord(),
    occurrenceCode: '01',
  });

  const createFileTrailer = (): FileTrailer => ({
    recordType: '9',
    totalRecords: 3,
    sequentialNumber: 3,
  });

  const createPenaltyRecord = (): PenaltyRecord => ({
    recordType: '2',
    penaltyCode: '2',
    penaltyDate: new Date('2026-03-10'),
    penaltyValue: 5.0,
    sequentialNumber: 3,
  });

  const createGuarantorRecord = (): GuarantorRecord => ({
    recordType: '5',
    companyRegistrationType: '02',
    companyRegistrationNumber: '12345678000195',
    documentNumber: 'DOC123456',
    guarantorName: 'GUARANTOR COMPANY LTDA',
    guarantorZipCode: '20000000',
    guarantorCity: 'RIO DE JANEIRO',
    guarantorState: 'RJ',
    sequentialNumber: 3,
  });

  const createMessageFrontRecord = (): MessageFrontRecord => ({
    recordType: '7',
    message1: 'PAYMENT INSTRUCTIONS',
    sequentialNumber: 4,
  });

  const createMessageBackRecord = (): MessageBackRecord => ({
    recordType: '8',
    message1: 'ADDITIONAL INFORMATION',
    sequentialNumber: 5,
  });

  const createCnab400File = (): Cnab400File => ({
    header: createFileHeader(),
    details: [createDetailRecord()],
    trailer: createFileTrailer(),
    messageFrontRecords: [createMessageFrontRecord()],
    penaltyRecords: [createPenaltyRecord()],
    guarantorRecords: [createGuarantorRecord()],
    messageBackRecords: [createMessageBackRecord()],
  });

  const createCnab400ReturnFile = (): Cnab400ReturnFile => ({
    header: createFileHeader(),
    details: [createReturnDetailRecord()],
    trailer: createFileTrailer(),
  });

  it('should validate file header schema', () => {
    expect(FileHeaderSchema.safeParse(createFileHeader()).success).toBe(true);
  });

  it('should reject invalid header record type', () => {
    const invalid = createFileHeader();
    invalid.recordType = '1' as FileHeader['recordType'];
    expect(FileHeaderSchema.safeParse(invalid).success).toBe(false);
  });

  it('should validate detail record schema', () => {
    expect(DetailRecordSchema.safeParse(createDetailRecord()).success).toBe(true);
  });

  it('should validate return detail record schema', () => {
    expect(ReturnDetailRecordSchema.safeParse(createReturnDetailRecord()).success).toBe(true);
  });

  it('should validate file trailer schema', () => {
    expect(FileTrailerSchema.safeParse(createFileTrailer()).success).toBe(true);
  });

  it('should validate penalty record schema', () => {
    expect(PenaltyRecordSchema.safeParse(createPenaltyRecord()).success).toBe(true);
  });

  it('should validate guarantor record schema', () => {
    expect(GuarantorRecordSchema.safeParse(createGuarantorRecord()).success).toBe(true);
  });

  it('should validate message front record schema', () => {
    expect(MessageFrontRecordSchema.safeParse(createMessageFrontRecord()).success).toBe(true);
  });

  it('should validate message back record schema', () => {
    expect(MessageBackRecordSchema.safeParse(createMessageBackRecord()).success).toBe(true);
  });

  it('should validate complete CNAB400 file schema', () => {
    expect(Cnab400FileSchema.safeParse(createCnab400File()).success).toBe(true);
  });

  it('should validate complete CNAB400 return file schema', () => {
    expect(Cnab400ReturnFileSchema.safeParse(createCnab400ReturnFile()).success).toBe(true);
  });
});
