/**
 * CNAB400 Guarantor Record Parser
 *
 * @module parsers/cnab400/GuarantorRecordParser
 */

import { LINE_LENGTH } from '../../constants/cnab400';
import { ParseError } from '../../errors';
import type { GuarantorRecord } from '../../types/cnab400';
import { parseNumber } from '../../utils/parsers';

/**
 * Parses guarantor record (Type 5)
 *
 * @param line - 400-character guarantor line
 * @returns Parsed GuarantorRecord object
 * @throws ParseError if line is invalid
 */
export function parseGuarantorRecord(line: string): GuarantorRecord {
  if (line.length !== LINE_LENGTH) {
    throw new ParseError(`Invalid guarantor line length: ${line.length}`);
  }

  if (!line.startsWith('5')) {
    throw new ParseError(`Invalid record type for guarantor: ${line.charAt(0)}`);
  }

  return {
    recordType: '5',
    companyRegistrationType: line.substring(1, 3) as '01' | '02',
    companyRegistrationNumber: line.substring(3, 17).trim(),
    documentNumber: line.substring(87, 97).trim(),
    guarantorName: line.substring(214, 244).trim(),
    guarantorAddress: line.substring(244, 289).trim() || undefined,
    guarantorZipCode: line.substring(289, 297).trim() || undefined,
    guarantorCity: line.substring(297, 312).trim() || undefined,
    guarantorState: line.substring(312, 314).trim() || undefined,
    sequentialNumber: parseNumber(line.substring(LINE_LENGTH - 6, LINE_LENGTH).trim()),
  };
}
