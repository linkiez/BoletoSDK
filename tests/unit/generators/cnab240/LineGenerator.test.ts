import {
  buildLine,
  formatDateField,
  formatDecimalField,
  formatField,
  formatNumericField,
} from '../../../../src/generators/cnab240/LineGenerator';

describe('CNAB240 LineGenerator', () => {
  describe('formatField', () => {
    it('should format text field with exact length', () => {
      const result = formatField('EMPRESA TESTE', 1, 30, 'text');
      expect(result).toBe('EMPRESA TESTE                 ');
      expect(result.length).toBe(30);
    });

    it('should truncate text if longer than field size', () => {
      const result = formatField('EMPRESA COM NOME MUITO LONGO DEMAIS', 1, 20, 'text');
      expect(result).toBe('EMPRESA COM NOME MUI');
      expect(result.length).toBe(20);
    });

    it('should pad numeric field with zeros on left', () => {
      const result = formatField('123', 1, 10, 'numeric');
      expect(result).toBe('0000000123');
      expect(result.length).toBe(10);
    });

    it('should handle empty text field', () => {
      const result = formatField('', 1, 15, 'text');
      expect(result).toBe('               ');
      expect(result.length).toBe(15);
    });

    it('should handle empty numeric field', () => {
      const result = formatField('', 1, 8, 'numeric');
      expect(result).toBe('00000000');
      expect(result.length).toBe(8);
    });

    it('should convert text to uppercase', () => {
      const result = formatField('empresa ltda', 1, 20, 'text');
      expect(result).toBe('EMPRESA LTDA        ');
    });
  });

  describe('formatNumericField', () => {
    it('should format integer with leading zeros', () => {
      const result = formatNumericField(123, 1, 10);
      expect(result).toBe('0000000123');
      expect(result.length).toBe(10);
    });

    it('should handle zero', () => {
      const result = formatNumericField(0, 1, 8);
      expect(result).toBe('00000000');
    });

    it('should handle large numbers', () => {
      const result = formatNumericField(999999, 1, 10);
      expect(result).toBe('0000999999');
    });

    it('should truncate if number is too large', () => {
      const result = formatNumericField(12345678901, 1, 8);
      expect(result).toBe('45678901'); // Last 8 digits
    });
  });

  describe('formatDecimalField', () => {
    it('should format decimal with 2 implied decimals', () => {
      const result = formatDecimalField(150.5, 1, 15, 2);
      expect(result).toBe('000000000015050');
      expect(result.length).toBe(15);
    });

    it('should format decimal with different decimal places', () => {
      const result = formatDecimalField(10.5, 1, 10, 5);
      expect(result).toBe('0001050000'); // 10.50000 = 1050000
    });

    it('should handle zero decimal', () => {
      const result = formatDecimalField(0, 1, 12, 2);
      expect(result).toBe('000000000000');
    });

    it('should round decimal values', () => {
      const result = formatDecimalField(10.556, 1, 10, 2);
      expect(result).toBe('0000001056'); // 10.556 rounded to 10.56 = 1056
    });

    it('should handle integer as decimal', () => {
      const result = formatDecimalField(100, 1, 15, 2);
      expect(result).toBe('000000000010000');
    });
  });

  describe('formatDateField', () => {
    it('should format date in DDMMYYYY format', () => {
      const date = new Date(2026, 0, 21); // January 21, 2026
      const result = formatDateField(date, 1, 8);
      expect(result).toBe('21012026');
      expect(result.length).toBe(8);
    });

    it('should handle single-digit day and month', () => {
      const date = new Date(2026, 2, 5); // March 5, 2026
      const result = formatDateField(date, 1, 8);
      expect(result).toBe('05032026');
    });

    it('should handle undefined date as zeros', () => {
      const result = formatDateField(undefined, 1, 8);
      expect(result).toBe('00000000');
    });

    it('should handle end of year date', () => {
      const date = new Date(2025, 11, 31); // December 31, 2025
      const result = formatDateField(date, 1, 8);
      expect(result).toBe('31122025');
    });
  });

  describe('buildLine', () => {
    it('should build 240-character line from field map', () => {
      const fields = new Map<string, string>([
        ['bankCode', '341'],
        ['batchNumber', '0000'],
        ['recordType', '0'],
        ['spacing', ' '.repeat(232)],
      ]);

      const line = buildLine(fields);
      expect(line.length).toBe(240);
      expect(line.substring(0, 3)).toBe('341');
      expect(line.substring(3, 7)).toBe('0000');
      expect(line.substring(7, 8)).toBe('0');
    });

    it('should build line with all fields in order', () => {
      const fields = new Map<string, string>([
        ['field1', 'ABC'],
        ['field2', '12345'],
        ['field3', 'XYZ'],
      ]);

      const line = buildLine(fields);
      expect(line).toBe('ABC12345XYZ');
    });

    it('should maintain insertion order', () => {
      const fields = new Map<string, string>([
        ['first', '111'],
        ['second', '222'],
        ['third', '333'],
      ]);

      const line = buildLine(fields);
      expect(line).toBe('111222333');
    });

    it('should handle empty fields map', () => {
      const fields = new Map<string, string>();
      const line = buildLine(fields);
      expect(line).toBe('');
    });
  });

  describe('Edge Cases', () => {
    it('should handle special characters in text fields', () => {
      const result = formatField('João & Cia', 1, 15, 'text');
      expect(result).toBe('JOÃO & CIA     ');
    });

    it('should handle negative numbers as positive', () => {
      const result = formatNumericField(-123, 1, 8);
      expect(result).toBe('00000123');
    });

    it('should handle very small decimals', () => {
      const result = formatDecimalField(0.01, 1, 10, 2);
      expect(result).toBe('0000000001');
    });

    it('should handle maximum field sizes', () => {
      const result = formatField('A'.repeat(300), 1, 100, 'text');
      expect(result.length).toBe(100);
    });
  });
});
