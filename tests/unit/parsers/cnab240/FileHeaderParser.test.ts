import { ParseError } from '../../../../src/errors';
import { parseFileHeader } from '../../../../src/parsers/cnab240/FileHeaderParser';

describe('CNAB240 FileHeaderParser', () => {
  // Helper to create a valid 240-character file header line
  const createFileHeaderLine = (overrides: Record<number, string> = {}): string => {
    const defaults: Record<number, string> = {
      1: '341', // Bank code (Itaú)
      4: '0000', // Batch number (always 0000 for file header)
      8: '0', // Record type (0 = file header)
      18: '2', // Company registration type (2 = CNPJ)
      19: '12345678000195', // Company CNPJ
      33: '00000000000000000000', // Agreement code
      53: '04897', // Agency
      59: '000000017450', // Account
      71: '6', // Account digit
      73: 'JCM INDUSTRIA E COMERCIO LTDA', // Company name
      103: 'BANCO ITAU SA', // Bank name
      143: '1', // File code (1 = Remessa)
      144: '21012026', // Generation date (21/01/2026)
      152: '143000', // Generation time (14:30:00)
      158: '000001', // Sequential number
      164: '103', // Layout version
    };

    const merged = { ...defaults, ...overrides };
    const line = new Array(240).fill(' ');

    Object.entries(merged).forEach(([pos, value]) => {
      const startPos = Number.parseInt(pos, 10) - 1;
      for (let i = 0; i < value.length; i++) {
        line[startPos + i] = value[i];
      }
    });

    return line.join('');
  };

  describe('Valid File Header Parsing', () => {
    it('should parse complete file header', () => {
      const line = createFileHeaderLine();
      const header = parseFileHeader(line);

      expect(header.bankCode).toBe('341');
      expect(header.batchNumber).toBe('0000');
      expect(header.recordType).toBe('0');
      expect(header.companyRegistrationType).toBe('2');
      expect(header.companyRegistrationNumber).toBe('12345678000195');
      expect(header.agency).toBe('04897');
      expect(header.account).toBe('000000017450');
      expect(header.accountDigit).toBe('6');
      expect(header.companyName).toBe('JCM INDUSTRIA E COMERCIO LTDA');
      expect(header.bankName).toBe('BANCO ITAU SA');
      expect(header.fileCode).toBe('1');
      expect(header.sequentialNumber).toBe(1);
      expect(header.layoutVersion).toBe('103');
    });

    it('should parse generation date correctly', () => {
      const line = createFileHeaderLine({ 144: '21012026' });
      const header = parseFileHeader(line);

      expect(header.generationDate).toBeInstanceOf(Date);
      expect(header.generationDate.getDate()).toBe(21);
      expect(header.generationDate.getMonth()).toBe(0); // January
      expect(header.generationDate.getFullYear()).toBe(2026);
    });

    it('should parse different bank codes', () => {
      const banks = [
        { code: '001', name: 'Banco do Brasil' },
        { code: '237', name: 'Bradesco' },
        { code: '341', name: 'Itaú' },
        { code: '033', name: 'Santander' },
        { code: '104', name: 'Caixa' },
      ];

      banks.forEach((bank) => {
        const line = createFileHeaderLine({ 1: bank.code });
        const header = parseFileHeader(line);
        expect(header.bankCode).toBe(bank.code);
      });
    });

    it('should identify Remessa file (fileCode = 1)', () => {
      const line = createFileHeaderLine({ 143: '1' });
      const header = parseFileHeader(line);
      expect(header.fileCode).toBe('1');
    });

    it('should identify Retorno file (fileCode = 2)', () => {
      const line = createFileHeaderLine({ 143: '2' });
      const header = parseFileHeader(line);
      expect(header.fileCode).toBe('2');
    });

    it('should parse optional fields', () => {
      const line = createFileHeaderLine({
        58: 'X', // Agency digit
        72: 'Y', // Full account digit
        152: '093015', // Generation time
      });
      const header = parseFileHeader(line);

      expect(header.agencyDigit).toBe('X');
      expect(header.fullAccountDigit).toBe('Y');
      expect(header.generationTime).toBe('093015');
    });

    it('should handle different sequential numbers', () => {
      const sequentialNumbers = [1, 10, 100, 999, 999999];

      sequentialNumbers.forEach((num) => {
        const line = createFileHeaderLine({
          158: num.toString().padStart(6, '0'),
        });
        const header = parseFileHeader(line);
        expect(header.sequentialNumber).toBe(num);
      });
    });
  });

  describe('Error Handling', () => {
    it('should throw ParseError for invalid record type', () => {
      const line = createFileHeaderLine({ 8: '1' }); // Wrong record type
      expect(() => parseFileHeader(line)).toThrow(ParseError);
      expect(() => parseFileHeader(line)).toThrow(/Invalid record type/);
    });

    it('should throw ParseError for invalid line length', () => {
      const shortLine = 'SHORT LINE';
      expect(() => parseFileHeader(shortLine)).toThrow(ParseError);
      expect(() => parseFileHeader(shortLine)).toThrow(/Invalid CNAB240 line length/);
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty optional fields', () => {
      const line = createFileHeaderLine({
        58: ' ', // Empty agency digit
        72: ' ', // Empty full account digit
        152: '      ', // Empty generation time
      });
      const header = parseFileHeader(line);

      expect(header.agencyDigit).toBeUndefined();
      expect(header.fullAccountDigit).toBeUndefined();
      expect(header.generationTime).toBeUndefined();
    });

    it('should trim whitespace from text fields', () => {
      const line = createFileHeaderLine({
        73: '  COMPANY NAME  ',
        103: '  BANK NAME  ',
      });
      const header = parseFileHeader(line);

      expect(header.companyName).toBe('COMPANY NAME');
      expect(header.bankName).toBe('BANK NAME');
    });

    it('should handle zero sequential number', () => {
      const line = createFileHeaderLine({ 158: '000000' });
      const header = parseFileHeader(line);
      expect(header.sequentialNumber).toBe(0);
    });
  });

  describe('Field Positions Validation', () => {
    it('should extract bank code from positions 1-3', () => {
      const line = createFileHeaderLine({ 1: 'ABC' });
      const header = parseFileHeader(line);
      expect(header.bankCode).toBe('ABC');
    });

    it('should extract batch number from positions 4-7', () => {
      const line = createFileHeaderLine({ 4: '0000' });
      const header = parseFileHeader(line);
      expect(header.batchNumber).toBe('0000');
    });

    it('should extract record type from position 8', () => {
      const line = createFileHeaderLine({ 8: '0' });
      const header = parseFileHeader(line);
      expect(header.recordType).toBe('0');
    });

    it('should extract layout version from positions 164-166', () => {
      const line = createFileHeaderLine({ 164: '087' });
      const header = parseFileHeader(line);
      expect(header.layoutVersion).toBe('087');
    });
  });
});
