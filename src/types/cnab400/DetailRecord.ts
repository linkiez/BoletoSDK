/**
 * CNAB400 Detail Record Type Definition
 *
 * @module types/cnab400/DetailRecord
 */

/**
 * Detail Record (Type 1)
 *
 * Represents a bank slip (boleto) transaction detail in a CNAB400 file.
 * Contains payer information, amounts, dates, and payment instructions.
 *
 * @see CNAB400-ITAU.md section 3.1 - Registro Detalhe
 *
 * @example
 * ```typescript
 * const detail: DetailRecord = {
 *   recordType: '1',
 *   companyRegistrationType: '02',
 *   companyRegistrationNumber: '12345678000195',
 *   agency: '0001',
 *   account: '12345',
 *   accountDigit: '6',
 *   documentNumber: 'DOC123456',
 *   ourNumber: '12345678',
 *   amount: 150.00,
 *   bankCode: '341',
 *   dueDate: new Date('2026-03-01'),
 *   instructionCode1: '01',
 *   payerName: 'JOHN DOE',
 *   payerAddress: 'RUA EXEMPLO 100',
 *   payerCity: 'SAO PAULO',
 *   payerState: 'SP',
 *   payerZipCode: '01310100',
 *   sequentialNumber: 2
 * };
 * ```
 */
export interface DetailRecord {
  /** Record type identifier - Always '1' for detail (Position 001-001) */
  recordType: '1';

  /** Company registration type - '01'=CPF, '02'=CNPJ (Position 002-003) */
  companyRegistrationType: '01' | '02' | '03';

  /** Company registration number - CPF/CNPJ (Position 004-017) */
  companyRegistrationNumber: string;

  /** Agency code - 4 digits (Position 018-021) */
  agency: string;

  /** Zeros - Complement '00' (Position 022-023) */
  zeros?: string;

  /** Account number - 5 digits (Position 024-028) */
  account: string;

  /** Account check digit - 1 digit (Position 029-029) */
  accountDigit: string;

  /** Company internal control - Optional (Position 030-054) */
  companyControl?: string;

  /** Our number - Bank's identification (Position 055-062) */
  ourNumber: string;

  /** Discount amount to be granted - 13 digits (Position 063-070) */
  discountAmount?: number;

  /** IOF percentage - Percentage (Position 071-072) */
  iofPercentage?: number;

  /** Portfolio code - Collection type (Position 083-085) */
  portfolioCode?: string;

  /** Registration instruction - '00' for normal (Position 086-087) */
  registrationInstruction?: string;

  /** Document number - Client's document number (Position 088-097) */
  documentNumber?: string;

  /** Due date - DDMMYY format (Position 101-106) */
  dueDate: Date;

  /** Transaction amount - 13 digits with 2 decimals (Position 107-119) */
  amount: number;

  /** Bank code - '341' for Itaú (Position 120-122) */
  bankCode?: string;

  /** Collecting agency - 4 digits (Position 123-126) */
  collectingAgency?: string;

  /** Agency digit - 1 digit (Position 127-127) */
  collectingAgencyDigit?: string;

  /** Document species - Check slip species (Position 128-129) */
  speciesCode?: string;

  /** Acceptance - 'A' for accepted (Position 130-130) */
  acceptance?: 'A' | 'N';

  /** Issue date - DDMMYY format (Position 131-136) */
  issueDate?: Date;

  /** Instruction code 1 - First instruction (Position 137-138) */
  instructionCode1?: string;

  /** Instruction code 2 - Second instruction (Position 139-140) */
  instructionCode2?: string;

  /** Daily interest amount - 13 digits (Position 141-153) */
  dailyInterestAmount?: number;

  /** Discount limit date - DDMMYY format (Position 154-159) */
  discountLimitDate?: Date;

  /** Discount amount - 13 digits (Position 160-172) */
  discountValue?: number;

  /** IOF amount - 13 digits (Position 173-185) */
  iofAmount?: number;

  /** Rebate amount - 13 digits (Position 186-198) */
  rebateAmount?: number;

  /** Payer registration type - '01'=CPF, '02'=CNPJ (Position 199-200) */
  payerRegistrationType?: '01' | '02';

  /** Payer registration number - CPF/CNPJ (Position 201-214) */
  payerRegistrationNumber?: string;

  /** Payer name - Up to 30 characters (Position 215-244) */
  payerName: string;

  /** Payer address - Up to 40 characters (Position 245-284) */
  payerAddress?: string;

  /** First message line - Optional (Position 285-314) */
  firstMessage?: string;

  /** Payer postal code - 8 digits (Position 315-322) */
  payerZipCode?: string;

  /** Guarantor/Third party - Optional (Position 323-337) */
  guarantor?: string;

  /** Guarantor city - Optional (Position 338-352) */
  guarantorCity?: string;

  /** Guarantor state - 2 letters (Position 353-354) */
  guarantorState?: string;

  /** Payer city - City name (Position 355-374) */
  payerCity?: string;

  /** Payer state - 2 letters (Position 375-376) */
  payerState?: string;

  /** Fine percentage - Percentage (Position 377-380) */
  finePercentage?: number;

  /** Fine days - Days until fine (Position 381-382) */
  fineDays?: number;

  /** Currency code - '09' for Real (Position 383-384) */
  currencyCode?: string;

  /** Sequential number - Record sequence in file (Position 395-400) */
  sequentialNumber: number;
}
