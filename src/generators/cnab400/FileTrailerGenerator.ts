/**
 * CNAB400 File Trailer Generator
 *
 * Generates the file trailer record (Type 9) for CNAB400 files.
 *
 * @module generators/cnab400/FileTrailerGenerator
 */

import { FILE_TRAILER_SIZES } from '../../constants/cnab400';
import type { FileTrailer } from '../../types/cnab400';
import { formatDecimal } from '../../utils/formatters';
import { padLeft } from '../../utils/generators';

/**
 * Generates file trailer record (Type 9)
 *
 * Creates the 400-character trailer line containing file totals and record count.
 *
 * @param trailer - FileTrailer data object
 * @returns 400-character trailer line
 *
 * @example
 * ```typescript
 * const trailer: FileTrailer = {
 *   recordType: '9',
 *   totalRecords: 152,
 *   totalAmount: 12500.50,
 *   sequentialNumber: 152
 * };
 *
 * const line = generateFileTrailer(trailer);
 * // Returns: 400-character string starting with '9000152...'
 * ```
 */
export function generateFileTrailer(trailer: FileTrailer): string {
  let line = '';

  // Position 001-001: Record type
  line += '9';

  // Position 002-007: Total records (including header and trailer)
  line += padLeft(trailer.totalRecords, FILE_TRAILER_SIZES.TOTAL_RECORDS, '0');

  // Position 008-020: Total amount (13 positions, implied 2 decimals) - optional
  if (trailer.totalAmount) {
    line += formatDecimal(trailer.totalAmount, FILE_TRAILER_SIZES.TOTAL_AMOUNT, 2);
  } else {
    line += padLeft('0', FILE_TRAILER_SIZES.TOTAL_AMOUNT, '0');
  }

  // Position 021-027: Zeros
  line += '0000000';

  // Position 028-394: Blank
  line += ' '.repeat(367);

  // Position 395-400: Sequential number
  line += padLeft(trailer.sequentialNumber || trailer.totalRecords, 6, '0');

  return line;
}
