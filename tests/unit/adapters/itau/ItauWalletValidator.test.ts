import {
  getItauWalletConfig,
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

  it('should resolve Itaú wallet config for supported wallet', () => {
    expect(getItauWalletConfig('109')).toEqual({
      code: '109',
      description: 'Simple collection without registration',
      cnab240PortfolioCode: '109',
      cnab400WalletType: 'I',
    });
  });

  it('should return undefined for unsupported wallet config lookup', () => {
    expect(getItauWalletConfig('999')).toBeUndefined();
  });

  it('should resolve Itaú wallet config from reduced CNAB240 portfolio alias', () => {
    expect(getItauWalletConfig('9')).toEqual({
      code: '109',
      description: 'Simple collection without registration',
      cnab240PortfolioCode: '109',
      cnab400WalletType: 'I',
    });
  });

  it('should throw for invalid wallet code in assertion helper', () => {
    expect(() => assertValidItauWallet('999')).toThrow('Unsupported Itau wallet code: 999');
  });
});
