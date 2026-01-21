import { SegmentPGenerator } from '../../../../src/generators/cnab240/SegmentPGenerator';
import { SegmentP } from '../../../../src/types';

describe('CNAB240 SegmentPGenerator', () => {
  let generator: SegmentPGenerator;

  beforeEach(() => {
    generator = new SegmentPGenerator();
  });

  describe('generate', () => {
    it('should generate valid segment P line with 240 characters', () => {
      const segment: SegmentP = {
        bankCode: '341',
        batchNumber: 1,
        recordType: '3',
        sequentialNumber: 1,
        segmentCode: 'P',
        occurrenceCode: '01',
        agency: '1234',
        account: '123456',
        accountDigit: '7',
        ourNumber: '12345678901',
        portfolioCode: '109',
        documentNumber: 'NF001',
        dueDate: new Date('2026-02-28'),
        amount: 15000, // R$ 150.00
        speciesCode: '01',
        acceptance: 'N',
        issueDate: new Date('2026-01-21'),
        currencyCode: '09',
      };

      const result = generator.generate(segment);

      expect(result).toHaveLength(240);
      expect(result.substring(0, 3)).toBe('341'); // Bank code
      expect(result.substring(3, 7)).toBe('0001'); // Batch number
      expect(result.substring(7, 8)).toBe('3'); // Record type
      expect(result.substring(13, 14)).toBe('P'); // Segment code
      expect(result.substring(15, 17)).toBe('01'); // Occurrence code
    });

    it('should handle Itaú bank correctly', () => {
      const segment = createMinimalSegment('341', 1, 1);
      segment.portfolioCode = '109';
      segment.ourNumber = '12345678901';

      const result = generator.generate(segment);

      expect(result.substring(0, 3)).toBe('341');
      expect(result).toHaveLength(240);
    });

    it('should format due date as DDMMYYYY', () => {
      const segment = createMinimalSegment('001', 1, 1);
      segment.dueDate = new Date('2026-12-31');

      const result = generator.generate(segment);

      // Due date at positions 90-97 (DDMMYYYY)
      expect(result.substring(89, 97)).toBe('31122026');
    });

    it('should format amount with implied decimals', () => {
      const segment = createMinimalSegment('237', 1, 1);
      segment.amount = 1234.56; // R$ 1,234.56 (will be converted to cents)

      const result = generator.generate(segment);

      // Amount at positions 98-112 (15 digits, 2 implied decimals)
      // 1234.56 * 100 = 123456
      expect(result.substring(97, 112)).toBe('000000000123456');
    });

    it('should handle interest configuration', () => {
      const segment = createMinimalSegment('033', 1, 1);
      segment.interestCode = '2'; // Monthly percentage
      segment.interestDate = new Date('2026-03-01');
      segment.interestAmount = 200; // 2% monthly

      const result = generator.generate(segment);

      expect(result).toHaveLength(240);
    });

    it('should handle discount configuration', () => {
      const segment = createMinimalSegment('104', 1, 1);
      segment.discountCode = '1'; // Fixed amount
      segment.discountDate = new Date('2026-02-20');
      segment.discountAmount = 1000; // R$ 10.00

      const result = generator.generate(segment);

      expect(result).toHaveLength(240);
    });

    it('should handle protest and write-off codes', () => {
      const segment = createMinimalSegment('341', 1, 1);
      segment.protestCode = '1'; // Protest
      segment.protestDays = 10;
      segment.writeOffCode = '2'; // Do not write off
      segment.writeOffDays = 60;

      const result = generator.generate(segment);

      expect(result).toHaveLength(240);
    });

    it('should validate required fields', () => {
      const invalidSegment = {
        bankCode: '',
        batchNumber: 1,
        recordType: '3',
      };

      expect(() => generator.generate(invalidSegment as SegmentP)).toThrow('Bank code is required');
    });

    it('should handle sequential numbering', () => {
      const segment1 = createMinimalSegment('001', 1, 1);
      const segment2 = createMinimalSegment('001', 1, 2);
      const segment3 = createMinimalSegment('001', 1, 99);

      const result1 = generator.generate(segment1);
      const result2 = generator.generate(segment2);
      const result3 = generator.generate(segment3);

      expect(result1.substring(8, 13)).toBe('00001');
      expect(result2.substring(8, 13)).toBe('00002');
      expect(result3.substring(8, 13)).toBe('00099');
    });

    it('should handle portfolio codes for different banks', () => {
      const itau = createMinimalSegment('341', 1, 1);
      itau.portfolioCode = '109';

      const bb = createMinimalSegment('001', 1, 1);
      bb.portfolioCode = '17';

      const santander = createMinimalSegment('033', 1, 1);
      santander.portfolioCode = '101';

      const result1 = generator.generate(itau);
      const result2 = generator.generate(bb);
      const result3 = generator.generate(santander);

      expect(result1).toHaveLength(240);
      expect(result2).toHaveLength(240);
      expect(result3).toHaveLength(240);
    });
  });

  describe('Field positioning', () => {
    it('should place bank code at positions 1-3', () => {
      const segment = createMinimalSegment('999', 1, 1);
      const result = generator.generate(segment);
      expect(result.substring(0, 3)).toBe('999');
    });

    it('should place batch number at positions 4-7', () => {
      const segment = createMinimalSegment('001', 42, 1);
      const result = generator.generate(segment);
      expect(result.substring(3, 7)).toBe('0042');
    });

    it('should place record type at position 8', () => {
      const segment = createMinimalSegment('001', 1, 1);
      const result = generator.generate(segment);
      expect(result.substring(7, 8)).toBe('3'); // Always 3 for detail
    });

    it('should place segment code at position 14', () => {
      const segment = createMinimalSegment('001', 1, 1);
      const result = generator.generate(segment);
      expect(result.substring(13, 14)).toBe('P');
    });

    it('should place occurrence code at positions 16-17', () => {
      const segment = createMinimalSegment('001', 1, 1);
      segment.occurrenceCode = '06'; // Payment confirmation
      const result = generator.generate(segment);
      expect(result.substring(15, 17)).toBe('06');
    });

    it('should place document number at correct position', () => {
      const segment = createMinimalSegment('001', 1, 1);
      segment.documentNumber = 'DOC123';
      const result = generator.generate(segment);
      // Document number at positions 75-89 (15 chars)
      expect(result.substring(74, 89)).toBe('DOC123         ');
    });
  });
});

// Helper function
function createMinimalSegment(
  bankCode: string,
  batchNumber: number,
  sequentialNumber: number,
): SegmentP {
  return {
    bankCode,
    batchNumber,
    recordType: '3',
    sequentialNumber,
    segmentCode: 'P',
    occurrenceCode: '01',
    agency: '1234',
    account: '123456',
    accountDigit: '7',
    ourNumber: '12345678901',
    portfolioCode: '109',
    documentNumber: 'NF001',
    dueDate: new Date('2026-02-28'),
    amount: 15000,
    speciesCode: '01',
    acceptance: 'N',
    issueDate: new Date('2026-01-21'),
    currencyCode: '09',
  };
}
