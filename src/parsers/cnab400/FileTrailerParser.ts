/**
 * CNAB400 File Trailer Parser
 *
 * @module parsers/cnab400/FileTrailerParser
 */

import { ParseError } from '../../errors';
import type { FileTrailer } from '../../types/cnab400';
import { parseDecimal, parseNumber } from '../../utils/parsers';
import { LINE_LENGTH, FILE_TRAILER_POSITIONS } from '../../constants/cnab400';

/**
 * Parses file trailer record (Type 9)
 *
 * @param line - 400-character trailer line
 * @returns Parsed FileTrailer object
 * @throws ParseError if line is invalid
 */
export function parseFileTrailer(line: string): FileTrailer {
  if (line.length !== LINE_LENGTH) {
    throw new ParseError(`Invalid trailer line length: ${line.length}`);
  }

  if (!line.startsWith('9')) {
    throw new ParseError(`Invalid record type for trailer: ${line.charAt(0)}`);
  }

  const { TOTAL_RECORDS, TOTAL_AMOUNT, SEQUENTIAL_NUMBER } = FILE_TRAILER_POSITIONS;

  const totalRecordsStr = line.substring(TOTAL_RECORDS.start - 1, TOTAL_RECORDS.end).trim();
  const totalAmountStr = line.substring(TOTAL_AMOUNT.start - 1, TOTAL_AMOUNT.end).trim();

  return {
    recordType: '9',
    totalRecords: totalRecordsStr ? parseNumber(totalRecordsStr) : 0,
    totalAmount: totalAmountStr ? parseDecimal(totalAmountStr, 2) : 0,
    sequentialNumber: parseNumber(
      line.substring(SEQUENTIAL_NUMBER.start - 1, SEQUENTIAL_NUMBER.end).trim(),
    ),
  };
}
