/**
 * Bank-related constants
 * @module constants/bancos
 */

import { BankCode } from '@enums/common';

/**
 * Bank information interface
 */
export interface BankInfo {
  /** Bank code (3 digits) */
  code: BankCode;
  /** Bank code check digit (COMPE) */
  checkDigit: string;
  /** Bank name */
  name: string;
  /** Short name */
  shortName: string;
  /** ISPB (Identificador do Sistema de Pagamentos Brasileiro) */
  ispb: string;
}

/**
 * Complete bank information by bank code
 */
export const BANKS: Record<BankCode, BankInfo> = {
  [BankCode.BANCO_DO_BRASIL]: {
    code: BankCode.BANCO_DO_BRASIL,
    checkDigit: '9',
    name: 'Banco do Brasil S.A.',
    shortName: 'Banco do Brasil',
    ispb: '00000000',
  },
  [BankCode.SANTANDER]: {
    code: BankCode.SANTANDER,
    checkDigit: '7',
    name: 'Banco Santander (Brasil) S.A.',
    shortName: 'Santander',
    ispb: '90400888',
  },
  [BankCode.CAIXA]: {
    code: BankCode.CAIXA,
    checkDigit: '0',
    name: 'Caixa Econômica Federal',
    shortName: 'CAIXA',
    ispb: '00360305',
  },
  [BankCode.BRADESCO]: {
    code: BankCode.BRADESCO,
    checkDigit: '2',
    name: 'Banco Bradesco S.A.',
    shortName: 'Bradesco',
    ispb: '60746948',
  },
  [BankCode.C6_BANK]: {
    code: BankCode.C6_BANK,
    checkDigit: '0',
    name: 'Banco C6 S.A.',
    shortName: 'C6 Bank',
    ispb: '31872495',
  },
  [BankCode.ITAU]: {
    code: BankCode.ITAU,
    checkDigit: '7',
    name: 'Itaú Unibanco S.A.',
    shortName: 'Itaú',
    ispb: '60701190',
  },
};

/**
 * Get bank information by code
 *
 * @param code - Bank code
 * @returns Bank information or undefined if not found
 *
 * @example
 * ```typescript
 * const bank = getBankInfo(BankCode.ITAU);
 * console.log(bank.name); // "Itaú Unibanco S.A."
 * ```
 */
export function getBankInfo(code: BankCode | string): BankInfo | undefined {
  return BANKS[code as BankCode];
}

/**
 * Get bank name by code
 *
 * @param code - Bank code
 * @returns Bank name or undefined if not found
 */
export function getBankName(code: BankCode | string): string | undefined {
  return getBankInfo(code)?.name;
}

/**
 * Get bank code with check digit in standard boleto format.
 *
 * @param code - Bank code
 * @param fallbackCheckDigit - Optional fallback check digit when code is unknown
 * @returns Formatted bank code with check digit (e.g. 341-7)
 */
export function getBankCodeWithCheckDigit(
  code: BankCode | string,
  fallbackCheckDigit = '0',
): string {
  const bank = getBankInfo(code);
  const normalizedCode = String(code).padStart(3, '0');
  const checkDigit = bank?.checkDigit ?? fallbackCheckDigit;

  return `${normalizedCode}-${checkDigit}`;
}

/**
 * Check if bank code is valid
 *
 * @param code - Bank code to validate
 * @returns true if bank code exists in our database
 */
export function isValidBankCode(code: string): boolean {
  return code in BANKS;
}
