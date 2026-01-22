/**
 * CNAB240 Validators - Unit Tests
 *
 * Tests structural validation for CNAB240 files
 */

import type { Cnab240File } from '../../../src/types/cnab240';
import { validateCnab240File, validateFileStructure } from '../../../src/validators/cnab240';

describe('CNAB240 Validators', () => {
  const createMinimalFile = (): Cnab240File => ({
    fileHeader: {
      bankCode: '341',
      batchNumber: '0000',
      recordType: '0',
      companyRegistrationType: '2',
      companyRegistrationNumber: '12345678000195',
      agency: '1234',
      agencyDigit: '5',
      account: '123456',
      accountDigit: '7',
      companyName: 'ACME Corp',
      bankName: 'BANCO ITAU SA',
      fileCode: '1',
      generationDate: new Date('2026-01-15'),
      sequentialNumber: 1,
      layoutVersion: '087',
    },
    batches: [
      {
        header: {
          bankCode: '341',
          batchNumber: 1,
          recordType: '1',
          operationType: 'C',
          serviceType: '01',
          companyRegistrationType: '2',
          companyRegistrationNumber: '12345678000195',
          agency: '1234',
          agencyDigit: '5',
          account: '123456',
          accountDigit: '7',
          companyName: 'ACME Corp',
        },
        details: [
          {
            segmentP: {
              bankCode: '341',
              batchNumber: 1,
              recordType: '3',
              sequentialNumber: 1,
              segmentCode: 'P',
              occurrenceCode: '01',
              agency: '1234',
              agencyDigit: '5',
              account: '123456',
              accountDigit: '7',
              fullAccountDigit: '8',
              ourNumber: '12345678901234567890',
              portfolioCode: '109',
              documentNumber: 'DOC001',
              dueDate: new Date('2026-02-15'),
              amount: 100.5,
              collectionAgency: '0',
              collectionAgencyDigit: '',
              speciesCode: '01',
              acceptance: 'N',
              issueDate: new Date('2026-01-15'),
              interestCode: '0',
              interestDate: new Date('2026-02-16'),
              interestAmount: 0,
              discountCode: '0',
              discountDate: new Date('2026-02-10'),
              discountAmount: 0,
              iofAmount: 0,
              rebateAmount: 0,
              protestCode: '3',
              protestDays: 0,
              writeOffCode: '0',
              writeOffDays: 0,
              currencyCode: '09',
            },
            segmentQ: {
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
            },
          },
        ],
        trailer: {
          bankCode: '341',
          batchNumber: 1,
          recordType: '5',
          totalRecords: 4,
        },
      },
    ],
    fileTrailer: {
      bankCode: '341',
      batchNumber: '9999',
      recordType: '9',
      totalBatches: 1,
      totalRecords: 6,
    },
  });

  describe('validateFileStructure', () => {
    it('should accept valid file structure', () => {
      const file = createMinimalFile();

      const result = validateFileStructure(file);
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should reject file without file header', () => {
      const file = createMinimalFile();
      delete (file as { fileHeader?: Cnab240File['fileHeader'] }).fileHeader;

      const result = validateFileStructure(file);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Missing file header');
    });

    it('should reject file without file trailer', () => {
      const file = createMinimalFile();
      delete (file as { fileTrailer?: Cnab240File['fileTrailer'] }).fileTrailer;

      const result = validateFileStructure(file);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Missing file trailer');
    });

    it('should reject file with no batches', () => {
      const file = createMinimalFile();
      file.batches = [];

      const result = validateFileStructure(file);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('No batches found');
    });

    it('should reject batch without header', () => {
      const file = createMinimalFile();
      delete (file.batches[0] as unknown as { header?: unknown }).header;

      const result = validateFileStructure(file);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Batch 0: missing header');
    });

    it('should reject batch without trailer', () => {
      const file = createMinimalFile();
      delete (file.batches[0] as unknown as { trailer?: unknown }).trailer;

      const result = validateFileStructure(file);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Batch 0: missing trailer');
    });

    it('should reject batch with record count mismatch', () => {
      const file = createMinimalFile();
      file.batches[0].trailer.totalRecords = 999;

      const result = validateFileStructure(file);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Batch 0: record count mismatch: expected 4, got 999');
    });

    it('should reject file trailer totalBatches mismatch', () => {
      const file = createMinimalFile();
      file.fileTrailer.totalBatches = 99;

      const result = validateFileStructure(file);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('File trailer batch count mismatch: expected 1, got 99');
    });

    it('should reject file trailer totalRecords mismatch', () => {
      const file = createMinimalFile();
      file.fileTrailer.totalRecords = 99;

      const result = validateFileStructure(file);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('File trailer record count mismatch: expected 6, got 99');
    });

    it('should reject invalid segment sequence', () => {
      const file = createMinimalFile();
      file.batches[0].details[0].segmentQ.sequentialNumber = 1;

      const result = validateFileStructure(file);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Batch 0, Detail 0: invalid segment sequence');
    });
  });

  describe('validateCnab240File', () => {
    it('should validate complete file', () => {
      const file = createMinimalFile();

      const result = validateCnab240File(file);
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });
  });
});
