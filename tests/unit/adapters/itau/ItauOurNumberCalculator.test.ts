import {
  calculateItauOurNumberCheckDigit,
  formatItauOurNumber,
} from '../../../../src/adapters/itau/ItauOurNumberCalculator';

describe('ItauOurNumberCalculator', () => {
  describe('calculateItauOurNumberCheckDigit', () => {
    it('should calculate modulo 10 check digit for numeric base number', () => {
      expect(calculateItauOurNumberCheckDigit('12345678')).toBe(2);
    });

    it('should return zero for all-zero base number', () => {
      expect(calculateItauOurNumberCheckDigit('00000000')).toBe(0);
    });

    it('should throw when base number is empty', () => {
      expect(() => calculateItauOurNumberCheckDigit('')).toThrow('Base number is required');
    });

    it('should throw when base number has non-numeric characters', () => {
      expect(() => calculateItauOurNumberCheckDigit('12AB5678')).toThrow(
        'Base number must contain only digits',
      );
    });
  });

  describe('formatItauOurNumber', () => {
    it('should append check digit to base number', () => {
      expect(formatItauOurNumber('12345678')).toBe('123456782');
    });
  });
});
