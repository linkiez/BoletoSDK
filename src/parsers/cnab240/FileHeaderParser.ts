/**
 * CNAB240 File Header Parser
 *
 * Parses the file header record (type 0) of a CNAB240 file.
 *
 * @module parsers/cnab240/FileHeaderParser
 */

import { FILE_HEADER_POSITIONS } from '../../constants/cnab240';
import { FileHeader } from '../../types/cnab240';
import { extractField, parseDateField, parseNumericField, validateRecordType } from './LineParser';

/**
 * Parse CNAB240 file header (record type 0)
 *
 * @param line - The 240-character file header line
 * @returns Parsed FileHeader object
 *
 * @example
 * ```typescript
 * const header = parseFileHeader(headerLine);
 * console.log(header.bankCode); // "341"
 * ```
 */
export function parseFileHeader(line: string): FileHeader {
  const POS = FILE_HEADER_POSITIONS;

  // Validate record type
  validateRecordType(line, '0');

  return {
    // Bank code (01.0)
    bankCode: extractField(line, POS.BANK_CODE.start, POS.BANK_CODE.end),

    // Batch number (02.0)
    batchNumber: extractField(line, POS.BATCH_NUMBER.start, POS.BATCH_NUMBER.end),

    // Record type (03.0)
    recordType: extractField(line, POS.RECORD_TYPE.start, POS.RECORD_TYPE.end),

    // Company person type (11.0)
    companyRegistrationType: extractField(line, POS.PERSON_TYPE.start, POS.PERSON_TYPE.end),

    // Company tax ID (12.0)
    companyRegistrationNumber: extractField(line, POS.TAX_ID.start, POS.TAX_ID.end),

    // Agreement code (13.0)
    agreementCode:
      extractField(line, POS.AGREEMENT_CODE.start, POS.AGREEMENT_CODE.end) || undefined,

    // Agency (14.0)
    agency: extractField(line, POS.AGENCY.start, POS.AGENCY.end),

    // Agency digit (15.0)
    agencyDigit: extractField(line, POS.AGENCY_DIGIT.start, POS.AGENCY_DIGIT.end) || undefined,

    // Account (16.0)
    account: extractField(line, POS.ACCOUNT.start, POS.ACCOUNT.end),

    // Account digit (17.0)
    accountDigit: extractField(line, POS.ACCOUNT_DIGIT.start, POS.ACCOUNT_DIGIT.end),

    // Account DV (18.0)
    fullAccountDigit: extractField(line, POS.ACCOUNT_DV.start, POS.ACCOUNT_DV.end) || undefined,

    // Company name (19.0)
    companyName: extractField(line, POS.COMPANY_NAME.start, POS.COMPANY_NAME.end),

    // Bank name (20.0)
    bankName: extractField(line, POS.BANK_NAME.start, POS.BANK_NAME.end),

    // File code (23.0)
    fileCode: extractField(line, POS.FILE_CODE.start, POS.FILE_CODE.end),

    // Generation date (24.0)
    generationDate:
      parseDateField(line, POS.GENERATION_DATE.start, POS.GENERATION_DATE.end) || new Date(),

    // Generation time (25.0)
    generationTime:
      extractField(line, POS.GENERATION_TIME.start, POS.GENERATION_TIME.end) || undefined,

    // File sequence (26.0)
    sequentialNumber: parseNumericField(line, POS.FILE_SEQUENCE.start, POS.FILE_SEQUENCE.end),

    // Layout version (27.0)
    layoutVersion: extractField(line, POS.LAYOUT_VERSION.start, POS.LAYOUT_VERSION.end),

    // Density (28.0)
    density: extractField(line, POS.FILE_DENSITY.start, POS.FILE_DENSITY.end) || undefined,

    // Bank reserved (29.0)
    bankReserved: extractField(line, POS.RESERVED_BANK.start, POS.RESERVED_BANK.end) || undefined,

    // Company reserved (30.0)
    companyReserved:
      extractField(line, POS.RESERVED_COMPANY.start, POS.RESERVED_COMPANY.end) || undefined,

    // CNAB reserved (31.0)
    cnabReserved3: extractField(line, POS.RESERVED_3.start, POS.RESERVED_3.end) || undefined,
  };
}
