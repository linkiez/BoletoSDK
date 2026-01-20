import { padRight } from '@utils/generators';

describe('padRight', () => {
  describe('basic padding', () => {
    it('should pad string to specified length', () => {
      expect(padRight('123', 5)).toBe('12300');
    });

    it('should not pad if already at length', () => {
      expect(padRight('12345', 5)).toBe('12345');
    });

    it('should truncate if longer than length', () => {
      expect(padRight('123456', 5)).toBe('12345');
    });
  });

  describe('custom fill character', () => {
    it('should pad with spaces', () => {
      expect(padRight('ABC', 5, ' ')).toBe('ABC  ');
    });

    it('should pad with custom character', () => {
      expect(padRight('123', 6, 'X')).toBe('123XXX');
    });
  });

  describe('edge cases', () => {
    it('should handle empty string', () => {
      expect(padRight('', 3)).toBe('000');
    });

    it('should handle zero length', () => {
      expect(padRight('123', 0)).toBe('');
    });

    it('should handle negative length as zero', () => {
      expect(padRight('123', -1)).toBe('');
    });
  });

  describe('number conversion', () => {
    it('should convert numbers to strings', () => {
      expect(padRight(123, 5)).toBe('12300');
    });

    it('should handle zero', () => {
      expect(padRight(0, 3)).toBe('000');
    });
  });
});
