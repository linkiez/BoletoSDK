/**
 * CNAB400 Validators - Unit Tests
 *
 * Tests business rule validation for CNAB400 files
 */

import { validateCnab400File, validateFileStructure } from '../../../src/validators/cnab400';
import type { Cnab400File } from '../../../src/types/cnab400';

describe('CNAB400 Validators', () => {
  describe('validateFileStructure', () => {
    it('should accept valid file structure', () => {
      const file: Cnab400File = {
        header: {
          recordType: '0',
          operationType: '2',
          operationLiteral: 'RETORNO',
          serviceCode: '01',
          serviceLiteral: 'COBRANCA',
          agency: '1234',
          zeros: '00',
          account: '12345',
          accountDigit: '6',
          companyName: 'TEST COMPANY',
          bankCode: '341',
          bankName: 'BANCO ITAU SA',
          generationDate: new Date('2026-01-01'),
          sequenceNumber: 1,
          creationDate: new Date('2026-01-01'),
        },
        details: [
          {
            recordType: '1',
            companyRegistrationType: '02',
            companyRegistrationNumber: '12345678000195',
            agency: '1234',
            account: '12345',
            accountDigit: '6',
            ourNumber: '12345678',
            dueDate: new Date('2026-02-01'),
            amount: 100.5,
            payerName: 'John Doe',
            sequentialNumber: 2,
          },
        ],
        trailer: {
          recordType: '9',
          totalRecords: 3,
          sequentialNumber: 3,
        },
      };

      const result = validateFileStructure(file);
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should reject file without header', () => {
      const file = {
        details: [],
        trailer: { recordType: '9', totalRecords: 2, sequentialNumber: 2 },
      } as unknown as Cnab400File;

      const result = validateFileStructure(file);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Missing header');
    });

    it('should reject file without trailer', () => {
      const file = {
        header: { recordType: '0' },
        details: [],
      } as unknown as Cnab400File;

      const result = validateFileStructure(file);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Missing trailer');
    });

    it('should reject file with no detail records', () => {
      const file: Cnab400File = {
        header: {
          recordType: '0',
          operationType: '2',
          operationLiteral: 'RETORNO',
          serviceCode: '01',
          serviceLiteral: 'COBRANCA',
          agency: '1234',
          zeros: '00',
          account: '12345',
          accountDigit: '6',
          companyName: 'TEST COMPANY',
          bankCode: '341',
          bankName: 'BANCO ITAU SA',
          generationDate: new Date('2026-01-01'),
          sequenceNumber: 1,
          creationDate: new Date('2026-01-01'),
        },
        details: [],
        trailer: {
          recordType: '9',
          totalRecords: 2,
          sequentialNumber: 2,
        },
      };

      const result = validateFileStructure(file);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('No detail records found');
    });

    it('should reject file with record count mismatch', () => {
      const file: Cnab400File = {
        header: {
          recordType: '0',
          operationType: '2',
          operationLiteral: 'RETORNO',
          serviceCode: '01',
          serviceLiteral: 'COBRANCA',
          agency: '1234',
          zeros: '00',
          account: '12345',
          accountDigit: '6',
          companyName: 'TEST COMPANY',
          bankCode: '341',
          bankName: 'BANCO ITAU SA',
          generationDate: new Date('2026-01-01'),
          sequenceNumber: 1,
          creationDate: new Date('2026-01-01'),
        },
        details: [
          {
            recordType: '1',
            companyRegistrationType: '02',
            companyRegistrationNumber: '12345678000195',
            agency: '1234',
            account: '12345',
            accountDigit: '6',
            ourNumber: '12345678',
            dueDate: new Date('2026-02-01'),
            amount: 100.5,
            payerName: 'John Doe',
            sequentialNumber: 2,
          },
        ],
        trailer: {
          recordType: '9',
          totalRecords: 999, // Wrong count
          sequentialNumber: 3,
        },
      };

      const result = validateFileStructure(file);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Record count mismatch: expected 3, got 999');
    });
  });

  describe('validateCnab400File', () => {
    it('should validate complete file', () => {
      const file: Cnab400File = {
        header: {
          recordType: '0',
          operationType: '2',
          operationLiteral: 'RETORNO',
          serviceCode: '01',
          serviceLiteral: 'COBRANCA',
          agency: '1234',
          zeros: '00',
          account: '12345',
          accountDigit: '6',
          companyName: 'TEST COMPANY',
          bankCode: '341',
          bankName: 'BANCO ITAU SA',
          generationDate: new Date('2026-01-01'),
          sequenceNumber: 1,
          creationDate: new Date('2026-01-01'),
        },
        details: [
          {
            recordType: '1',
            companyRegistrationType: '02',
            companyRegistrationNumber: '12345678000195',
            agency: '1234',
            account: '12345',
            accountDigit: '6',
            ourNumber: '12345678',
            dueDate: new Date('2026-02-01'),
            amount: 100.5,
            payerName: 'John Doe',
            sequentialNumber: 2,
          },
        ],
        trailer: {
          recordType: '9',
          totalRecords: 3,
          sequentialNumber: 3,
        },
      };

      const result = validateCnab400File(file);
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });
  });
});
