import { formatDateLong, formatDateShort, formatDecimal } from '../../../../src/utils';

describe('formatDateShort', () => {
  it('should format date to DDMMYY', () => {
    expect(formatDateShort(new Date(2026, 0, 15))).toBe('150126');
  });

  it('should pad single-digit day and month', () => {
    expect(formatDateShort(new Date(2026, 2, 5))).toBe('050326');
  });

  it('should use 2-digit year', () => {
    expect(formatDateShort(new Date(2099, 11, 31))).toBe('311299');
  });
});

describe('formatDateLong', () => {
  it('should format date to DDMMYYYY', () => {
    expect(formatDateLong(new Date(2026, 0, 15))).toBe('15012026');
  });

  it('should pad single-digit day and month', () => {
    expect(formatDateLong(new Date(2026, 2, 5))).toBe('05032026');
  });

  it('should use full 4-digit year', () => {
    expect(formatDateLong(new Date(2099, 11, 31))).toBe('31122099');
  });
});

describe('formatDecimal', () => {
  it('should format decimal with 2 decimal places', () => {
    expect(formatDecimal(150.5, 13, 2)).toBe('0000000015050');
  });

  it('should format whole number as decimal', () => {
    expect(formatDecimal(1000, 13, 2)).toBe('0000000100000');
  });

  it('should handle zero', () => {
    expect(formatDecimal(0, 13, 2)).toBe('0000000000000');
  });

  it('should round half-up', () => {
    expect(formatDecimal(10.555, 7, 2)).toBe('0001056');
  });

  it('should handle different decimal places', () => {
    expect(formatDecimal(10.123, 8, 3)).toBe('00010123');
  });
});
