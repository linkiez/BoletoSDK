import { parseDateShort } from '@utils/parsers';

describe('parseDateShort', () => {
  it('should parse DDMMYY format', () => {
    const date = parseDateShort('150126');
    expect(date.getDate()).toBe(15);
    expect(date.getMonth()).toBe(0);
    expect(date.getFullYear()).toBe(2026);
  });

  it('should pad single-digit day and month', () => {
    const date = parseDateShort('050326');
    expect(date.getDate()).toBe(5);
    expect(date.getMonth()).toBe(2);
    expect(date.getFullYear()).toBe(2026);
  });

  it('should assume 21st century', () => {
    const date = parseDateShort('311299');
    expect(date.getFullYear()).toBe(2099);
  });

  it('should throw on invalid length', () => {
    expect(() => parseDateShort('123')).toThrow('Invalid short date format');
  });

  it('should throw on non-numeric input', () => {
    expect(() => parseDateShort('ab0126')).toThrow('Invalid short date format');
  });

  it('should throw on invalid date', () => {
    expect(() => parseDateShort('320126')).toThrow('Invalid date');
  });
});
