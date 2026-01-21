/**
 * CNAB240 Segment P Parser
 *
 * Parses Segment P (main payment data) of a CNAB240 detail record.
 * Segment P is mandatory and contains core slip/payment information.
 *
 * @module parsers/cnab240/SegmentPParser
 */

import { SegmentP } from '../../types/cnab240';
import {
  extractField,
  parseDateField,
  parseDecimalField,
  parseNumericField,
  validateRecordType,
  validateSegmentCode,
} from './LineParser';

/**
 * Parse CNAB240 Segment P (record type 3, segment P)
 *
 * @param line - The 240-character segment P line
 * @returns Parsed SegmentP object
 *
 * @example
 * ```typescript
 * const segmentP = parseSegmentP(segmentPLine);
 * console.log(segmentP.amount); // 150.00
 * ```
 */
export function parseSegmentP(line: string): SegmentP {
  // Validate record type and segment code
  validateRecordType(line, '3');
  validateSegmentCode(line, 'P');

  // Parse required dates
  const dueDate = parseDateField(line, 81, 88);
  const issueDate = parseDateField(line, 113, 120);

  if (!dueDate) {
    throw new Error('Due date is required in Segment P');
  }

  if (!issueDate) {
    throw new Error('Issue date is required in Segment P');
  }

  return {
    // Positions 1-3: Bank code
    bankCode: extractField(line, 1, 3),

    // Positions 4-7: Batch number
    batchNumber: parseNumericField(line, 4, 7),

    // Position 8: Record type (always "3" for detail)
    recordType: extractField(line, 8, 8),

    // Positions 9-13: Sequential record number within batch
    sequentialNumber: parseNumericField(line, 9, 13),

    // Position 14: Segment code (always "P")
    segmentCode: extractField(line, 14, 14),

    // Positions 16-17: Occurrence code
    occurrenceCode: extractField(line, 16, 17),

    // Positions 18-22: Agency
    agency: extractField(line, 18, 22),

    // Position 23: Agency check digit
    agencyDigit: extractField(line, 23, 23) || undefined,

    // Positions 24-35: Account number
    account: extractField(line, 24, 35),

    // Position 36: Account check digit
    accountDigit: extractField(line, 36, 36),

    // Position 37: Full account check digit
    fullAccountDigit: extractField(line, 37, 37) || undefined,

    // Positions 38-57: Our number (nosso número)
    ourNumber: extractField(line, 38, 57),

    // Position 58: Our number check digit
    ourNumberDigit: extractField(line, 58, 58) || undefined,

    // Positions 59-61: Portfolio code (carteira)
    portfolioCode: extractField(line, 59, 61),

    // Position 62: Form type (1=self-copy, 2=deposit receipt, 4=booklet)
    formType: extractField(line, 62, 62) || undefined,

    // Positions 63-73: Slip number (if pre-printed)
    slipNumber: extractField(line, 63, 73) || undefined,

    // Position 74: Slip number check digit
    slipNumberDigit: extractField(line, 74, 74) || undefined,

    // Position 75: Issuance type (1=Bank, 2=Company)
    issuanceType: extractField(line, 75, 75) || undefined,

    // Position 76: Distribution type (1=Bank, 2=Company)
    distributionType: extractField(line, 76, 76) || undefined,

    // Positions 66-80: Document number (número do documento)
    documentNumber: extractField(line, 66, 80),

    // Positions 81-88: Due date (DDMMYYYY) - required
    dueDate,

    // Positions 89-103: Slip amount (15 digits, 2 decimals)
    amount: parseDecimalField(line, 89, 103, 2),

    // Positions 104-108: Collection agency
    collectionAgency: extractField(line, 104, 108) || undefined,

    // Position 109: Collection agency digit
    collectionAgencyDigit: extractField(line, 109, 109) || undefined,

    // Positions 110-111: Species code (01=DM, 02=NP, etc.)
    speciesCode: extractField(line, 110, 111),

    // Position 112: Acceptance (A=Accepted, N=Not accepted)
    acceptance: extractField(line, 112, 112),

    // Positions 113-120: Issue date (DDMMYYYY) - required
    issueDate,

    // Position 121: Interest code (1=Daily, 2=Monthly, 3=Exempt)
    interestCode: extractField(line, 121, 121) || undefined,

    // Positions 122-129: Interest start date (DDMMYYYY)
    interestDate: parseDateField(line, 122, 129) || undefined,

    // Positions 130-144: Interest amount/percentage (15 digits, 2 decimals)
    interestAmount: parseDecimalField(line, 130, 144, 2) || undefined,

    // Position 145: Discount code (0=None, 1=Fixed, 2=Percentage)
    discountCode: extractField(line, 145, 145) || undefined,

    // Positions 146-153: Discount date (DDMMYYYY)
    discountDate: parseDateField(line, 146, 153) || undefined,

    // Positions 154-168: Discount amount (15 digits, 2 decimals)
    discountAmount: parseDecimalField(line, 154, 168, 2) || undefined,

    // Positions 169-183: IOF amount (15 digits, 2 decimals)
    iofAmount: parseDecimalField(line, 169, 183, 2) || undefined,

    // Positions 184-198: Rebate amount (15 digits, 2 decimals)
    rebateAmount: parseDecimalField(line, 184, 198, 2) || undefined,

    // Positions 199-223: CNAB reserved field
    cnabReserved2: extractField(line, 199, 223) || undefined,

    // Position 224: Protest code (1=Protest, 3=Do not protest, 9=Cancel)
    protestCode: extractField(line, 224, 224) || undefined,

    // Positions 225-226: Protest days
    protestDays: parseNumericField(line, 225, 226) || undefined,

    // Position 227: Write-off code (1=Write-off, 2=Do not write-off)
    writeOffCode: extractField(line, 227, 227) || undefined,

    // Positions 228-230: Write-off days
    writeOffDays: parseNumericField(line, 228, 230) || undefined,

    // Positions 231-232: Currency code (09=Real)
    currencyCode: extractField(line, 231, 232),

    // Positions 233-242: Agreement number
    agreementNumber: extractField(line, 233, 242) || undefined,
  };
}
