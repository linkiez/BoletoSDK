import type { DetailRecord as Cnab240DetailRecord } from '../../../types/cnab240';
import type { DetailRecord, ReturnDetailRecord } from '../../../types/cnab400';

/**
 * Supported Bradesco wallet codes.
 */
export type BradescoWalletCode = '09' | '19' | '26';

/**
 * Bradesco wallet metadata used by adapter enrichment flows.
 */
export interface BradescoWalletConfig {
  /** Canonical two-digit wallet code. */
  code: BradescoWalletCode;
  /** Human-readable wallet description. */
  description: string;
  /** CNAB240 portfolio code associated with wallet. */
  cnab240PortfolioCode: string;
  /** CNAB400 wallet type identifier when applicable. */
  cnab400WalletType: string;
  /** Alternate accepted representations for the same wallet. */
  aliases: readonly string[];
}

/**
 * Bradesco check digit values for "our number".
 */
export type BradescoOurNumberCheckDigit = '0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | 'P';

/**
 * Detailed result for Bradesco "our number" formatting.
 */
export interface BradescoOurNumberResult {
  /** Numeric base value received as input. */
  baseNumber: string;
  /** Calculated modulo-11 check digit. */
  checkDigit: BradescoOurNumberCheckDigit;
  /** Formatted value for display and reconciliation. */
  formatted: string;
}

/**
 * Supported Bradesco occurrence codes from CNAB return files.
 */
export type BradescoOccurrenceCode =
  | '02'
  | '03'
  | '06'
  | '09'
  | '10'
  | '11'
  | '12'
  | '13'
  | '14'
  | '15'
  | '16'
  | '17'
  | '18'
  | '19'
  | '20'
  | '23'
  | '24'
  | '25'
  | '26'
  | '27'
  | '28'
  | '30';

/**
 * Semantic categories for Bradesco occurrence mapping.
 */
export type BradescoOccurrenceCategory =
  | 'entry'
  | 'rejection'
  | 'settlement'
  | 'instruction'
  | 'maintenance'
  | 'charge'
  | 'payer';

/**
 * Normalized representation of a Bradesco occurrence code.
 */
export interface BradescoOccurrenceMapping {
  /** Raw two-digit occurrence code returned by Bradesco. */
  code: BradescoOccurrenceCode;
  /** Generic semantic bucket used by SDK consumers. */
  category: BradescoOccurrenceCategory;
  /** Human-readable meaning of the occurrence. */
  description: string;
}

/**
 * Parsed Bradesco-specific fields for remittance records.
 */
export interface BradescoRemittanceFields {
  /** Two-digit instruction code. */
  instructionCode: string;
  /** Two or three-digit wallet code (canonical or alias). */
  walletNumber?: string;
  /** Wallet type used by Bradesco in CNAB400 details. */
  walletType?: string;
  /** Two-digit occurrence code for remittance movement. */
  occurrenceCode?: string;
  /** Number of days associated with the configured instruction. */
  daysCount?: number;
}

/**
 * Parsed Bradesco-specific fields for return records.
 */
export interface BradescoReturnFields {
  /** Two or three-digit wallet code (canonical or alias). */
  walletNumber?: string;
  /** Wallet type used by Bradesco in CNAB400 details. */
  walletType?: string;
  /** Two-digit return occurrence code. */
  occurrenceCode?: string;
  /** Our-number value echoed by the bank. */
  ourNumber?: string;
  /** Check digit for `ourNumber`. */
  ourNumberCheckDigit?: string;
  /** Confirmed our-number value informed by return area. */
  confirmedOurNumber?: string;
  /** Check digit for `confirmedOurNumber`. */
  confirmedOurNumberCheckDigit?: string;
}

/**
 * Enriched Bradesco CNAB400 remittance detail.
 */
export interface BradescoCnab400RemittanceDetail {
  /** Normalized movement source for this detail payload. */
  movementType: 'remittance';
  /** Generic CNAB400 remittance detail parsed by the SDK core parser. */
  detail: DetailRecord;
  /** Bradesco-specific field extraction for remittance records. */
  fields: BradescoRemittanceFields;
  /** Resolved wallet configuration when wallet number is supported. */
  wallet?: BradescoWalletConfig;
  /** Validation result for Bradesco remittance business rules. */
  validation: { isValid: boolean; errors: string[] };
}

/**
 * Enriched Bradesco CNAB400 return detail.
 */
export interface BradescoCnab400ReturnDetail {
  /** Normalized movement source for this detail payload. */
  movementType: 'return';
  /** Generic CNAB400 return detail parsed by the SDK core parser. */
  detail: ReturnDetailRecord;
  /** Bradesco-specific field extraction for return records. */
  fields: BradescoReturnFields;
  /** Resolved wallet configuration when wallet number is supported. */
  wallet?: BradescoWalletConfig;
  /** Optional normalized occurrence mapping for return records. */
  occurrence?: BradescoOccurrenceMapping;
  /** Validation result for Bradesco return business rules. */
  validation: { isValid: boolean; errors: string[] };
}

/**
 * Enriched Bradesco CNAB240 detail payload built from parsed segments.
 */
export interface BradescoCnab240Segment {
  /** Normalized movement source for this payload. */
  movementType: 'cnab240';
  /** Generic CNAB240 detail parsed by the SDK core parser. */
  detail: Cnab240DetailRecord;
  /** Two-digit Bradesco wallet number from Segment P portfolio code. */
  walletNumber?: string;
  /** Resolved wallet configuration when wallet number is supported. */
  wallet?: BradescoWalletConfig;
  /** Two-digit occurrence code from Segment P. */
  occurrenceCode: string;
  /** Optional normalized mapping when occurrence code is recognized by Bradesco map. */
  occurrence?: BradescoOccurrenceMapping;
  /** Validation result for Bradesco CNAB240 adapter constraints. */
  validation: { isValid: boolean; errors: string[] };
}
