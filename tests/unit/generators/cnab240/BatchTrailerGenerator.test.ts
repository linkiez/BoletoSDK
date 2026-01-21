import { BatchTrailerGenerator } from '../../../../src/generators/cnab240/BatchTrailerGenerator';
import { BatchTrailer } from '../../../../src/types';

describe('CNAB240 BatchTrailerGenerator', () => {
  let generator: BatchTrailerGenerator;

  beforeEach(() => {
    generator = new BatchTrailerGenerator();
  });

  describe('generate', () => {
    it('should generate valid batch trailer line with 240 characters', () => {
      const trailer: BatchTrailer = {
        bankCode: '341',
        batchNumber: 1,
        recordType: '5',
        totalRecords: 4,
        totalSimpleSlips: 2,
        totalSimpleAmount: 10050,
      };

      const result = generator.generate(trailer);

      expect(result).toHaveLength(240);
      expect(result.substring(0, 3)).toBe('341'); // Bank code
      expect(result.substring(3, 7)).toBe('0001'); // Batch number
      expect(result.substring(7, 8)).toBe('5'); // Record type
      expect(result.substring(17, 23)).toBe('000004'); // Total records
    });

    it('should handle large total values correctly', () => {
      const trailer: BatchTrailer = {
        bankCode: '001',
        batchNumber: 42,
        recordType: '5',
        totalRecords: 999,
        totalSimpleSlips: 500,
        totalSimpleAmount: 999999999999, // 9,999,999,999.99
      };

      const result = generator.generate(trailer);

      expect(result).toHaveLength(240);
      expect(result.substring(0, 3)).toBe('001');
      expect(result.substring(3, 7)).toBe('0042');
      expect(result.substring(17, 23)).toBe('000999'); // Total records
    });

    it('should handle zero values', () => {
      const trailer: BatchTrailer = {
        bankCode: '237',
        batchNumber: 1,
        recordType: '5',
        totalRecords: 0,
        totalSimpleSlips: 0,
        totalSimpleAmount: 0,
      };

      const result = generator.generate(trailer);

      expect(result).toHaveLength(240);
      expect(result.substring(17, 23)).toBe('000000'); // Total records = 0
    });

    it('should format batch number with leading zeros', () => {
      const trailer1 = createMinimalTrailer('001', 1);
      const trailer2 = createMinimalTrailer('001', 99);
      const trailer3 = createMinimalTrailer('001', 9999);

      const result1 = generator.generate(trailer1);
      const result2 = generator.generate(trailer2);
      const result3 = generator.generate(trailer3);

      expect(result1.substring(3, 7)).toBe('0001');
      expect(result2.substring(3, 7)).toBe('0099');
      expect(result3.substring(3, 7)).toBe('9999');
    });

    it('should validate required fields', () => {
      const invalidTrailer = {
        bankCode: '',
        batchNumber: 1,
        recordType: '5',
        totalRecords: 0,
      };

      expect(() => generator.generate(invalidTrailer as BatchTrailer)).toThrow(
        'Bank code is required',
      );
    });

    it('should fill reserved fields with spaces', () => {
      const trailer: BatchTrailer = {
        bankCode: '104',
        batchNumber: 1,
        recordType: '5',
        totalRecords: 5,
        totalSimpleAmount: 50000,
        totalSimpleSlips: 2,
      };

      const result = generator.generate(trailer);

      // Positions 9-17 should be spaces (reserved)
      expect(result.substring(8, 17)).toBe('         ');
      // Check that reserved areas are spaces
      expect(result.substring(230, 240).trim()).toBe('');
    });

    it('should handle Santander bank (033) correctly', () => {
      const trailer = createMinimalTrailer('033', 2);
      trailer.totalRecords = 10;
      trailer.totalSimpleAmount = 250000; // 2,500.00

      const result = generator.generate(trailer);

      expect(result.substring(0, 3)).toBe('033');
      expect(result.substring(3, 7)).toBe('0002');
      expect(result).toHaveLength(240);
    });

    it('should handle optional fields', () => {
      const trailer: BatchTrailer = {
        bankCode: '341',
        batchNumber: 1,
        recordType: '5',
        totalRecords: 4,
      };

      const result = generator.generate(trailer);

      expect(result).toHaveLength(240);
      // Should not throw for missing optional fields
    });
  });

  describe('Field positioning', () => {
    it('should place bank code at positions 1-3', () => {
      const trailer = createMinimalTrailer('999', 1);
      const result = generator.generate(trailer);
      expect(result.substring(0, 3)).toBe('999');
    });

    it('should place batch number at positions 4-7', () => {
      const trailer = createMinimalTrailer('001', 123);
      const result = generator.generate(trailer);
      expect(result.substring(3, 7)).toBe('0123');
    });

    it('should place record type at position 8', () => {
      const trailer = createMinimalTrailer('001', 1);
      const result = generator.generate(trailer);
      expect(result.substring(7, 8)).toBe('5'); // Always 5 for batch trailer
    });

    it('should place total records at positions 18-23', () => {
      const trailer: BatchTrailer = {
        bankCode: '001',
        batchNumber: 1,
        recordType: '5',
        totalRecords: 123,
        totalSimpleAmount: 50000,
        totalSimpleSlips: 10,
      };
      const result = generator.generate(trailer);
      expect(result.substring(17, 23)).toBe('000123');
    });

    it('should place total value at correct position', () => {
      const trailer: BatchTrailer = {
        bankCode: '001',
        batchNumber: 1,
        recordType: '5',
        totalRecords: 4,
        totalSimpleAmount: 123456, // 1,234.56
        totalSimpleSlips: 2,
      };
      const result = generator.generate(trailer);
      // Total simple amount at positions 30-47 (18 digits with 2 decimal places implied)
      expect(result.substring(29, 47)).toBe('000000000000123456');
    });
  });
});

// Helper function
function createMinimalTrailer(bankCode: string, batchNumber: number): BatchTrailer {
  return {
    bankCode,
    batchNumber,
    recordType: '5',
    totalRecords: 4,
    totalSimpleAmount: 10000,
    totalSimpleSlips: 2,
  };
}
