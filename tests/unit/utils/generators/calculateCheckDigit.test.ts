import { calculateModulo10, calculateModulo11 } from '@utils/generators';

describe('calculateModulo10', () => {
  it('should calculate modulo 10 check digit', () => {
    expect(calculateModulo10('123456')).toBe(6);
  });

  it('should calculate for barcode segment', () => {
    expect(calculateModulo10('3419166700000001234567890')).toBe(4);
  });

  it('should handle all zeros', () => {
    expect(calculateModulo10('000000')).toBe(0);
  });

  it('should handle single digit', () => {
    expect(calculateModulo10('5')).toBe(9);
  });
});

describe('calculateModulo11', () => {
  describe('default options', () => {
    it('should calculate modulo 11 check digit', () => {
      expect(calculateModulo11('123456789')).toBe(7);
    });

    it('should use weights 2-9 by default', () => {
      expect(calculateModulo11('0000000000')).toBe(0);
    });
  });

  describe('custom options', () => {
    it('should use custom max weight', () => {
      expect(calculateModulo11('123456', { maxWeight: 7 })).toBe(0);
    });

    it('should replace 10 with custom value', () => {
      expect(calculateModulo11('1234567', { replace10: 1 })).toBe(9);
    });

    it('should replace 11 with custom value', () => {
      expect(calculateModulo11('00000000', { replace11: 0 })).toBe(0);
    });
  });

  describe('edge cases', () => {
    it('should handle empty string', () => {
      expect(calculateModulo11('')).toBe(0);
    });

    it('should handle single digit', () => {
      expect(calculateModulo11('5')).toBe(1);
    });
  });
});
