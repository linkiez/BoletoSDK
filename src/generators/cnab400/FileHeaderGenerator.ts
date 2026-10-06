/**
 * CNAB400 File Header Generator
 *
 * Generates the file header record (Type 0) for CNAB400 files.
 *
 * @module generators/cnab400/FileHeaderGenerator
 */

import {
  COMMON_FIELD_SIZES,
  FILE_HEADER_SIZES,
  LINE_LENGTH,
  OPERATION_LITERAL_REMESSA,
  SERVICE_CODE_COBRANCA,
  SERVICE_LITERAL_COBRANCA,
} from '../../constants/cnab400';
import { GenerationError } from '../../errors';
import type { FileHeader } from '../../types/cnab400';
import { formatDateShort } from '../../utils/formatters';
import { padLeft, padRight } from '../../utils/generators';

/**
 * Generates file header record (Type 0)
 *
 * Creates the 400-character header line containing file metadata and company information.
 *
 * @param header - FileHeader data object
 * @returns 400-character header line
 * @throws GenerationError if required fields are missing
 *
 * @example
 * ```typescript
 * const header: FileHeader = {
 *   recordType: '0',
 *   operationType: '1',
 *   operationLiteral: 'REMESSA',
 *   serviceCode: '01',
 *   serviceLiteral: 'COBRANCA',
 *   agency: '1234',
 *   account: '56789',
 *   accountDigit: '0',
 *   companyName: 'ACME Corp',
 *   bankCode: '341',
 *   bankName: 'BANCO ITAU SA',
 *   generationDate: new Date('2026-02-01'),
 *   sequenceNumber: 1
 * };
 *
 * const line = generateFileHeader(header);
 * // Returns: 400-character string starting with '01REMESSA...'
 * ```
 */
export function generateFileHeader(header: FileHeader): string {
  if (!header.bankCode) {
    throw new GenerationError('Bank code is required', 'bankCode');
  }

  let line = '';

  // Position 001-001: Record type
  line += '0';

  // Position 002-002: Operation type (1=Remittance, 2=Return)
  line += header.operationType;

  // Position 003-009: Operation literal
  line += padRight(
    header.operationLiteral || OPERATION_LITERAL_REMESSA,
    FILE_HEADER_SIZES.OPERATION_LITERAL,
    ' ',
  );

  // Position 010-011: Service code
  line += padLeft(header.serviceCode || SERVICE_CODE_COBRANCA, 2, '0');

  // Position 012-026: Service literal
  line += padRight(
    header.serviceLiteral || SERVICE_LITERAL_COBRANCA,
    FILE_HEADER_SIZES.SERVICE_LITERAL,
    ' ',
  );

  // Position 027-030: Agency
  line += padLeft(header.agency || '0', COMMON_FIELD_SIZES.AGENCY, '0');

  // Position 031-032: Zeros
  line += '00';

  // Position 033-037: Account
  line += padLeft(header.account || '0', COMMON_FIELD_SIZES.ACCOUNT, '0');

  // Position 038-038: Account digit
  line += padLeft(header.accountDigit || '0', COMMON_FIELD_SIZES.ACCOUNT_DIGIT, '0');

  // Position 039-046: Blank/spaces (8 positions)
  line += '        ';

  // Position 047-076: Company name
  line += padRight(header.companyName || '', FILE_HEADER_SIZES.COMPANY_NAME, ' ');

  // Position 077-079: Bank code
  line += padLeft(header.bankCode, COMMON_FIELD_SIZES.BANK_CODE, '0');

  // Position 080-094: Bank name
  line += padRight(header.bankName || 'BANCO ITAU SA', FILE_HEADER_SIZES.BANK_NAME, ' ');

  // Position 095-100: Generation date (DDMMYY)
  line += formatDateShort(header.generationDate);

  if (header.operationType === '2') {
    // Positions 101-105 and 106-108: Return-only density fields
    line += padLeft(header.densityCode || '0', FILE_HEADER_SIZES.DENSITY_CODE, '0');
    line += padRight(header.densityUnit || '', FILE_HEADER_SIZES.DENSITY_UNIT, ' ');

    // Positions 109-113 and 114-119: Return file sequence and credit date
    line += padLeft(header.sequenceNumber || 1, FILE_HEADER_SIZES.SEQUENCE_NUMBER, '0');
    line += header.creationDate
      ? formatDateShort(header.creationDate)
      : ' '.repeat(FILE_HEADER_SIZES.CREATION_DATE);

    // Positions 120-394: Return record complement
    line += ' '.repeat(FILE_HEADER_SIZES.RESERVED_275);
  } else {
    // Positions 101-394 are blank in remittance headers
    line += ' '.repeat(FILE_HEADER_SIZES.RESERVED_294);
  }

  // Positions 395-400: Header record sequence number
  line += padLeft(header.sequential || 1, FILE_HEADER_SIZES.SEQUENTIAL_NUMBER, '0');

  return padRight(line, LINE_LENGTH, ' ');
}
