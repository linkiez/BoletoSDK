import { CommonInstructionCode } from '../../../enums';
import type { DetailRecord as Cnab240DetailRecord } from '../../../types/cnab240';
import type { DetailRecord, ReturnDetailRecord } from '../../../types/cnab400';

/**
 * Supported Itaú wallet codes.
 */
export type ItauWalletCode = '109' | '112' | '115' | '180';

/**
 * Itaú wallet configuration metadata used by adapter enrichment flows.
 */
export interface ItauWalletConfig {
  /** Three-digit wallet code. */
  code: ItauWalletCode;
  /** Human-readable wallet description. */
  description: string;
  /** Portfolio code used on CNAB240 Segment P. */
  cnab240PortfolioCode: string;
  /** Wallet type used on CNAB400 detail records. */
  cnab400WalletType: 'I';
}

/**
 * Detailed result for an Itaú "our number" calculation.
 */
export interface ItauOurNumberResult {
  /** Base numeric value received as input. */
  baseNumber: string;
  /** Modulo 10 check digit for the base number. */
  checkDigit: number;
  /** Concatenation of base number + check digit. */
  formatted: string;
}

/**
 * Supported Itaú occurrence codes from CNAB400 return files.
 */
export type ItauOccurrenceCode =
  | '02'
  | '03'
  | '04'
  | '05'
  | '06'
  | '07'
  | '08'
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
  | '21'
  | '23'
  | '24'
  | '25'
  | '26'
  | '27'
  | '28'
  | '29'
  | '30'
  | '31'
  | '32'
  | '33';

/**
 * Generic semantic categories for Itaú occurrence mappings.
 */
export type ItauOccurrenceCategory =
  | 'entry'
  | 'rejection'
  | 'settlement'
  | 'instruction'
  | 'maintenance'
  | 'charge'
  | 'payer';

/**
 * Normalized semantic representation of an Itaú occurrence code.
 */
export interface ItauOccurrenceMapping {
  /** Raw two-digit occurrence code returned by Itaú. */
  code: ItauOccurrenceCode;
  /** Generic semantic bucket used by SDK consumers. */
  category: ItauOccurrenceCategory;
  /** Human-readable meaning of the occurrence. */
  description: string;
}

/**
 * Supported Itaú instruction codes from CNAB400 remittance files.
 */
export type ItauInstructionCode =
  | '00'
  | '01'
  | '02'
  | '03'
  | '04'
  | '05'
  | '06'
  | '07'
  | '08'
  | '09'
  | '10'
  | '11'
  | '12'
  | '13'
  | '14'
  | '15';

/**
 * Normalized semantic representation of an Itaú instruction code.
 */
export interface ItauInstructionMapping {
  /** Raw two-digit instruction code used by Itaú. */
  code: ItauInstructionCode;
  /** Generic instruction code reused by the SDK when a direct equivalent exists. */
  commonCode?: CommonInstructionCode;
  /** Human-readable meaning of the instruction. */
  description: string;
}

/**
 * Parsed Itaú-specific fields from a CNAB400 remittance detail record.
 */
export interface ItauRemittanceFields {
  /** Four-digit code for a canceled instruction/allegation. */
  instructionCancellationCode: string;
  /** Raw content of the Itaú bank-use area when present. */
  bankUseOperation?: string;
  /** Three-digit Itaú wallet number. */
  walletNumber?: string;
  /** Single-character wallet type used by Itaú. */
  walletType?: string;
  /** Two-digit remittance occurrence code. */
  occurrenceCode?: string;
  /** Number of days associated with the configured instruction. */
  daysCount?: number;
}

/**
 * Parsed Itaú-specific fields from a CNAB400 return detail record.
 */
export interface ItauReturnFields {
  /** Three-digit Itaú wallet number. */
  walletNumber?: string;
  /** Single-character wallet type used by Itaú. */
  walletType?: string;
  /** Itaú our-number value echoed by the bank. */
  bankOurNumber?: string;
  /** Check digit for the bank our-number field. */
  bankOurNumberDigit?: string;
  /** Confirmation of the our-number field in the return record. */
  confirmedOurNumber?: string;
  /** Four-digit canceled instruction code. */
  canceledInstructionCode: string;
  /** Raw rejection or informational message code area. */
  rejectionMessage?: string;
  /** Liquidation channel code when provided. */
  liquidationCode?: string;
}

/**
 * Enriched Itaú CNAB400 remittance detail.
 */
export interface ItauCnab400RemittanceDetail {
  /** Normalized movement source for this detail payload. */
  movementType: 'remittance';
  /** Generic CNAB400 remittance detail parsed by the SDK core parser. */
  detail: DetailRecord;
  /** Itaú-specific field extraction for remittance records. */
  fields: ItauRemittanceFields;
  /** Resolved wallet configuration when wallet number is supported. */
  wallet?: ItauWalletConfig;
  /** Optional normalized mapping for instruction code 1. */
  instructionCode1?: ItauInstructionMapping;
  /** Optional normalized mapping for instruction code 2. */
  instructionCode2?: ItauInstructionMapping;
  /** Validation result for Itaú remittance business rules. */
  validation: { isValid: boolean; errors: string[] };
}

/**
 * Enriched Itaú CNAB400 return detail.
 */
export interface ItauCnab400ReturnDetail {
  /** Normalized movement source for this detail payload. */
  movementType: 'return';
  /** Generic CNAB400 return detail parsed by the SDK core parser. */
  detail: ReturnDetailRecord;
  /** Itaú-specific field extraction for return records. */
  fields: ItauReturnFields;
  /** Resolved wallet configuration when wallet number is supported. */
  wallet?: ItauWalletConfig;
  /** Optional normalized occurrence mapping for return records. */
  occurrence?: ItauOccurrenceMapping;
  /** Validation result for Itaú return business rules. */
  validation: { isValid: boolean; errors: string[] };
}

/**
 * Union of enriched Itaú CNAB400 detail payloads.
 */
export type ItauCnab400Detail = ItauCnab400RemittanceDetail | ItauCnab400ReturnDetail;

/**
 * Enriched Itaú CNAB240 detail payload built from parsed segments.
 */
export interface ItauCnab240Segment {
  /** Normalized movement source for this payload. */
  movementType: 'cnab240';
  /** Generic CNAB240 detail parsed by the SDK core parser. */
  detail: Cnab240DetailRecord;
  /** Three-digit Itaú wallet number from Segment P portfolio code. */
  walletNumber?: string;
  /** Resolved wallet configuration when wallet number is supported. */
  wallet?: ItauWalletConfig;
  /** Two-digit occurrence code from Segment P. */
  occurrenceCode: string;
  /** Optional normalized mapping when the occurrence is available in Itaú return map. */
  occurrence?: ItauOccurrenceMapping;
  /** Validation result for Itaú CNAB240 adapter constraints. */
  validation: { isValid: boolean; errors: string[] };
}
