/**
 * CNAB240 File Header Parser
 *
 * Parses the file header record (type 0) of a CNAB240 file.
 *
 * @module parsers/cnab240/FileHeaderParser
 */

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
  // Validate record type
  validateRecordType(line, '0');

  return {
    // Positions 1-3: Bank code
    bankCode: extractField(line, 1, 3),

    // Positions 4-7: Batch number (always "0000" for file header)
    batchNumber: extractField(line, 4, 7),

    // Position 8: Record type (always "0")
    recordType: extractField(line, 8, 8),

    // Positions 18-18: Company registration type (0=CPF, 1=CNPJ, 2=PIS/PASEP)
    companyRegistrationType: extractField(line, 18, 18),

    // Positions 19-32: Company registration number (CPF/CNPJ)
    companyRegistrationNumber: extractField(line, 19, 32),

    // Positions 33-52: Agreement code (optional, bank-specific)
    agreementCode: extractField(line, 33, 52) || undefined,

    // Positions 53-57: Agency
    agency: extractField(line, 53, 57),

    // Position 58: Agency check digit (optional)
    agencyDigit: extractField(line, 58, 58) || undefined,

    // Positions 59-70: Account number
    account: extractField(line, 59, 70),

    // Position 71: Account check digit
    accountDigit: extractField(line, 71, 71),

    // Position 72: Full account check digit (optional)
    fullAccountDigit: extractField(line, 72, 72) || undefined,

    // Positions 73-102: Company name
    companyName: extractField(line, 73, 102),

    // Positions 103-132: Bank name
    bankName: extractField(line, 103, 132),

    // Positions 143-143: File code (1=Remessa, 2=Retorno)
    fileCode: extractField(line, 143, 143),

    // Positions 144-151: Generation date (DDMMYYYY)
    generationDate: parseDateField(line, 144, 151) || new Date(),

    // Positions 152-157: Generation time (HHMMSS) - optional
    generationTime: extractField(line, 152, 157) || undefined,

    // Positions 158-163: Sequential file number
    sequentialNumber: parseNumericField(line, 158, 163),

    // Positions 164-166: Layout version (e.g., "103" = version 10.3)
    layoutVersion: extractField(line, 164, 166),

    // Positions 167-171: Density (magnetic tape - usually blank)
    density: extractField(line, 167, 171) || undefined,

    // Positions 172-191: Bank reserved
    bankReserved: extractField(line, 172, 191) || undefined,

    // Positions 192-211: Company reserved
    companyReserved: extractField(line, 192, 211) || undefined,

    // Positions 212-240: CNAB reserved
    cnabReserved3: extractField(line, 212, 240) || undefined,
  };
}
