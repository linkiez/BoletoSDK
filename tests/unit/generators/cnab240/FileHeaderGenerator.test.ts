import { FileHeaderGenerator } from '../../../../src/generators/cnab240/FileHeaderGenerator';
import { FileHeader } from '../../../../src/types';

describe('CNAB240 FileHeaderGenerator', () => {
  let generator: FileHeaderGenerator;

  beforeEach(() => {
    generator = new FileHeaderGenerator();
  });

  describe('generate', () => {
    it('should generate valid file header line with 240 characters', () => {
      const header: FileHeader = {
        bankCode: '341',
        batchNumber: '0000',
        recordType: '0',
        companyRegistrationType: '2',
        companyRegistrationNumber: '12345678901234',
        agreementCode: '123456',
        agency: '1234',
        agencyDigit: '5',
        account: '12345',
        accountDigit: '6',
        companyName: 'EMPRESA TESTE LTDA',
        bankName: 'BANCO ITAU SA',
        fileCode: '1',
        generationDate: new Date(2026, 0, 21), // January 21, 2026
        generationTime: '102030',
        sequentialNumber: 1,
        layoutVersion: '103',
      };

      const result = generator.generate(header);

      expect(result).toHaveLength(240);
      expect(result.substring(0, 3)).toBe('341'); // Bank code
      expect(result.substring(3, 7)).toBe('0000'); // Batch number
      expect(result.substring(7, 8)).toBe('0'); // Record type
      expect(result.substring(17, 18)).toBe('2'); // Company type
      expect(result.substring(18, 32)).toBe('12345678901234'); // Company registration
      expect(result.substring(52, 57)).toBe('01234'); // Agency
      expect(result.substring(57, 58)).toBe('5'); // Agency digit
      expect(result.substring(58, 70)).toBe('000000012345'); // Account
      expect(result.substring(70, 71)).toBe('6'); // Account digit
      expect(result.substring(72, 102)).toBe('EMPRESA TESTE LTDA            '); // Company name (30 chars)
      expect(result.substring(102, 132)).toBe('BANCO ITAU SA                 '); // Bank name (30 chars)
      expect(result.substring(142, 143)).toBe('1'); // File code
      expect(result.substring(143, 151)).toBe('21012026'); // Generation date
      expect(result.substring(151, 157)).toBe('102030'); // Generation time
      expect(result.substring(157, 163)).toBe('000001'); // Sequential number
      expect(result.substring(163, 166)).toBe('103'); // Layout version
    });

    it('should pad and truncate fields correctly', () => {
      const header: FileHeader = {
        bankCode: '001',
        batchNumber: '0000',
        recordType: '0',
        companyRegistrationType: '1',
        companyRegistrationNumber: '00000000000191',
        agreementCode: '1234567890',
        agency: '999',
        agencyDigit: '',
        account: '9999999999999',
        accountDigit: '0',
        companyName: 'NOME DE EMPRESA MUITO LONGO QUE DEVE SER TRUNCADO PARA CABER',
        bankName: 'BANCO DO BRASIL',
        fileCode: '2',
        generationDate: new Date(2026, 11, 31),
        generationTime: '235959',
        sequentialNumber: 999999,
        layoutVersion: '080',
      };

      const result = generator.generate(header);

      expect(result).toHaveLength(240);
      expect(result.substring(0, 3)).toBe('001'); // Banco do Brasil
      expect(result.substring(52, 57)).toBe('00999'); // Agency padded
      expect(result.substring(72, 102)).toBe('NOME DE EMPRESA MUITO LONGO QU'); // Company name truncated to 30
      expect(result.substring(143, 151)).toBe('31122026'); // December 31, 2026
      expect(result.substring(151, 157)).toBe('235959'); // Time
      expect(result.substring(157, 163)).toBe('999999'); // Sequential
    });

    it('should handle empty/undefined optional fields', () => {
      const header: FileHeader = {
        bankCode: '237',
        batchNumber: '0000',
        recordType: '0',
        companyRegistrationType: '2',
        companyRegistrationNumber: '12345678000199',
        agreementCode: '999',
        agency: '1',
        agencyDigit: '',
        account: '1',
        accountDigit: '',
        companyName: 'MIN',
        bankName: 'BRADESCO',
        fileCode: '1',
        generationDate: new Date(2026, 0, 1),
        generationTime: '000000',
        sequentialNumber: 1,
        layoutVersion: '100',
      };

      const result = generator.generate(header);

      expect(result).toHaveLength(240);
      expect(result.substring(52, 57)).toBe('00001'); // Agency = '1' padded to 5
      expect(result.substring(57, 58)).toBe(' '); // Agency digit empty = space
      expect(result.substring(58, 70)).toBe('000000000001'); // Account = '1' padded to 12
      expect(result.substring(70, 71)).toBe(' '); // Account digit empty = space
      expect(result.substring(72, 102)).toBe('MIN                           '); // Company name padded (30 chars)
    });

    it('should handle Santander bank (033)', () => {
      const header: FileHeader = {
        bankCode: '033',
        batchNumber: '0000',
        recordType: '0',
        companyRegistrationType: '2',
        companyRegistrationNumber: '11222333000181',
        agreementCode: '0123456789',
        agency: '3456',
        agencyDigit: '0',
        account: '123456789',
        accountDigit: '8',
        companyName: 'SANTANDER EMPRESA',
        bankName: 'BANCO SANTANDER BRASIL SA',
        fileCode: '1',
        generationDate: new Date(2026, 5, 15), // June 15, 2026
        generationTime: '143000',
        sequentialNumber: 42,
        layoutVersion: '040',
      };

      const result = generator.generate(header);

      expect(result).toHaveLength(240);
      expect(result.substring(0, 3)).toBe('033'); // Santander
      expect(result.substring(52, 57)).toBe('03456'); // Agency
      expect(result.substring(58, 70)).toBe('000123456789'); // Account
      expect(result.substring(72, 102)).toBe('SANTANDER EMPRESA             '); // Company name (30 chars)
      expect(result.substring(143, 151)).toBe('15062026'); // June 15, 2026
      expect(result.substring(157, 163)).toBe('000042'); // Sequential
    });

    it('should validate required fields', () => {
      const invalidHeader = {
        bankCode: '',
        batchNumber: '0000',
        recordType: '0',
        companyRegistrationType: '2',
        companyRegistrationNumber: '',
        agreementCode: '',
        agency: '',
        agencyDigit: '',
        account: '',
        accountDigit: '',
        companyName: '',
        bankName: '',
        fileCode: '1',
        generationDate: new Date(),
        generationTime: '',
        sequentialNumber: 0,
        layoutVersion: '',
      };

      expect(() => generator.generate(invalidHeader as FileHeader)).toThrow();
    });
  });

  describe('Field positioning', () => {
    it('should place bank code at positions 1-3', () => {
      const header = createMinimalHeader('999');
      const result = generator.generate(header);
      expect(result.substring(0, 3)).toBe('999');
    });

    it('should place batch number at positions 4-7', () => {
      const header = createMinimalHeader('001');
      const result = generator.generate(header);
      expect(result.substring(3, 7)).toBe('0000'); // Always 0000 for file header
    });

    it('should place record type at position 8', () => {
      const header = createMinimalHeader('001');
      const result = generator.generate(header);
      expect(result.substring(7, 8)).toBe('0'); // Always 0 for file header
    });
  });
});

// Helper function
function createMinimalHeader(bankCode: string): FileHeader {
  return {
    bankCode,
    batchNumber: '0000',
    recordType: '0',
    companyRegistrationType: '2',
    companyRegistrationNumber: '12345678901234',
    agreementCode: '123456',
    agency: '1234',
    agencyDigit: '5',
    account: '12345',
    accountDigit: '6',
    companyName: 'EMPRESA TESTE',
    bankName: 'BANCO TESTE',
    fileCode: '1',
    generationDate: new Date(2026, 0, 21),
    generationTime: '120000',
    sequentialNumber: 1,
    layoutVersion: '103',
  };
}
