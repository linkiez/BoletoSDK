import { ItauAdapter, createItauAdapter } from '../../../../src/adapters/itau';

describe('ItauAdapter', () => {
  const adapter = new ItauAdapter();

  it('should create adapter instances through factory helper', () => {
    expect(createItauAdapter()).toBeInstanceOf(ItauAdapter);
  });

  it('should validate supported wallet code', () => {
    expect(adapter.isSupportedWallet('109')).toBe(true);
  });

  it('should reject unsupported wallet code', () => {
    expect(adapter.isSupportedWallet('999')).toBe(false);
  });

  it('should generate formatted our number', () => {
    expect(adapter.formatOurNumber('12345678')).toBe('123456782');
  });

  it('should build detailed our number result', () => {
    expect(adapter.buildOurNumber('12345678')).toEqual({
      baseNumber: '12345678',
      checkDigit: 2,
      formatted: '123456782',
    });
  });

  it('should throw when asserting unsupported wallet code', () => {
    expect(() => adapter.assertSupportedWallet('999')).toThrow('Unsupported Itau wallet code: 999');
  });
});
