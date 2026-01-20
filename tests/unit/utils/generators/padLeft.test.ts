import { padLeft } from '@utils/generators';

describe('padLeft', () => {
  describe('basic padding', () => {
    it('should pad string to specified length', () => {
      expect(padLeft('123', 5)).toBe('00123');
    });

    it('should not pad if already at length', () => {
      expect(padLeft('12345', 5)).toBe('12345');
    });

    it('should truncate if longer than length', () => {
      expect(padLeft('123456', 5)).toBe('23456');
    });
  });

  describe('custom fill character', () => {
    it('should pad with spaces', () => {
      expect(padLeft('123', 5, ' ')).toBe('  123');
    });

    it('should pad with custom character', () => {
      expect(padLeft('ABC', 6, 'X')).toBe('XXXABC');
    });
  });

  describe('edge cases', () => {
    it('should handle empty string', () => {
      expect(padLeft('', 3)).toBe('000');
    });

    it('should handle zero length', () => {
      expect(padLeft('123', 0)).toBe('');
    });

    it('should handle negative length as zero', () => {
      expect(padLeft('123', -1)).toBe('');
    });
  });

  describe('number conversion', () => {
    it('should convert numbers to strings', () => {
      expect(padLeft(123, 5)).toBe('00123');
    });

    it('should handle zero', () => {
      expect(padLeft(0, 3)).toBe('000');
    });
  });
});
