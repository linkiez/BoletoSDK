/**
 * Generic contract for bank-specific adapters.
 *
 * @typeParam TWalletConfig - Bank-specific wallet configuration shape.
 * @typeParam TRemittanceDetail - Enriched CNAB400 remittance detail shape.
 * @typeParam TReturnDetail - Enriched CNAB400 return detail shape.
 * @typeParam TCnab240Detail - Enriched CNAB240 detail shape.
 */
export interface IBankAdapter<
  TWalletConfig = unknown,
  TRemittanceDetail = unknown,
  TReturnDetail = unknown,
  TCnab240Detail = unknown,
> {
  /**
   * Checks whether a wallet code is supported by the bank adapter.
   *
   * @param walletCode - Wallet code to validate.
   * @returns True when supported.
   */
  isSupportedWallet(walletCode: string): boolean;

  /**
   * Asserts that a wallet code is supported by the bank adapter.
   *
   * @param walletCode - Wallet code to validate.
   * @throws {Error} When the wallet code is not supported.
   */
  assertSupportedWallet(walletCode: string): void;

  /**
   * Resolves wallet configuration metadata from a wallet code.
   *
   * @param walletCode - Wallet code to resolve.
   * @returns Wallet configuration when supported; otherwise undefined.
   */
  getWalletConfig(walletCode: string): TWalletConfig | undefined;

  /**
   * Builds enriched CNAB400 remittance detail payloads from full file content.
   *
   * @param content - Complete CNAB400 remittance file content.
   * @returns Enriched remittance details.
   */
  buildRemittanceDetailsFromContent(content: string): TRemittanceDetail[];

  /**
   * Builds enriched CNAB400 return detail payloads from full file content.
   *
   * @param content - Complete CNAB400 return file content.
   * @returns Enriched return details.
   */
  buildReturnDetailsFromContent(content: string): TReturnDetail[];

  /**
   * Builds enriched CNAB240 detail payloads from full file content.
   *
   * @param content - Complete CNAB240 file content.
   * @returns Enriched CNAB240 details.
   */
  buildCnab240DetailsFromContent(content: string): TCnab240Detail[];
}
