import type { ItauWalletCode } from '../../types/adapters';

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
