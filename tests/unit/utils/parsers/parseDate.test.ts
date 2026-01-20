import { parseDate, parseDateCnab } from '@utils/parsers';

describe('parseDate', () => {
  describe('DDMMYYYY format', () => {
    it('should parse valid date', () => {
      const date = parseDate('31122025');
      expect(date.getDate()).toBe(31);
      expect(date.getMonth()).toBe(11); // December (0-indexed)
      expect(date.getFullYear()).toBe(2025);
    });

    it('should parse with leading zeros', () => {
      const date = parseDate('01012026');
      expect(date.getDate()).toBe(1);
      expect(date.getMonth()).toBe(0);
      expect(date.getFullYear()).toBe(2026);
    });
  });

  describe('edge cases', () => {
    it('should throw on invalid length', () => {
      expect(() => parseDate('123')).toThrow('Invalid date format');
    });

    it('should throw on invalid date', () => {
      expect(() => parseDate('32012026')).toThrow('Invalid date');
    });

    it('should throw on invalid month', () => {
      expect(() => parseDate('01132026')).toThrow('Invalid date');
    });

    it('should throw on non-numeric', () => {
      expect(() => parseDate('abc12026')).toThrow('Invalid date format');
    });
  });
});

describe('parseDateCnab', () => {
  describe('CNAB date format (days since epoch)', () => {
    it('should parse days since 1997-10-07', () => {
      const date = parseDateCnab(1000);
      expect(date.getFullYear()).toBe(2000);
    });

    it('should handle zero (epoch date)', () => {
      const date = parseDateCnab(0);
      expect(date.getDate()).toBe(7);
      expect(date.getMonth()).toBe(9); // October
      expect(date.getFullYear()).toBe(1997);
    });

    it('should handle negative values as zero', () => {
      const date = parseDateCnab(-10);
      expect(date.getFullYear()).toBe(1997);
    });
  });

  describe('string input', () => {
    it('should parse string number', () => {
      const date = parseDateCnab('1000');
      expect(date.getFullYear()).toBe(2000);
    });

    it('should handle string with leading zeros', () => {
      const date = parseDateCnab('0001000');
      expect(date.getFullYear()).toBe(2000);
    });
  });
});
