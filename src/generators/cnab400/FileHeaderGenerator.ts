/**
 * CNAB400 File Header Generator
 *
 * Generates the file header record (Type 0) for CNAB400 files.
 *
 * @module generators/cnab400/FileHeaderGenerator
 */

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
 *   bankName: 'BANCO ITAU S.A.',
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
  line += padRight(header.operationLiteral || 'RETORNO', 7, ' ');

  // Position 010-011: Service code
  line += padLeft(header.serviceCode || '01', 2, '0');

  // Position 012-026: Service literal
  line += padRight(header.serviceLiteral || 'COBRANCA', 15, ' ');

  // Position 027-030: Agency
  line += padLeft(header.agency || '0', 4, '0');

  // Position 031-032: Zeros
  line += '00';

  // Position 033-037: Account
  line += padLeft(header.account || '0', 5, '0');

  // Position 038-038: Account digit
  line += padLeft(header.accountDigit || '0', 1, '0');

  // Position 039-046: Blank/spaces (8 positions)
  line += '        ';

  // Position 047-076: Company name
  line += padRight(header.companyName || '', 30, ' ');

  // Position 077-079: Bank code
  line += padLeft(header.bankCode, 3, '0');

  // Position 080-094: Bank name
  line += padRight(header.bankName || 'BANCO ITAU S.A.', 15, ' ');

  // Position 095-100: Generation date (DDMMYY)
  line += formatDateShort(header.generationDate);

  // Position 101-108: Density (blank for electronic)
  line += '        ';

  // Position 109-110: Density unit (blank)
  line += '  ';

  // Position 111-115: Sequential number
  line += padLeft(header.sequenceNumber || 1, 5, '0');

  // Position 116-120: Creation date (DDMMYY) - optional
  if (header.creationDate) {
    line += formatDateShort(header.creationDate);
  } else {
    line += '      ';
  }

  // Position 121-400: Fill with spaces to complete 400 characters
  line = padRight(line, 400, ' ');

  return line;
}
