/**
 * CNAB240 Schemas - Unit Tests
 */

import {
  BatchHeaderSchema,
  BatchSchema,
  BatchTrailerSchema,
  Cnab240FileSchema,
  DetailRecordSchema,
  FileHeaderSchema,
  FileTrailerSchema,
  SegmentPSchema,
  SegmentQSchema,
  SegmentRSchema,
} from '@schemas/cnab240';
import type {
  BatchHeader,
  BatchTrailer,
  DetailRecord,
  FileHeader,
  FileTrailer,
  SegmentP,
  SegmentQ,
  SegmentR,
} from '../../../src/types/cnab240';

describe('CNAB240 Schemas', () => {
  const createSegmentP = (): SegmentP => ({
    bankCode: '341',
    batchNumber: 1,
    recordType: '3',
    sequentialNumber: 1,
    segmentCode: 'P',
    occurrenceCode: '01',
    agency: '1234',
    account: '123456',
    accountDigit: '7',
    ourNumber: '12345678901234567890',
    portfolioCode: '109',
    documentNumber: 'DOC001',
    dueDate: new Date('2026-02-15'),
    amount: 100.5,
    speciesCode: '01',
    acceptance: 'N',
    issueDate: new Date('2026-01-15'),
    currencyCode: '09',
  });

  const createSegmentQ = (): SegmentQ => ({
    bankCode: '341',
    batchNumber: 1,
    recordType: '3',
    sequentialNumber: 2,
    segmentCode: 'Q',
    occurrenceCode: '01',
    payerRegistrationType: '1',
    payerTaxId: '12345678901',
    payerName: 'John Doe',
    payerAddress: 'Street Test 123',
    payerNeighborhood: 'Centro',
    payerPostalCode: '12345678',
    payerCity: 'Sao Paulo',
    payerState: 'SP',
  });

  const createSegmentR = (): SegmentR => ({
    bankCode: '341',
    batchNumber: 1,
    recordType: '3',
    sequentialNumber: 3,
    segmentCode: 'R',
    occurrenceCode: '01',
    discount2Code: '0',
    fineCode: '0',
  });

  const createFileHeader = (): FileHeader => ({
    bankCode: '341',
    batchNumber: '0000',
    recordType: '0',
    companyRegistrationType: '1',
    companyRegistrationNumber: '12345678901',
    agency: '1234',
    account: '123456',
    accountDigit: '7',
    companyName: 'ACME Corp',
    bankName: 'BANCO ITAU SA',
    fileCode: '1',
    generationDate: new Date('2026-01-15'),
    sequentialNumber: 1,
    layoutVersion: '087',
  });

  const createFileTrailer = (): FileTrailer => ({
    bankCode: '341',
    batchNumber: '9999',
    recordType: '9',
    totalBatches: 1,
    totalRecords: 6,
  });

  const createBatchHeader = (): BatchHeader => ({
    bankCode: '341',
    batchNumber: 1,
    recordType: '1',
    operationType: 'C',
    serviceType: '01',
    companyRegistrationType: '1',
    companyRegistrationNumber: '12345678901',
    agency: '1234',
    account: '123456',
    accountDigit: '7',
    companyName: 'ACME Corp',
  });

  const createBatchTrailer = (): BatchTrailer => ({
    bankCode: '341',
    batchNumber: 1,
    recordType: '5',
    totalRecords: 4,
  });

  it('should validate file header schema', () => {
    expect(FileHeaderSchema.safeParse(createFileHeader()).success).toBe(true);
  });

  it('should reject invalid bank code on file header', () => {
    const invalid = createFileHeader();
    invalid.bankCode = '34';
    expect(FileHeaderSchema.safeParse(invalid).success).toBe(false);
  });

  it('should validate segment schemas', () => {
    expect(SegmentPSchema.safeParse(createSegmentP()).success).toBe(true);
    expect(SegmentQSchema.safeParse(createSegmentQ()).success).toBe(true);
    expect(SegmentRSchema.safeParse(createSegmentR()).success).toBe(true);
  });

  it('should validate batch schemas', () => {
    const detail: DetailRecord = {
      segmentP: createSegmentP(),
      segmentQ: createSegmentQ(),
      segmentR: createSegmentR(),
    };
    expect(DetailRecordSchema.safeParse(detail).success).toBe(true);
    expect(BatchHeaderSchema.safeParse(createBatchHeader()).success).toBe(true);
    expect(BatchTrailerSchema.safeParse(createBatchTrailer()).success).toBe(true);
    expect(
      BatchSchema.safeParse({
        header: createBatchHeader(),
        details: [detail],
        trailer: createBatchTrailer(),
      }).success,
    ).toBe(true);
  });

  it('should validate complete CNAB240 file schema', () => {
    const file = {
      fileHeader: createFileHeader(),
      batches: [
        {
          header: createBatchHeader(),
          details: [
            {
              segmentP: createSegmentP(),
              segmentQ: createSegmentQ(),
              segmentR: createSegmentR(),
            },
          ],
          trailer: createBatchTrailer(),
        },
      ],
      fileTrailer: createFileTrailer(),
    };

    expect(Cnab240FileSchema.safeParse(file).success).toBe(true);
  });

  it('should reject invalid file trailer record type', () => {
    const invalid = createFileTrailer();
    invalid.recordType = '1';
    expect(FileTrailerSchema.safeParse(invalid).success).toBe(false);
  });
});
