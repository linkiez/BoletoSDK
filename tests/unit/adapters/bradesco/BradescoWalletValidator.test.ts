import {
  assertValidBradescoWallet,
  BRADESCO_SUPPORTED_WALLETS,
  getBradescoWalletConfig,
  isValidBradescoWallet,
  normalizeBradescoWalletCode,
} from '../../../../src/adapters/bradesco/BradescoWalletValidator';

describe('BradescoWalletValidator', () => {
  it('should expose supported Bradesco wallets', () => {
    expect(BRADESCO_SUPPORTED_WALLETS).toEqual(['09', '19', '26']);
  });

  it('should normalize supported wallet aliases to canonical codes', () => {
    expect(normalizeBradescoWalletCode('009')).toBe('09');
    expect(normalizeBradescoWalletCode('019')).toBe('19');
    expect(normalizeBradescoWalletCode('026')).toBe('26');
  });

  it('should validate supported wallet codes', () => {
    expect(isValidBradescoWallet('09')).toBe(true);
    expect(isValidBradescoWallet('19')).toBe(true);
    expect(isValidBradescoWallet('26')).toBe(true);
  });

  it('should validate wallet aliases used by some bank files', () => {
    expect(isValidBradescoWallet('009')).toBe(true);
    expect(isValidBradescoWallet('019')).toBe(true);
    expect(isValidBradescoWallet('026')).toBe(true);
  });

  it('should reject unsupported wallet codes', () => {
    expect(isValidBradescoWallet('99')).toBe(false);
    expect(isValidBradescoWallet('000')).toBe(false);
  });

  it('should resolve wallet config for supported code and alias', () => {
    expect(getBradescoWalletConfig('19')).toEqual({
      code: '19',
      description: 'Registered collection portfolio',
      cnab240PortfolioCode: '19',
      cnab400WalletType: 'R',
      aliases: ['19', '019'],
    });

    expect(getBradescoWalletConfig('019')).toEqual({
      code: '19',
      description: 'Registered collection portfolio',
      cnab240PortfolioCode: '19',
      cnab400WalletType: 'R',
      aliases: ['19', '019'],
    });
  });

  it('should return undefined for unsupported wallet lookup', () => {
    expect(getBradescoWalletConfig('999')).toBeUndefined();
  });

  it('should throw for invalid wallet code in assertion helper', () => {
    expect(() => assertValidBradescoWallet('999')).toThrow(
      'Unsupported Bradesco wallet code: 999',
    );
  });
});
