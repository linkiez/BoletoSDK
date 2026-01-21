/**
 * CNAB400 Guarantor Record Type Definition
 *
 * @module types/cnab400/GuarantorRecord
 */

/**
 * Guarantor Detail Record (Type 5) - Optional
 *
 * Additional record containing guarantor (sacador avalista) information.
 * Only included when there is a guarantor for the transaction.
 *
 * @see CNAB400-ITAU.md section 3.1 - Registro Detalhe Sacador Avalista
 *
 * @example
 * ```typescript
 * const guarantorRecord: GuarantorRecord = {
 *   recordType: '5',
 *   companyRegistrationType: '02',
 *   companyRegistrationNumber: '12345678000195',
 *   documentNumber: 'DOC123456',
 *   guarantorName: 'GUARANTOR COMPANY LTDA',
 *   guarantorAddress: 'AV EXAMPLE 500',
 *   guarantorCity: 'RIO DE JANEIRO',
 *   guarantorState: 'RJ',
 *   guarantorZipCode: '20000000',
 *   sequentialNumber: 3
 * };
 * ```
 */
export interface GuarantorRecord {
  /** Record type identifier - Always '5' for guarantor (Position 001-001) */
  recordType: '5';

  /** Company registration type - '01'=CPF, '02'=CNPJ (Position 002-003) */
  companyRegistrationType: '01' | '02';

  /** Company registration number - CPF/CNPJ (Position 004-017) */
  companyRegistrationNumber: string;

  /** Agency code - 4 digits (Position 018-021) */
  agency?: string;

  /** Account number - 5 digits (Position 024-028) */
  account?: string;

  /** Account check digit - 1 digit (Position 029-029) */
  accountDigit?: string;

  /** Document number - Must match detail record (Position 088-097) */
  documentNumber: string;

  /** Guarantor registration type - '01'=CPF, '02'=CNPJ (Position 199-200) */
  guarantorRegistrationType?: '01' | '02';

  /** Guarantor registration number - CPF/CNPJ (Position 201-214) */
  guarantorRegistrationNumber?: string;

  /** Guarantor name - Up to 30 characters (Position 215-244) */
  guarantorName: string;

  /** Guarantor address - Up to 45 characters (Position 245-289) */
  guarantorAddress?: string;

  /** Guarantor postal code - 8 digits (Position 290-297) */
  guarantorZipCode?: string;

  /** Guarantor city - City name (Position 298-312) */
  guarantorCity?: string;

  /** Guarantor state - 2 letters (Position 313-314) */
  guarantorState?: string;

  /** Sequential number - Record sequence in file (Position 395-400) */
  sequentialNumber: number;
}
