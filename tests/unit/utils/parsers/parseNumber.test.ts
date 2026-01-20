import { parseNumber, parseDecimal } from '@utils/parsers';

describe('parseNumber', () => {
  describe('basic parsing', () => {
    it('should parse integer string', () => {
      expect(parseNumber('123')).toBe(123);
    });

    it('should parse with leading zeros', () => {
      expect(parseNumber('00123')).toBe(123);
    });

    it('should parse zero', () => {
      expect(parseNumber('0')).toBe(0);
      expect(parseNumber('000')).toBe(0);
    });
  });

  describe('edge cases', () => {
    it('should return 0 for empty string', () => {
      expect(parseNumber('')).toBe(0);
    });

    it('should throw on non-numeric characters', () => {
      expect(() => parseNumber('12a3')).toThrow('Invalid number format');
    });

    it('should handle very large numbers', () => {
      expect(parseNumber('999999999999')).toBe(999999999999);
    });
  });
});

describe('parseDecimal', () => {
  describe('basic parsing', () => {
    it('should parse CNAB format (implied 2 decimals)', () => {
      expect(parseDecimal('12345', 2)).toBe(123.45);
    });

    it('should parse with implied decimals', () => {
      expect(parseDecimal('100', 2)).toBe(1.00);
      expect(parseDecimal('1000', 2)).toBe(10.00);
    });

    it('should handle different decimal places', () => {
      expect(parseDecimal('12345', 3)).toBe(12.345);
      expect(parseDecimal('12345', 1)).toBe(1234.5);
    });
  });

  describe('edge cases', () => {
    it('should return 0 for empty string', () => {
      expect(parseDecimal('', 2)).toBe(0);
    });

    it('should handle zero', () => {
      expect(parseDecimal('0', 2)).toBe(0);
      expect(parseDecimal('000', 2)).toBe(0);
    });

    it('should handle leading zeros', () => {
      expect(parseDecimal('00123', 2)).toBe(1.23);
    });
  });
});
