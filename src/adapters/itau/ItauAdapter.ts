import type { ItauOurNumberResult } from '../../types/adapters';
import { buildItauOurNumber, formatItauOurNumber } from './ItauOurNumberCalculator';
import { assertValidItauWallet, isValidItauWallet } from './ItauWalletValidator';

/**
 * Facade for Ita\u00fa-specific rules and helpers.
 */
export class ItauAdapter {
  /**
   * Checks whether a wallet code is supported by Ita\u00fa.
   *
   * @param walletCode - Wallet code to validate.
   * @returns True when the wallet code is supported.
   */
  public isSupportedWallet(walletCode: string): boolean {
    return isValidItauWallet(walletCode);
  }

  /**
   * Asserts that a wallet code is supported by Ita\u00fa.
   *
   * @param walletCode - Wallet code to validate.
   * @throws {Error} When wallet code is not supported.
   */
  public assertSupportedWallet(walletCode: string): void {
    assertValidItauWallet(walletCode);
  }

  /**
   * Builds Ita\u00fa "our number" by appending the modulo 10 check digit.
   *
   * @param baseNumber - Numeric base value.
   * @returns Formatted "our number".
   */
  public formatOurNumber(baseNumber: string): string {
    return formatItauOurNumber(baseNumber);
  }

  /**
   * Builds a detailed representation of Itaú "our number".
   *
   * @param baseNumber - Numeric base value.
   * @returns Object containing the base number, calculated check digit and formatted value.
   */
  public buildOurNumber(baseNumber: string): ItauOurNumberResult {
    return buildItauOurNumber(baseNumber);
  }
}

/**
 * Creates a new Itaú adapter instance.
 *
 * @returns New {@link ItauAdapter} instance.
 * @example
 * ```typescript
 * const adapter = createItauAdapter();
 * adapter.assertSupportedWallet('109');
 * ```
 */
export function createItauAdapter(): ItauAdapter {
  return new ItauAdapter();
}
