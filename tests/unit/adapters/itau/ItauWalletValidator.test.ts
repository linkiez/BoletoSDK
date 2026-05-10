import {
  ITAU_SUPPORTED_WALLETS,
  assertValidItauWallet,
  isValidItauWallet,
} from '../../../../src/adapters/itau/ItauWalletValidator';

describe('ItauWalletValidator', () => {
  it('should expose supported Itau wallets', () => {
    expect(ITAU_SUPPORTED_WALLETS).toEqual(['109', '112', '115', '180']);
  });

  it('should validate supported wallet codes', () => {
    expect(isValidItauWallet('109')).toBe(true);
    expect(isValidItauWallet('112')).toBe(true);
    expect(isValidItauWallet('115')).toBe(true);
    expect(isValidItauWallet('180')).toBe(true);
  });

  it('should reject unsupported wallet codes', () => {
    expect(isValidItauWallet('999')).toBe(false);
  });

  it('should reject non-numeric wallet codes', () => {
    expect(isValidItauWallet('A09')).toBe(false);
  });

  it('should throw for invalid wallet code in assertion helper', () => {
    expect(() => assertValidItauWallet('999')).toThrow('Unsupported Itau wallet code: 999');
  });
});
