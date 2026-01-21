/**
 * CNAB400 File Trailer Parser
 *
 * @module parsers/cnab400/FileTrailerParser
 */

import { ParseError } from '../../errors';
import type { FileTrailer } from '../../types/cnab400';
import { parseDecimal, parseNumber } from '../../utils/parsers';

/**
 * Parses file trailer record (Type 9)
 *
 * @param line - 400-character trailer line
 * @returns Parsed FileTrailer object
 * @throws ParseError if line is invalid
 */
export function parseFileTrailer(line: string): FileTrailer {
  if (line.length !== 400) {
    throw new ParseError(`Invalid trailer line length: ${line.length}`);
  }

  if (!line.startsWith('9')) {
    throw new ParseError(`Invalid record type for trailer: ${line.charAt(0)}`);
  }

  const totalRecordsStr = line.substring(1, 7).trim();
  const totalAmountStr = line.substring(7, 20).trim();

  return {
    recordType: '9',
    totalRecords: totalRecordsStr ? parseNumber(totalRecordsStr) : 0,
    totalAmount: totalAmountStr ? parseDecimal(totalAmountStr, 2) : 0,
    sequentialNumber: parseNumber(line.substring(394, 400).trim()),
  };
}
