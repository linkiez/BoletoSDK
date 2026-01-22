import { BatchHeaderGenerator } from '../../../../src/generators/cnab240/BatchHeaderGenerator';
import * as LineGenerator from '../../../../src/generators/cnab240/LineGenerator';
import { BatchHeader } from '../../../../src/types';

describe('CNAB240 BatchHeaderGenerator', () => {
  let generator: BatchHeaderGenerator;

  beforeEach(() => {
    generator = new BatchHeaderGenerator();
  });

  describe('generate', () => {
    it('should generate valid batch header line with 240 characters', () => {
      const header: BatchHeader = {
        bankCode: '341',
        batchNumber: 1,
        recordType: '1',
        operationType: 'C',
        serviceType: '01',
        companyRegistrationType: '2',
        companyRegistrationNumber: '12345678000195',
        agreementCode: 'CONV123',
        agency: '1234',
        agencyDigit: '5',
        account: '123456',
        accountDigit: '7',
        fullAccountDigit: '8',
        companyName: 'EMPRESA TESTE LTDA',
        message1: 'MENSAGEM 1',
        message2: 'MENSAGEM 2',
        remittanceReturnNumber: 1,
        recordingDate: new Date('2026-01-21'),
        creditDate: new Date('2026-01-22'),
      };

      const result = generator.generate(header);

      expect(result).toHaveLength(240);
      expect(result.substring(0, 3)).toBe('341'); // Bank code
      expect(result.substring(3, 7)).toBe('0001'); // Batch number (padded)
      expect(result.substring(7, 8)).toBe('1'); // Record type
      expect(result.substring(8, 9)).toBe('C'); // Operation type
      expect(result.substring(9, 11)).toBe('01'); // Service type
      expect(result.substring(17, 18)).toBe('2'); // Company registration type
    });

    it('should handle different operation types', () => {
      const header = createMinimalBatchHeader('341', 1);

      // Test operation type C (Credit/Remittance)
      header.operationType = 'C';
      let result = generator.generate(header);
      expect(result.substring(8, 9)).toBe('C');

      // Test operation type D (Debit/Return)
      header.operationType = 'D';
      result = generator.generate(header);
      expect(result.substring(8, 9)).toBe('D');
    });

    it('should handle different service types', () => {
      const header = createMinimalBatchHeader('001', 2);

      // Service type 01 - Cobrança
      header.serviceType = '01';
      let result = generator.generate(header);
      expect(result.substring(9, 11)).toBe('01');

      // Service type 03 - Bloqueto Eletrônico
      header.serviceType = '03';
      result = generator.generate(header);
      expect(result.substring(9, 11)).toBe('03');
    });

    it('should pad company name to 30 characters', () => {
      const header = createMinimalBatchHeader('237', 1);
      header.companyName = 'EMPRESA';

      const result = generator.generate(header);

      // Company name at positions 73-102 (30 chars)
      const companyName = result.substring(72, 102);
      expect(companyName).toHaveLength(30);
      expect(companyName).toBe('EMPRESA                       ');
    });

    it('should truncate long company name to 30 characters', () => {
      const header = createMinimalBatchHeader('033', 3);
      header.companyName = 'NOME DE EMPRESA MUITO LONGO QUE DEVE SER TRUNCADO';

      const result = generator.generate(header);

      const companyName = result.substring(72, 102);
      expect(companyName).toHaveLength(30);
      expect(companyName).toBe('NOME DE EMPRESA MUITO LONGO QU');
    });

    it('should handle optional fields as empty/spaces', () => {
      const header: BatchHeader = {
        bankCode: '104',
        batchNumber: 1,
        recordType: '1',
        operationType: 'C',
        serviceType: '01',
        companyRegistrationType: '1',
        companyRegistrationNumber: '12345678901',
        agency: '1234',
        account: '123456',
        accountDigit: '7',
        companyName: 'MIN COMPANY',
      };

      const result = generator.generate(header);

      expect(result).toHaveLength(240);
      // Should not throw error for missing optional fields
    });

    it('should handle Santander bank (033) correctly', () => {
      const header = createMinimalBatchHeader('033', 2);
      header.companyName = 'SANTANDER EMPRESA';
      header.serviceType = '01';
      header.operationType = 'C';

      const result = generator.generate(header);

      expect(result.substring(0, 3)).toBe('033');
      expect(result.substring(3, 7)).toBe('0002');
      expect(result).toHaveLength(240);
    });

    it('should validate required fields', () => {
      const invalidHeader = {
        bankCode: '',
        batchNumber: 1,
        recordType: '1',
        operationType: 'C',
        serviceType: '01',
      };

      expect(() => generator.generate(invalidHeader as BatchHeader)).toThrow(
        'Bank code is required',
      );
    });

    it('should throw when generated line length is invalid', () => {
      const header = createMinimalBatchHeader('341', 1);
      const buildLineSpy = jest.spyOn(LineGenerator, 'buildLine').mockReturnValue('INVALID');

      expect(() => generator.generate(header)).toThrow(
        'Invalid batch header length: expected 240, got 7',
      );

      buildLineSpy.mockRestore();
    });

    it('should format dates as DDMMYYYY', () => {
      const header = createMinimalBatchHeader('341', 1);
      header.recordingDate = new Date('2026-01-21');
      header.creditDate = new Date('2026-12-31');

      const result = generator.generate(header);

      // Recording date at positions 191-198
      expect(result.substring(190, 198)).toBe('21012026');
      // Credit date at positions 199-206
      expect(result.substring(198, 206)).toBe('31122026');
    });

    it('should handle batch numbers correctly', () => {
      const header1 = createMinimalBatchHeader('001', 1);
      const header2 = createMinimalBatchHeader('001', 42);
      const header3 = createMinimalBatchHeader('001', 9999);

      const result1 = generator.generate(header1);
      const result2 = generator.generate(header2);
      const result3 = generator.generate(header3);

      expect(result1.substring(3, 7)).toBe('0001');
      expect(result2.substring(3, 7)).toBe('0042');
      expect(result3.substring(3, 7)).toBe('9999');
    });
  });

  describe('Field positioning', () => {
    it('should place bank code at positions 1-3', () => {
      const header = createMinimalBatchHeader('999', 1);
      const result = generator.generate(header);
      expect(result.substring(0, 3)).toBe('999');
    });

    it('should place batch number at positions 4-7', () => {
      const header = createMinimalBatchHeader('001', 123);
      const result = generator.generate(header);
      expect(result.substring(3, 7)).toBe('0123');
    });

    it('should place record type at position 8', () => {
      const header = createMinimalBatchHeader('001', 1);
      const result = generator.generate(header);
      expect(result.substring(7, 8)).toBe('1'); // Always 1 for batch header
    });

    it('should place operation type at position 9', () => {
      const header = createMinimalBatchHeader('001', 1);
      header.operationType = 'C';
      const result = generator.generate(header);
      expect(result.substring(8, 9)).toBe('C');
    });

    it('should place service type at positions 10-11', () => {
      const header = createMinimalBatchHeader('001', 1);
      header.serviceType = '03';
      const result = generator.generate(header);
      expect(result.substring(9, 11)).toBe('03');
    });

    it('should place company registration type at position 18', () => {
      const header = createMinimalBatchHeader('001', 1);
      header.companyRegistrationType = '2';
      const result = generator.generate(header);
      expect(result.substring(17, 18)).toBe('2');
    });

    it('should place company registration number at positions 19-32', () => {
      const header = createMinimalBatchHeader('001', 1);
      header.companyRegistrationNumber = '12345678000195';
      const result = generator.generate(header);
      expect(result.substring(18, 32)).toBe('12345678000195');
    });
  });

  describe('Validation', () => {
    it('should throw error if recordType is missing', () => {
      const invalidHeader = createMinimalBatchHeader('341', 1);
      invalidHeader.recordType = '';

      expect(() => generator.generate(invalidHeader)).toThrow('Record type is required');
    });

    it('should throw error if operationType is missing', () => {
      const invalidHeader = createMinimalBatchHeader('341', 1);
      invalidHeader.operationType = '';

      expect(() => generator.generate(invalidHeader)).toThrow('Operation type is required');
    });

    it('should throw error if serviceType is missing', () => {
      const invalidHeader = createMinimalBatchHeader('341', 1);
      invalidHeader.serviceType = '';

      expect(() => generator.generate(invalidHeader)).toThrow('Service type is required');
    });

    it('should throw error if companyRegistrationType is missing', () => {
      const invalidHeader = createMinimalBatchHeader('341', 1);
      invalidHeader.companyRegistrationType = '';

      expect(() => generator.generate(invalidHeader)).toThrow(
        'Company registration type is required',
      );
    });

    it('should throw error if companyRegistrationNumber is missing', () => {
      const invalidHeader = createMinimalBatchHeader('341', 1);
      invalidHeader.companyRegistrationNumber = '';

      expect(() => generator.generate(invalidHeader)).toThrow(
        'Company registration number is required',
      );
    });

    it('should throw error if agency is missing', () => {
      const invalidHeader = createMinimalBatchHeader('341', 1);
      invalidHeader.agency = '';

      expect(() => generator.generate(invalidHeader)).toThrow('Agency is required');
    });

    it('should throw error if account is missing', () => {
      const invalidHeader = createMinimalBatchHeader('341', 1);
      invalidHeader.account = '';

      expect(() => generator.generate(invalidHeader)).toThrow('Account is required');
    });

    it('should throw error if accountDigit is missing', () => {
      const invalidHeader = createMinimalBatchHeader('341', 1);
      invalidHeader.accountDigit = '';

      expect(() => generator.generate(invalidHeader)).toThrow('Account digit is required');
    });

    it('should throw error if companyName is missing', () => {
      const invalidHeader = createMinimalBatchHeader('341', 1);
      invalidHeader.companyName = '';

      expect(() => generator.generate(invalidHeader)).toThrow('Company name is required');
    });
  });
});

// Helper function
function createMinimalBatchHeader(bankCode: string, batchNumber: number): BatchHeader {
  return {
    bankCode,
    batchNumber,
    recordType: '1',
    operationType: 'C',
    serviceType: '01',
    companyRegistrationType: '2',
    companyRegistrationNumber: '12345678000195',
    agency: '1234',
    account: '123456',
    accountDigit: '7',
    companyName: 'EMPRESA TESTE LTDA',
  };
}
