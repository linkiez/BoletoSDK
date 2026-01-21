import { SegmentRGenerator } from '../../../../src/generators/cnab240/SegmentRGenerator';
import { SegmentR } from '../../../../src/types';

describe('SegmentRGenerator', () => {
  let generator: SegmentRGenerator;

  beforeEach(() => {
    generator = new SegmentRGenerator();
  });

  // Helper function to create minimal SegmentR
  const createMinimalSegmentR = (
    bankCode = '341',
    batchNumber = 1,
    sequentialNumber = 3,
  ): SegmentR => ({
    bankCode,
    batchNumber,
    recordType: '3',
    sequentialNumber,
    segmentCode: 'R',
    occurrenceCode: '01',
  });

  describe('Basic generation', () => {
    it('should generate a line with exactly 240 characters', () => {
      const segment = createMinimalSegmentR();
      const line = generator.generate(segment);
      expect(line).toHaveLength(240);
    });

    it('should generate correct basic segment R for Itaú', () => {
      const segment = createMinimalSegmentR('341', 1, 3);
      const line = generator.generate(segment);

      // Bank code (positions 1-3)
      expect(line.substring(0, 3)).toBe('341');
      // Batch number (positions 4-7)
      expect(line.substring(3, 7)).toBe('0001');
      // Record type (position 8)
      expect(line.substring(7, 8)).toBe('3');
      // Sequential number (positions 9-13)
      expect(line.substring(8, 13)).toBe('00003');
      // Segment code (position 14)
      expect(line.substring(13, 14)).toBe('R');
    });
  });

  describe('Discount handling', () => {
    it('should handle second discount with fixed amount', () => {
      const segment: SegmentR = {
        ...createMinimalSegmentR(),
        discount2Code: '1',
        discount2Date: new Date('2024-02-15'),
        discount2Amount: 10, // R$ 10.00 (will be formatted as 1000 cents)
      };
      const line = generator.generate(segment);

      // Discount 2 code (position 18)
      expect(line.substring(17, 18)).toBe('1');
      // Discount 2 date (positions 19-26 - DDMMYYYY)
      expect(line.substring(18, 26)).toBe('15022024');
      // Discount 2 amount (positions 27-41 - 15 digits)
      expect(line.substring(26, 41)).toBe('000000000001000');
    });

    it('should handle second discount with percentage', () => {
      const segment: SegmentR = {
        ...createMinimalSegmentR(),
        discount2Code: '2',
        discount2Date: new Date('2024-03-10'),
        discount2Amount: 5, // 5% (will be formatted as 500)
      };
      const line = generator.generate(segment);

      expect(line.substring(17, 18)).toBe('2');
      expect(line.substring(18, 26)).toBe('10032024');
      expect(line.substring(26, 41)).toBe('000000000000500');
    });

    it('should handle third discount with fixed amount', () => {
      const segment: SegmentR = {
        ...createMinimalSegmentR(),
        discount3Code: '1',
        discount3Date: new Date('2024-04-20'),
        discount3Amount: 20, // R$ 20.00 (will be formatted as 2000 cents)
      };
      const line = generator.generate(segment);

      // Discount 3 code (position 42)
      expect(line.substring(41, 42)).toBe('1');
      // Discount 3 date (positions 43-50 - DDMMYYYY)
      expect(line.substring(42, 50)).toBe('20042024');
      // Discount 3 amount (positions 51-65 - 15 digits)
      expect(line.substring(50, 65)).toBe('000000000002000');
    });

    it('should handle both discounts together', () => {
      const segment: SegmentR = {
        ...createMinimalSegmentR(),
        discount2Code: '1',
        discount2Date: new Date('2024-02-15'),
        discount2Amount: 10, // R$ 10.00
        discount3Code: '1',
        discount3Date: new Date('2024-03-15'),
        discount3Amount: 15, // R$ 15.00
      };
      const line = generator.generate(segment);

      // Discount 2
      expect(line.substring(17, 18)).toBe('1');
      expect(line.substring(18, 26)).toBe('15022024');
      expect(line.substring(26, 41)).toBe('000000000001000');

      // Discount 3
      expect(line.substring(41, 42)).toBe('1');
      expect(line.substring(42, 50)).toBe('15032024');
      expect(line.substring(50, 65)).toBe('000000000001500');
    });
  });

  describe('Fine handling', () => {
    it('should handle fine with fixed amount', () => {
      const segment: SegmentR = {
        ...createMinimalSegmentR(),
        fineCode: '1',
        fineDate: new Date('2024-01-16'),
        fineAmount: 5, // R$ 5.00 (will be formatted as 500 cents)
      };
      const line = generator.generate(segment);

      // Fine code (position 66)
      expect(line.substring(65, 66)).toBe('1');
      // Fine date (positions 67-74 - DDMMYYYY)
      expect(line.substring(66, 74)).toBe('16012024');
      // Fine amount (positions 75-89 - 15 digits)
      expect(line.substring(74, 89)).toBe('000000000000500');
    });

    it('should handle fine with percentage', () => {
      const segment: SegmentR = {
        ...createMinimalSegmentR(),
        fineCode: '2',
        fineDate: new Date('2024-01-16'),
        fineAmount: 2, // 2% (will be formatted as 200)
      };
      const line = generator.generate(segment);

      expect(line.substring(65, 66)).toBe('2');
      expect(line.substring(66, 74)).toBe('16012024');
      expect(line.substring(74, 89)).toBe('000000000000200');
    });
  });

  describe('Payer information', () => {
    it('should handle payer information line 3', () => {
      const segment: SegmentR = {
        ...createMinimalSegmentR(),
        payerInformation: 'Payment instruction line 3',
      };
      const line = generator.generate(segment);

      // Per FEBRABAN spec:
      // Position 90-99 (PAYER_INFO): 10 chars - reserved/empty
      // Position 100-139 (MESSAGE_3): 40 chars - payerInformation
      expect(line.substring(89, 99)).toBe(' '.repeat(10)); // PAYER_INFO empty
      expect(line.substring(99, 139)).toBe('PAYMENT INSTRUCTION LINE 3              ');
    });

    it('should handle payer information line 4', () => {
      const segment: SegmentR = {
        ...createMinimalSegmentR(),
        payerInformation2: 'Payment instruction line 4',
      };
      const line = generator.generate(segment);

      // Position 140-179 (MESSAGE_4): 40 chars - payerInformation2
      expect(line.substring(139, 179)).toBe('PAYMENT INSTRUCTION LINE 4              ');
    });

    it('should truncate long payer information', () => {
      const segment: SegmentR = {
        ...createMinimalSegmentR(),
        payerInformation: 'A'.repeat(50),
        payerInformation2: 'B'.repeat(50),
      };
      const line = generator.generate(segment);

      // MESSAGE_3 at positions 100-139 (40 chars)
      expect(line.substring(99, 139)).toBe('A'.repeat(40));
      // MESSAGE_4 at positions 140-179 (40 chars)
      expect(line.substring(139, 179)).toBe('B'.repeat(40));
    });

    it('should handle payer info field', () => {
      const segment: SegmentR = {
        ...createMinimalSegmentR(),
        payerInfo: 'INFO12345',
      };
      const line = generator.generate(segment);

      // PAYER_INFO at positions 90-99 (10 chars)
      expect(line.substring(89, 99)).toBe('INFO12345 ');
    });
  });

  describe('Validation', () => {
    it('should throw error if bankCode is missing', () => {
      const segment: Partial<SegmentR> = {
        ...createMinimalSegmentR(),
        bankCode: undefined,
      };
      expect(() => generator.generate(segment as SegmentR)).toThrow('Bank code is required');
    });

    it('should throw error if batchNumber is missing', () => {
      const segment: Partial<SegmentR> = {
        ...createMinimalSegmentR(),
        batchNumber: undefined,
      };
      expect(() => generator.generate(segment as SegmentR)).toThrow('Batch number is required');
    });

    it('should throw error if occurrenceCode is missing', () => {
      const segment: Partial<SegmentR> = {
        ...createMinimalSegmentR(),
        occurrenceCode: undefined,
      };
      expect(() => generator.generate(segment as SegmentR)).toThrow('Occurrence code is required');
    });
  });

  describe('Field positioning', () => {
    it('should position occurrence code at positions 16-17', () => {
      const segment: SegmentR = {
        ...createMinimalSegmentR(),
        occurrenceCode: '05',
      };
      const line = generator.generate(segment);

      expect(line.substring(15, 17)).toBe('05');
    });

    it('should position discount codes correctly', () => {
      const segment: SegmentR = {
        ...createMinimalSegmentR(),
        discount2Code: '1',
        discount2Date: new Date('2024-01-01'),
        discount2Amount: 0,
        discount3Code: '2',
        discount3Date: new Date('2024-02-01'),
        discount3Amount: 0,
      };
      const line = generator.generate(segment);

      // Discount 2 code at position 18
      expect(line.substring(17, 18)).toBe('1');
      // Discount 3 code at position 42
      expect(line.substring(41, 42)).toBe('2');
    });

    it('should position fine information correctly', () => {
      const segment: SegmentR = {
        ...createMinimalSegmentR(),
        fineCode: '1',
        fineDate: new Date('2024-01-01'),
        fineAmount: 0,
      };
      const line = generator.generate(segment);

      // Fine code at position 66
      expect(line.substring(65, 66)).toBe('1');
    });

    it('should fill reserved fields with spaces', () => {
      const segment = createMinimalSegmentR();
      const line = generator.generate(segment);

      // Position 15 (CNAB reserved)
      expect(line.substring(14, 15)).toBe(' ');
      // Positions 170-240 (CNAB reserved)
      expect(line.substring(169, 240)).toBe(' '.repeat(71));
    });
  });
});
