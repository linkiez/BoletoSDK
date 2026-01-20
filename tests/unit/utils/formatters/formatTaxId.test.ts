import { formatTaxId } from '@utils/formatters';

describe('formatTaxId', () => {
  describe('CPF formatting', () => {
    it('should format valid 11-digit CPF', () => {
      expect(formatTaxId('12345678901')).toBe('123.456.789-01');
    });

    it('should format CPF with leading zeros', () => {
      expect(formatTaxId('00012345678')).toBe('000.123.456-78');
    });

    it('should return formatted CPF for already formatted input', () => {
      expect(formatTaxId('123.456.789-01')).toBe('123.456.789-01');
    });
  });

  describe('CNPJ formatting', () => {
    it('should format valid 14-digit CNPJ', () => {
      expect(formatTaxId('12345678000195')).toBe('12.345.678/0001-95');
    });

    it('should format CNPJ with leading zeros', () => {
      expect(formatTaxId('00000000000191')).toBe('00.000.000/0001-91');
    });

    it('should return formatted CNPJ for already formatted input', () => {
      expect(formatTaxId('12.345.678/0001-95')).toBe('12.345.678/0001-95');
    });
  });

  describe('edge cases', () => {
    it('should return empty string for empty input', () => {
      expect(formatTaxId('')).toBe('');
    });

    it('should throw error for invalid length', () => {
      expect(() => formatTaxId('123')).toThrow('Invalid tax ID length');
    });

    it('should throw error for invalid characters', () => {
      expect(() => formatTaxId('1234567890a')).toThrow('Tax ID must contain only digits');
    });
  });
});
