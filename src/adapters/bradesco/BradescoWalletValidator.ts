import type { BradescoWalletCode, BradescoWalletConfig } from '../../types/adapters';

/**
 * List of wallet codes supported by Bradesco adapter.
 */
export const BRADESCO_SUPPORTED_WALLETS: readonly BradescoWalletCode[] = [
  '09',
  '19',
  '26',
] as const;

/**
 * Wallet configuration metadata by canonical Bradesco wallet code.
 */
export const BRADESCO_WALLET_CONFIG_MAP: Record<BradescoWalletCode, BradescoWalletConfig> = {
  '09': {
    code: '09',
    description: 'Simple collection portfolio',
    cnab240PortfolioCode: '09',
    cnab400WalletType: 'R',
    aliases: ['09', '009'],
  },
  '19': {
    code: '19',
    description: 'Registered collection portfolio',
    cnab240PortfolioCode: '19',
    cnab400WalletType: 'R',
    aliases: ['19', '019'],
  },
  '26': {
    code: '26',
    description: 'Guaranteed collection portfolio',
    cnab240PortfolioCode: '26',
    cnab400WalletType: 'R',
    aliases: ['26', '026'],
  },
};

/**
 * Normalizes Bradesco wallet code to canonical two-digit format.
 *
 * @param walletCode - Wallet code provided by file or caller.
 * @returns Canonical wallet code when recognized; otherwise undefined.
 */
export function normalizeBradescoWalletCode(walletCode: string): BradescoWalletCode | undefined {
  if (!walletCode) {
    return undefined;
  }

  const normalized = walletCode.trim();

  const match = Object.values(BRADESCO_WALLET_CONFIG_MAP).find((config) =>
    config.aliases.includes(normalized),
  );

  return match?.code;
}

/**
 * Validates whether wallet code is supported by Bradesco rules.
 *
 * @param walletCode - Wallet code to validate.
 * @returns True when code is supported.
 */
export function isValidBradescoWallet(walletCode: string): boolean {
  return normalizeBradescoWalletCode(walletCode) !== undefined;
}

/**
 * Resolves Bradesco wallet configuration from wallet code.
 *
 * @param walletCode - Wallet code to resolve.
 * @returns Wallet config when supported; otherwise undefined.
 */
export function getBradescoWalletConfig(walletCode: string): BradescoWalletConfig | undefined {
  const normalized = normalizeBradescoWalletCode(walletCode);

  if (!normalized) {
    return undefined;
  }

  return BRADESCO_WALLET_CONFIG_MAP[normalized];
}

/**
 * Asserts that wallet code is supported by Bradesco.
 *
 * @param walletCode - Wallet code to validate.
 * @throws {Error} When wallet code is unsupported.
 */
export function assertValidBradescoWallet(walletCode: string): void {
  if (!isValidBradescoWallet(walletCode)) {
    throw new Error(`Unsupported Bradesco wallet code: ${walletCode}`);
  }
}
