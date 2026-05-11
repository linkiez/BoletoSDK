import {
  buildBradescoOurNumber,
  calculateBradescoOurNumberCheckDigit,
  formatBradescoOurNumber,
} from '../../../../src/adapters/bradesco/BradescoOurNumberCalculator';

describe('BradescoOurNumberCalculator', () => {
  describe('calculateBradescoOurNumberCheckDigit', () => {
    it('should calculate check digit for known values', () => {
      expect(calculateBradescoOurNumberCheckDigit('12345678901')).toBe('8');
      expect(calculateBradescoOurNumberCheckDigit('1234567890')).toBe('3');
    });

    it('should return P when modulo-11 remainder is 1', () => {
      expect(calculateBradescoOurNumberCheckDigit('00000000006')).toBe('P');
    });

    it('should return zero when modulo-11 remainder is 0', () => {
      expect(calculateBradescoOurNumberCheckDigit('00000000000')).toBe('0');
    });

    it('should throw when base number is empty', () => {
      expect(() => calculateBradescoOurNumberCheckDigit('')).toThrow('Base number is required');
    });

    it('should throw when base number has non-numeric chars', () => {
      expect(() => calculateBradescoOurNumberCheckDigit('12A456')).toThrow(
        'Base number must contain only digits',
      );
    });
  });

  describe('formatBradescoOurNumber', () => {
    it('should append check digit using dash format', () => {
      expect(formatBradescoOurNumber('12345678901')).toBe('12345678901-8');
    });
  });

  describe('buildBradescoOurNumber', () => {
    it('should return a detailed Bradesco our number payload', () => {
      expect(buildBradescoOurNumber('12345678901')).toEqual({
        baseNumber: '12345678901',
        checkDigit: '8',
        formatted: '12345678901-8',
      });
    });
  });
});
