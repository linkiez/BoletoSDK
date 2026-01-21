/**
 * CNAB240 Segment P Parser
 *
 * Parses Segment P (main payment data) of a CNAB240 detail record.
 * Segment P is mandatory and contains core slip/payment information.
 *
 * @module parsers/cnab240/SegmentPParser
 */

import { SEGMENT_P_POSITIONS } from '../../constants/cnab240';
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
  const POS = SEGMENT_P_POSITIONS;

  // Validate record type and segment code
  validateRecordType(line, '3');
  validateSegmentCode(line, 'P');

  // Parse required dates
  const dueDate = parseDateField(line, POS.DUE_DATE.start, POS.DUE_DATE.end);
  const issueDate = parseDateField(line, POS.ISSUE_DATE.start, POS.ISSUE_DATE.end);

  if (!dueDate) {
    throw new Error('Due date is required in Segment P');
  }

  if (!issueDate) {
    throw new Error('Issue date is required in Segment P');
  }

  return {
    // Bank code (01.3P)
    bankCode: extractField(line, POS.BANK_CODE.start, POS.BANK_CODE.end),

    // Batch number (02.3P)
    batchNumber: parseNumericField(line, POS.BATCH_NUMBER.start, POS.BATCH_NUMBER.end),

    // Record type (03.3P)
    recordType: extractField(line, POS.RECORD_TYPE.start, POS.RECORD_TYPE.end),

    // Sequential record number (04.3P)
    sequentialNumber: parseNumericField(line, POS.RECORD_NUMBER.start, POS.RECORD_NUMBER.end),

    // Segment code (05.3P)
    segmentCode: extractField(line, POS.SEGMENT_CODE.start, POS.SEGMENT_CODE.end),

    // Occurrence code (07.3P)
    occurrenceCode: extractField(line, POS.MOVEMENT_CODE.start, POS.MOVEMENT_CODE.end),

    // Agency (08.3P)
    agency: extractField(line, POS.AGENCY.start, POS.AGENCY.end),

    // Agency digit (09.3P)
    agencyDigit: extractField(line, POS.AGENCY_DIGIT.start, POS.AGENCY_DIGIT.end) || undefined,

    // Account number (10.3P)
    account: extractField(line, POS.ACCOUNT.start, POS.ACCOUNT.end),

    // Account digit (11.3P)
    accountDigit: extractField(line, POS.ACCOUNT_DIGIT.start, POS.ACCOUNT_DIGIT.end),

    // Full account digit (12.3P)
    fullAccountDigit: extractField(line, POS.ACCOUNT_DV.start, POS.ACCOUNT_DV.end) || undefined,

    // Our number (13.3P)
    ourNumber: extractField(line, POS.DOCUMENT_NUMBER.start, POS.DOCUMENT_NUMBER.end),

    // Portfolio code (14.3P)
    portfolioCode: extractField(line, POS.PORTFOLIO.start, POS.PORTFOLIO.end),

    // Form type (15.3P)
    formType:
      extractField(line, POS.REGISTRATION_FORM.start, POS.REGISTRATION_FORM.end) || undefined,

    // Document type (16.3P)
    ourNumberDigit: extractField(line, POS.DOCUMENT_TYPE.start, POS.DOCUMENT_TYPE.end) || undefined,

    // Boleto emission (17.3P)
    issuanceType:
      extractField(line, POS.BOLETO_EMISSION.start, POS.BOLETO_EMISSION.end) || undefined,

    // Boleto distribution (18.3P)
    distributionType:
      extractField(line, POS.BOLETO_DISTRIBUTION.start, POS.BOLETO_DISTRIBUTION.end) || undefined,

    // Billing document number (19.3P)
    documentNumber: extractField(
      line,
      POS.BILLING_DOCUMENT_NUMBER.start,
      POS.BILLING_DOCUMENT_NUMBER.end,
    ),

    // Due date (20.3P) - required
    dueDate,

    // Amount (21.3P)
    amount: parseDecimalField(line, POS.AMOUNT.start, POS.AMOUNT.end, 2),

    // Collection agency (22.3P)
    collectionAgency:
      extractField(line, POS.COLLECTION_AGENCY.start, POS.COLLECTION_AGENCY.end) || undefined,

    // Collection agency digit (23.3P)
    collectionAgencyDigit:
      extractField(line, POS.COLLECTION_AGENCY_DIGIT.start, POS.COLLECTION_AGENCY_DIGIT.end) ||
      undefined,

    // Document species (24.3P)
    speciesCode: extractField(line, POS.DOCUMENT_SPECIES.start, POS.DOCUMENT_SPECIES.end),

    // Acceptance (25.3P)
    acceptance: extractField(line, POS.ACCEPTANCE.start, POS.ACCEPTANCE.end),

    // Issue date (26.3P) - required
    issueDate,

    // Interest code (27.3P)
    interestCode: extractField(line, POS.INTEREST_CODE.start, POS.INTEREST_CODE.end) || undefined,

    // Interest date (28.3P)
    interestDate: parseDateField(line, POS.INTEREST_DATE.start, POS.INTEREST_DATE.end) || undefined,

    // Interest amount (29.3P)
    interestAmount:
      parseDecimalField(line, POS.INTEREST_AMOUNT.start, POS.INTEREST_AMOUNT.end, 2) || undefined,

    // Discount code (30.3P)
    discountCode: extractField(line, POS.DISCOUNT_CODE.start, POS.DISCOUNT_CODE.end) || undefined,

    // Discount date (31.3P)
    discountDate: parseDateField(line, POS.DISCOUNT_DATE.start, POS.DISCOUNT_DATE.end) || undefined,

    // Discount amount (32.3P)
    discountAmount:
      parseDecimalField(line, POS.DISCOUNT_AMOUNT.start, POS.DISCOUNT_AMOUNT.end, 2) || undefined,

    // IOF amount (33.3P)
    iofAmount: parseDecimalField(line, POS.IOF_AMOUNT.start, POS.IOF_AMOUNT.end, 2) || undefined,

    // Rebate amount (34.3P)
    rebateAmount:
      parseDecimalField(line, POS.REBATE_AMOUNT.start, POS.REBATE_AMOUNT.end, 2) || undefined,

    // Company identification (35.3P)
    cnabReserved2:
      extractField(line, POS.COMPANY_IDENTIFICATION.start, POS.COMPANY_IDENTIFICATION.end) ||
      undefined,

    // Protest code (36.3P)
    protestCode: extractField(line, POS.PROTEST_CODE.start, POS.PROTEST_CODE.end) || undefined,

    // Protest days (37.3P)
    protestDays: parseNumericField(line, POS.PROTEST_DAYS.start, POS.PROTEST_DAYS.end) || undefined,

    // Low/Return code (38.3P)
    writeOffCode:
      extractField(line, POS.LOW_RETURN_CODE.start, POS.LOW_RETURN_CODE.end) || undefined,

    // Low/Return days (39.3P)
    writeOffDays:
      parseNumericField(line, POS.LOW_RETURN_DAYS.start, POS.LOW_RETURN_DAYS.end) || undefined,

    // Currency code (40.3P)
    currencyCode: extractField(line, POS.CURRENCY_CODE.start, POS.CURRENCY_CODE.end),

    // Contract number (41.3P)
    agreementNumber:
      extractField(line, POS.CONTRACT_NUMBER.start, POS.CONTRACT_NUMBER.end) || undefined,
  };
}
