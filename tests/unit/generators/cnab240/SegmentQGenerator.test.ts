import * as LineGenerator from '../../../../src/generators/cnab240/LineGenerator';
import { SegmentQGenerator } from '../../../../src/generators/cnab240/SegmentQGenerator';
import { SegmentQ } from '../../../../src/types';

describe('CNAB240 SegmentQGenerator', () => {
  let generator: SegmentQGenerator;

  beforeEach(() => {
    generator = new SegmentQGenerator();
  });

  describe('generate', () => {
    it('should generate valid segment Q line with 240 characters', () => {
      const segment: SegmentQ = {
        bankCode: '341',
        batchNumber: 1,
        recordType: '3',
        sequentialNumber: 1,
        segmentCode: 'Q',
        occurrenceCode: '01',
        payerRegistrationType: '1',
        payerTaxId: '12345678901',
        payerName: 'JOAO DA SILVA',
        payerAddress: 'RUA DAS FLORES 123',
        payerNeighborhood: 'CENTRO',
        payerPostalCode: '01234567',
        payerCity: 'SAO PAULO',
        payerState: 'SP',
      };

      const result = generator.generate(segment);

      expect(result).toHaveLength(240);
      expect(result.substring(0, 3)).toBe('341'); // Bank code
      expect(result.substring(3, 7)).toBe('0001'); // Batch number
      expect(result.substring(7, 8)).toBe('3'); // Record type
      expect(result.substring(13, 14)).toBe('Q'); // Segment code
      expect(result.substring(17, 18)).toBe('1'); // Payer registration type
    });

    it('should handle CPF (11 digits)', () => {
      const segment = createMinimalSegmentQ('341', 1, 1);
      segment.payerRegistrationType = '1';
      segment.payerTaxId = '12345678901';

      const result = generator.generate(segment);

      expect(result.substring(17, 18)).toBe('1'); // Type 1 = CPF
      expect(result.substring(18, 33)).toBe('000012345678901'); // CPF padded to 15 digits (positions 19-33)
    });

    it('should handle CNPJ (14 digits)', () => {
      const segment = createMinimalSegmentQ('341', 1, 1);
      segment.payerRegistrationType = '2';
      segment.payerTaxId = '12345678000195';

      const result = generator.generate(segment);

      expect(result.substring(17, 18)).toBe('2'); // Type 2 = CNPJ
      expect(result.substring(18, 33)).toBe('012345678000195'); // CNPJ padded to 15 digits
    });

    it('should pad payer name to 40 characters', () => {
      const segment = createMinimalSegmentQ('001', 1, 1);
      segment.payerName = 'JOSE';

      const result = generator.generate(segment);

      const payerName = result.substring(33, 73);
      expect(payerName).toHaveLength(40);
      expect(payerName).toBe('JOSE                                    ');
    });

    it('should truncate long payer name to 40 characters', () => {
      const segment = createMinimalSegmentQ('237', 1, 1);
      segment.payerName = 'NOME MUITO LONGO QUE DEVE SER TRUNCADO PARA CABER NO CAMPO';

      const result = generator.generate(segment);

      const payerName = result.substring(33, 73);
      expect(payerName).toHaveLength(40);
      expect(payerName).toBe('NOME MUITO LONGO QUE DEVE SER TRUNCADO P');
    });

    it('should pad address to 40 characters', () => {
      const segment = createMinimalSegmentQ('033', 1, 1);
      segment.payerAddress = 'RUA A';

      const result = generator.generate(segment);

      const address = result.substring(73, 113);
      expect(address).toHaveLength(40);
      expect(address).toBe('RUA A                                   ');
    });

    it('should pad district to 15 characters', () => {
      const segment = createMinimalSegmentQ('104', 1, 1);
      segment.payerNeighborhood = 'CENTRO';

      const result = generator.generate(segment);

      const district = result.substring(113, 128);
      expect(district).toHaveLength(15);
      expect(district).toBe('CENTRO         ');
    });

    it('should format postal code with 8 digits', () => {
      const segment = createMinimalSegmentQ('341', 1, 1);
      segment.payerPostalCode = '12345678';

      const result = generator.generate(segment);

      expect(result.substring(128, 136)).toBe('12345678');
    });

    it('should handle postal code with less than 8 digits', () => {
      const segment = createMinimalSegmentQ('341', 1, 1);
      segment.payerPostalCode = '1234';

      const result = generator.generate(segment);

      expect(result.substring(128, 136)).toBe('00001234');
    });

    it('should pad city to 15 characters', () => {
      const segment = createMinimalSegmentQ('001', 1, 1);
      segment.payerCity = 'SP';

      const result = generator.generate(segment);

      const city = result.substring(136, 151);
      expect(city).toHaveLength(15);
      expect(city).toBe('SP             ');
    });

    it('should handle state with 2 characters', () => {
      const segment = createMinimalSegmentQ('341', 1, 1);
      segment.payerState = 'RJ';

      const result = generator.generate(segment);

      expect(result.substring(151, 153)).toBe('RJ');
    });

    it('should validate required fields', () => {
      const invalidSegment = {
        bankCode: '',
        batchNumber: 1,
        recordType: '3',
        sequentialNumber: 1,
        segmentCode: 'Q',
      };

      expect(() => generator.generate(invalidSegment as SegmentQ)).toThrow('Bank code is required');
    });

    it('should handle multiple sequential numbers', () => {
      const segment1 = createMinimalSegmentQ('341', 1, 1);
      const segment2 = createMinimalSegmentQ('341', 1, 2);
      const segment3 = createMinimalSegmentQ('341', 1, 99);

      const result1 = generator.generate(segment1);
      const result2 = generator.generate(segment2);
      const result3 = generator.generate(segment3);

      expect(result1.substring(8, 13)).toBe('00001');
      expect(result2.substring(8, 13)).toBe('00002');
      expect(result3.substring(8, 13)).toBe('00099');
    });

    it('should handle optional guarantor fields as empty', () => {
      const segment: SegmentQ = {
        bankCode: '341',
        batchNumber: 1,
        recordType: '3',
        sequentialNumber: 1,
        segmentCode: 'Q',
        occurrenceCode: '01',
        payerRegistrationType: '1',
        payerTaxId: '12345678901',
        payerName: 'JOAO DA SILVA',
        payerAddress: 'RUA A',
        payerNeighborhood: 'CENTRO',
        payerPostalCode: '12345678',
        payerCity: 'SAO PAULO',
        payerState: 'SP',
      };

      const result = generator.generate(segment);

      expect(result).toHaveLength(240);
      // Guarantor fields should be filled with spaces/zeros
    });

    it('should include guarantor fields when provided', () => {
      const segment: SegmentQ = {
        bankCode: '341',
        batchNumber: 1,
        recordType: '3',
        sequentialNumber: 1,
        segmentCode: 'Q',
        occurrenceCode: '01',
        payerRegistrationType: '2',
        payerTaxId: '12345678000195',
        payerName: 'JOAO DA SILVA',
        payerAddress: 'RUA A',
        payerNeighborhood: 'CENTRO',
        payerPostalCode: '12345678',
        payerCity: 'SAO PAULO',
        payerState: 'SP',
        guarantorRegistrationType: '1',
        guarantorTaxId: '12345678901',
        guarantorName: 'GARANTIDOR TESTE',
      };

      const result = generator.generate(segment);

      const guarantorName = result.substring(169, 209);

      expect(result.substring(153, 154)).toBe('1');
      expect(result.substring(154, 169)).toBe('000012345678901');
      expect(guarantorName).toHaveLength(40);
      expect(guarantorName.trim()).toBe('GARANTIDOR TESTE');
    });

    it('should throw when generated line length is invalid', () => {
      const segment = createMinimalSegmentQ('341', 1, 1);
      const buildLineSpy = jest.spyOn(LineGenerator, 'buildLine').mockReturnValue('INVALID');

      expect(() => generator.generate(segment)).toThrow(
        'Invalid segment Q length: expected 240, got 7',
      );

      buildLineSpy.mockRestore();
    });
  });

  describe('Field positioning', () => {
    it('should place bank code at positions 1-3', () => {
      const segment = createMinimalSegmentQ('999', 1, 1);
      const result = generator.generate(segment);
      expect(result.substring(0, 3)).toBe('999');
    });

    it('should place batch number at positions 4-7', () => {
      const segment = createMinimalSegmentQ('001', 42, 1);
      const result = generator.generate(segment);
      expect(result.substring(3, 7)).toBe('0042');
    });

    it('should place record type at position 8', () => {
      const segment = createMinimalSegmentQ('001', 1, 1);
      const result = generator.generate(segment);
      expect(result.substring(7, 8)).toBe('3'); // Always 3 for detail
    });

    it('should place segment code at position 14', () => {
      const segment = createMinimalSegmentQ('001', 1, 1);
      const result = generator.generate(segment);
      expect(result.substring(13, 14)).toBe('Q');
    });

    it('should place payer registration type at position 18', () => {
      const segment = createMinimalSegmentQ('001', 1, 1);
      segment.payerRegistrationType = '2';
      const result = generator.generate(segment);
      expect(result.substring(17, 18)).toBe('2');
    });

    it('should place payer name at positions 34-73', () => {
      const segment = createMinimalSegmentQ('001', 1, 1);
      segment.payerName = 'MARIA SILVA';
      const result = generator.generate(segment);
      expect(result.substring(33, 73)).toBe('MARIA SILVA                             ');
    });

    it('should place payer address at positions 74-113', () => {
      const segment = createMinimalSegmentQ('001', 1, 1);
      segment.payerAddress = 'AV BRASIL 100';
      const result = generator.generate(segment);
      expect(result.substring(73, 113)).toBe('AV BRASIL 100                           ');
    });
  });

  describe('Validation', () => {
    it('should throw error if batchNumber is missing', () => {
      const invalidSegment = {
        bankCode: '341',
        batchNumber: undefined,
        recordType: '3',
        sequentialNumber: 1,
        segmentCode: 'Q',
        occurrenceCode: '01',
        payerRegistrationType: '1',
        payerTaxId: '12345678901',
        payerName: 'JOAO DA SILVA',
        payerAddress: 'RUA A',
        payerNeighborhood: 'CENTRO',
        payerPostalCode: '12345678',
        payerCity: 'SAO PAULO',
        payerState: 'SP',
      };

      expect(() => generator.generate(invalidSegment as unknown as SegmentQ)).toThrow(
        'Batch number is required',
      );
    });

    it('should throw error if occurrenceCode is missing', () => {
      const invalidSegment = {
        bankCode: '341',
        batchNumber: 1,
        recordType: '3',
        sequentialNumber: 1,
        segmentCode: 'Q',
        occurrenceCode: '',
        payerRegistrationType: '1',
        payerTaxId: '12345678901',
        payerName: 'JOAO DA SILVA',
        payerAddress: 'RUA A',
        payerNeighborhood: 'CENTRO',
        payerPostalCode: '12345678',
        payerCity: 'SAO PAULO',
        payerState: 'SP',
      };

      expect(() => generator.generate(invalidSegment as unknown as SegmentQ)).toThrow(
        'Occurrence code is required',
      );
    });

    it('should throw error if payerTaxId is missing', () => {
      const invalidSegment = {
        bankCode: '341',
        batchNumber: 1,
        recordType: '3',
        sequentialNumber: 1,
        segmentCode: 'Q',
        occurrenceCode: '01',
        payerRegistrationType: '1',
        payerTaxId: '',
        payerName: 'JOAO DA SILVA',
        payerAddress: 'RUA A',
        payerNeighborhood: 'CENTRO',
        payerPostalCode: '12345678',
        payerCity: 'SAO PAULO',
        payerState: 'SP',
      };

      expect(() => generator.generate(invalidSegment as unknown as SegmentQ)).toThrow(
        'Payer tax ID is required',
      );
    });

    it('should throw error if recordType is missing', () => {
      const invalidSegment = createMinimalSegmentQ('341', 1, 1);
      invalidSegment.recordType = '';

      expect(() => generator.generate(invalidSegment as unknown as SegmentQ)).toThrow(
        'Record type is required',
      );
    });

    it('should throw error if sequentialNumber is missing', () => {
      const invalidSegment = createMinimalSegmentQ('341', 1, 1);
      invalidSegment.sequentialNumber = undefined as unknown as SegmentQ['sequentialNumber'];

      expect(() => generator.generate(invalidSegment as unknown as SegmentQ)).toThrow(
        'Sequential number is required',
      );
    });

    it('should throw error if segmentCode is missing', () => {
      const invalidSegment = createMinimalSegmentQ('341', 1, 1);
      invalidSegment.segmentCode = '';

      expect(() => generator.generate(invalidSegment as unknown as SegmentQ)).toThrow(
        'Segment code is required',
      );
    });

    it('should throw error if payerRegistrationType is missing', () => {
      const invalidSegment = createMinimalSegmentQ('341', 1, 1);
      invalidSegment.payerRegistrationType = '';

      expect(() => generator.generate(invalidSegment as unknown as SegmentQ)).toThrow(
        'Payer registration type is required',
      );
    });

    it('should throw error if payerName is missing', () => {
      const invalidSegment = createMinimalSegmentQ('341', 1, 1);
      invalidSegment.payerName = '';

      expect(() => generator.generate(invalidSegment as unknown as SegmentQ)).toThrow(
        'Payer name is required',
      );
    });

    it('should throw error if payerAddress is missing', () => {
      const invalidSegment = createMinimalSegmentQ('341', 1, 1);
      invalidSegment.payerAddress = '';

      expect(() => generator.generate(invalidSegment as unknown as SegmentQ)).toThrow(
        'Payer address is required',
      );
    });

    it('should throw error if payerNeighborhood is missing', () => {
      const invalidSegment = createMinimalSegmentQ('341', 1, 1);
      invalidSegment.payerNeighborhood = '';

      expect(() => generator.generate(invalidSegment as unknown as SegmentQ)).toThrow(
        'Payer neighborhood is required',
      );
    });

    it('should throw error if payerPostalCode is missing', () => {
      const invalidSegment = createMinimalSegmentQ('341', 1, 1);
      invalidSegment.payerPostalCode = '';

      expect(() => generator.generate(invalidSegment as unknown as SegmentQ)).toThrow(
        'Payer postal code is required',
      );
    });

    it('should throw error if payerCity is missing', () => {
      const invalidSegment = createMinimalSegmentQ('341', 1, 1);
      invalidSegment.payerCity = '';

      expect(() => generator.generate(invalidSegment as unknown as SegmentQ)).toThrow(
        'Payer city is required',
      );
    });

    it('should throw error if payerState is missing', () => {
      const invalidSegment = createMinimalSegmentQ('341', 1, 1);
      invalidSegment.payerState = '';

      expect(() => generator.generate(invalidSegment as unknown as SegmentQ)).toThrow(
        'Payer state is required',
      );
    });
  });
});

// Helper function
function createMinimalSegmentQ(
  bankCode: string,
  batchNumber: number,
  sequentialNumber: number,
): SegmentQ {
  return {
    bankCode,
    batchNumber,
    recordType: '3',
    sequentialNumber,
    segmentCode: 'Q',
    occurrenceCode: '01',
    payerRegistrationType: '1',
    payerTaxId: '12345678901',
    payerName: 'JOAO DA SILVA',
    payerAddress: 'RUA DAS FLORES 123',
    payerNeighborhood: 'CENTRO',
    payerPostalCode: '01234567',
    payerCity: 'SAO PAULO',
    payerState: 'SP',
  };
}
