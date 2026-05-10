import type { ItauWalletCode, ItauWalletConfig } from '../../types/adapters';

/**
 * List of wallet codes supported by Ita\u00fa adapter.
 */
export const ITAU_SUPPORTED_WALLETS: readonly ItauWalletCode[] = [
  '109',
  '112',
  '115',
  '180',
] as const;

/**
 * Wallet configuration metadata by supported Itaú wallet code.
 */
export const ITAU_WALLET_CONFIG_MAP: Record<ItauWalletCode, ItauWalletConfig> = {
  '109': {
    code: '109',
    description: 'Simple collection without registration',
    cnab240PortfolioCode: '109',
    cnab400WalletType: 'I',
  },
  '112': {
    code: '112',
    description: 'Simple collection with registration',
    cnab240PortfolioCode: '112',
    cnab400WalletType: 'I',
  },
  '115': {
    code: '115',
    description: 'Guaranteed collection with registration',
    cnab240PortfolioCode: '115',
    cnab400WalletType: 'I',
  },
  '180': {
    code: '180',
    description: 'Direct collection with registration',
    cnab240PortfolioCode: '180',
    cnab400WalletType: 'I',
  },
};

/**
 * Validates if a wallet code is supported by Ita\u00fa rules.
 *
 * @param walletCode - Wallet code to validate.
 * @returns True when the wallet code is supported.
 * @example
 * ```typescript
 * isValidItauWallet('109'); // true
 * isValidItauWallet('999'); // false
 * ```
 */
export function isValidItauWallet(walletCode: string): walletCode is ItauWalletCode {
  return (
    /^\d{3}$/.test(walletCode) && ITAU_SUPPORTED_WALLETS.includes(walletCode as ItauWalletCode)
  );
}

/**
 * Resolves Itaú wallet configuration from wallet code.
 *
 * @param walletCode - Wallet code to resolve.
 * @returns Wallet configuration when supported; otherwise undefined.
 */
export function getItauWalletConfig(walletCode: string): ItauWalletConfig | undefined {
  if (isValidItauWallet(walletCode)) {
    return ITAU_WALLET_CONFIG_MAP[walletCode];
  }

  // Some CNAB240 parser flows expose a reduced one-digit portfolio code.
  if (/^\d$/.test(walletCode)) {
    const matched = Object.values(ITAU_WALLET_CONFIG_MAP).find((config) =>
      config.cnab240PortfolioCode.endsWith(walletCode),
    );

    return matched;
  }

  return undefined;
}

/**
 * Asserts that a wallet code is supported by Ita\u00fa.
 *
 * @param walletCode - Wallet code to validate.
 * @throws {Error} When the wallet code is not supported.
 */
export function assertValidItauWallet(walletCode: string): void {
  if (!isValidItauWallet(walletCode)) {
    throw new Error(`Unsupported Itau wallet code: ${walletCode}`);
  }
}
