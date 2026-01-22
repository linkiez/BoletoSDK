import { FileTrailerGenerator } from '../../../../src/generators/cnab240/FileTrailerGenerator';
import * as LineGenerator from '../../../../src/generators/cnab240/LineGenerator';
import { FileTrailer } from '../../../../src/types';

describe('CNAB240 FileTrailerGenerator', () => {
  let generator: FileTrailerGenerator;

  beforeEach(() => {
    generator = new FileTrailerGenerator();
  });

  describe('generate', () => {
    it('should generate valid file trailer line with 240 characters', () => {
      const trailer: FileTrailer = {
        bankCode: '341',
        batchNumber: '9999',
        recordType: '9',
        totalBatches: 2,
        totalRecords: 14,
        totalAccounts: 0,
      };

      const result = generator.generate(trailer);

      expect(result).toHaveLength(240);
      expect(result.substring(0, 3)).toBe('341'); // Bank code
      expect(result.substring(3, 7)).toBe('9999'); // Batch number (9999 for file trailer)
      expect(result.substring(7, 8)).toBe('9'); // Record type
      expect(result.substring(17, 23)).toBe('000002'); // Total batches
      expect(result.substring(23, 29)).toBe('000014'); // Total records
      expect(result.substring(29, 35)).toBe('000000'); // Total accounts
    });

    it('should handle large numbers correctly', () => {
      const trailer: FileTrailer = {
        bankCode: '001',
        batchNumber: '9999',
        recordType: '9',
        totalBatches: 999,
        totalRecords: 999999,
        totalAccounts: 500000,
      };

      const result = generator.generate(trailer);

      expect(result).toHaveLength(240);
      expect(result.substring(0, 3)).toBe('001');
      expect(result.substring(17, 23)).toBe('000999'); // Total batches
      expect(result.substring(23, 29)).toBe('999999'); // Total records (max 6 digits)
      expect(result.substring(29, 35)).toBe('500000'); // Total accounts
    });

    it('should handle zero values', () => {
      const trailer: FileTrailer = {
        bankCode: '237',
        batchNumber: '9999',
        recordType: '9',
        totalBatches: 0,
        totalRecords: 0,
        totalAccounts: 0,
      };

      const result = generator.generate(trailer);

      expect(result).toHaveLength(240);
      expect(result.substring(17, 23)).toBe('000000'); // Total batches = 0
      expect(result.substring(23, 29)).toBe('000000'); // Total records = 0
      expect(result.substring(29, 35)).toBe('000000'); // Total accounts = 0
    });

    it('should always use batch number 9999', () => {
      const trailer: FileTrailer = {
        bankCode: '033',
        batchNumber: '9999',
        recordType: '9',
        totalBatches: 1,
        totalRecords: 10,
        totalAccounts: 5,
      };

      const result = generator.generate(trailer);

      expect(result.substring(3, 7)).toBe('9999'); // Always 9999 for file trailer
    });

    it('should validate required fields', () => {
      const invalidTrailer = {
        bankCode: '',
        batchNumber: '9999',
        recordType: '9',
        totalBatches: 0,
        totalRecords: 0,
        totalAccounts: 0,
      };

      expect(() => generator.generate(invalidTrailer as FileTrailer)).toThrow(
        'Bank code is required',
      );
    });

    it('should throw when generated line length is invalid', () => {
      const trailer = createMinimalTrailer('341');
      const buildLineSpy = jest.spyOn(LineGenerator, 'buildLine').mockReturnValue('INVALID');

      expect(() => generator.generate(trailer)).toThrow(
        'Invalid file trailer length: expected 240, got 7',
      );

      buildLineSpy.mockRestore();
    });

    it('should fill reserved fields with spaces', () => {
      const trailer: FileTrailer = {
        bankCode: '104',
        batchNumber: '9999',
        recordType: '9',
        totalBatches: 1,
        totalRecords: 5,
        totalAccounts: 2,
      };

      const result = generator.generate(trailer);

      // Positions 9-17 should be spaces (reserved)
      expect(result.substring(8, 17)).toBe('         ');
      // Positions 36-240 should be spaces (reserved)
      expect(result.substring(35, 240).trim()).toBe('');
    });
  });

  describe('Field positioning', () => {
    it('should place bank code at positions 1-3', () => {
      const trailer = createMinimalTrailer('999');
      const result = generator.generate(trailer);
      expect(result.substring(0, 3)).toBe('999');
    });

    it('should place batch number at positions 4-7', () => {
      const trailer = createMinimalTrailer('001');
      const result = generator.generate(trailer);
      expect(result.substring(3, 7)).toBe('9999'); // Always 9999 for file trailer
    });

    it('should place record type at position 8', () => {
      const trailer = createMinimalTrailer('001');
      const result = generator.generate(trailer);
      expect(result.substring(7, 8)).toBe('9'); // Always 9 for file trailer
    });

    it('should place total batches at positions 18-23', () => {
      const trailer: FileTrailer = {
        bankCode: '001',
        batchNumber: '9999',
        recordType: '9',
        totalBatches: 42,
        totalRecords: 100,
        totalAccounts: 50,
      };
      const result = generator.generate(trailer);
      expect(result.substring(17, 23)).toBe('000042');
    });

    it('should place total records at positions 24-29', () => {
      const trailer: FileTrailer = {
        bankCode: '001',
        batchNumber: '9999',
        recordType: '9',
        totalBatches: 10,
        totalRecords: 12345,
        totalAccounts: 100,
      };
      const result = generator.generate(trailer);
      expect(result.substring(23, 29)).toBe('012345');
    });
  });

  describe('Validation', () => {
    it('should throw error if batchNumber is missing', () => {
      const invalidTrailer = createMinimalTrailer('341');
      invalidTrailer.batchNumber = '';

      expect(() => generator.generate(invalidTrailer)).toThrow('Batch number is required');
    });

    it('should throw error if recordType is missing', () => {
      const invalidTrailer = createMinimalTrailer('341');
      invalidTrailer.recordType = '';

      expect(() => generator.generate(invalidTrailer)).toThrow('Record type is required');
    });

    it('should throw error if totalBatches is missing', () => {
      const invalidTrailer = createMinimalTrailer('341');
      invalidTrailer.totalBatches = undefined as unknown as FileTrailer['totalBatches'];

      expect(() => generator.generate(invalidTrailer)).toThrow('Total batches is required');
    });

    it('should throw error if totalRecords is missing', () => {
      const invalidTrailer = createMinimalTrailer('341');
      invalidTrailer.totalRecords = undefined as unknown as FileTrailer['totalRecords'];

      expect(() => generator.generate(invalidTrailer)).toThrow('Total records is required');
    });
  });
});

// Helper function
function createMinimalTrailer(bankCode: string): FileTrailer {
  return {
    bankCode,
    batchNumber: '9999',
    recordType: '9',
    totalBatches: 1,
    totalRecords: 10,
    totalAccounts: 5,
  };
}
