import { formatMoney } from '@utils/formatters';

describe('formatMoney', () => {
  describe('basic formatting', () => {
    it('should format integer values', () => {
      expect(formatMoney(100)).toBe('R$ 100,00');
    });

    it('should format decimal values', () => {
      expect(formatMoney(150.5)).toBe('R$ 150,50');
    });

    it('should format values with single decimal', () => {
      expect(formatMoney(99.9)).toBe('R$ 99,90');
    });
  });

  describe('large values', () => {
    it('should format thousands with separator', () => {
      expect(formatMoney(1000)).toBe('R$ 1.000,00');
    });

    it('should format millions', () => {
      expect(formatMoney(1500000.75)).toBe('R$ 1.500.000,75');
    });

    it('should format values over billion', () => {
      expect(formatMoney(1234567890.12)).toBe('R$ 1.234.567.890,12');
    });
  });

  describe('edge cases', () => {
    it('should format zero', () => {
      expect(formatMoney(0)).toBe('R$ 0,00');
    });

    it('should round to 2 decimal places', () => {
      expect(formatMoney(10.999)).toBe('R$ 11,00');
      expect(formatMoney(10.994)).toBe('R$ 10,99');
    });

    it('should handle negative values', () => {
      expect(formatMoney(-50.25)).toBe('R$ -50,25');
    });
  });

  describe('options', () => {
    it('should format without currency symbol', () => {
      expect(formatMoney(100, { showSymbol: false })).toBe('100,00');
    });

    it('should use custom decimal places', () => {
      expect(formatMoney(100.5, { decimalPlaces: 3 })).toBe('R$ 100,500');
    });
  });
});
