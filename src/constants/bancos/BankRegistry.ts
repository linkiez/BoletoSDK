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
    name: 'Banco do Brasil S.A.',
    shortName: 'Banco do Brasil',
    ispb: '00000000',
  },
  [BankCode.SANTANDER]: {
    code: BankCode.SANTANDER,
    name: 'Banco Santander (Brasil) S.A.',
    shortName: 'Santander',
    ispb: '90400888',
  },
  [BankCode.CAIXA]: {
    code: BankCode.CAIXA,
    name: 'Caixa Econômica Federal',
    shortName: 'CAIXA',
    ispb: '00360305',
  },
  [BankCode.BRADESCO]: {
    code: BankCode.BRADESCO,
    name: 'Banco Bradesco S.A.',
    shortName: 'Bradesco',
    ispb: '60746948',
  },
  [BankCode.C6_BANK]: {
    code: BankCode.C6_BANK,
    name: 'Banco C6 S.A.',
    shortName: 'C6 Bank',
    ispb: '31872495',
  },
  [BankCode.ITAU]: {
    code: BankCode.ITAU,
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
 * Check if bank code is valid
 *
 * @param code - Bank code to validate
 * @returns true if bank code exists in our database
 */
export function isValidBankCode(code: string): boolean {
  return code in BANKS;
}
