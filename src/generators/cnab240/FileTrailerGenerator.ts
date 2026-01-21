import {
  BATCH_TRAILER_BANK,
  FILE_TRAILER_POSITIONS,
  LINE_LENGTH,
  RECORD_TYPE,
} from '../../constants/cnab240';
import { FileTrailer } from '../../types/cnab240';
import { buildLine, formatField, formatNumericField } from './LineGenerator';

/**
 * Generates CNAB240 File Trailer (Record Type 9)
 *
 * The file trailer is the last line of a CNAB240 file and contains
 * totals for the entire file including batch count and record count.
 *
 * @example
 * ```typescript
 * const generator = new FileTrailerGenerator();
 * const trailer: FileTrailer = {
 *   bankCode: '341',
 *   batchNumber: '9999',
 *   recordType: '9',
 *   totalBatches: 2,
 *   totalRecords: 14,
 *   totalAccounts: 0
 * };
 * const line = generator.generate(trailer);
 * // Returns: "3419999900000000000000000140000000000..."
 * ```
 */
export class FileTrailerGenerator {
  /**
   * Generates a CNAB240 file trailer line (240 characters)
   *
   * Field positions (1-indexed as per FEBRABAN spec):
   * - 001-003 (3): Bank code
   * - 004-007 (4): Batch number (always 9999 for file trailer)
   * - 008-008 (1): Record type (always 9 for file trailer)
   * - 009-017 (9): Reserved (spaces)
   * - 018-023 (6): Total batches in file
   * - 024-029 (6): Total records in file
   * - 030-035 (6): Total accounts (optional, usually 0)
   * - 036-240 (205): Reserved (spaces)
   *
   * @param trailer - File trailer data
   * @returns 240-character CNAB240 file trailer line
   * @throws Error if validation fails
   */
  public generate(trailer: FileTrailer): string {
    this.validate(trailer);

    const fields = new Map<string, string>();
    const POS = FILE_TRAILER_POSITIONS;

    // Positions 1-3: Bank code (3 numeric)
    fields.set(
      'bankCode',
      formatNumericField(Number(trailer.bankCode), POS.BANK_CODE.start, POS.BANK_CODE.end),
    );

    // Positions 4-7: Batch number (always 9999 for file trailer)
    fields.set(
      'batchNumber',
      formatField(BATCH_TRAILER_BANK, POS.BATCH_NUMBER.start, POS.BATCH_NUMBER.end, 'numeric'),
    );

    // Position 8: Record type (always 9 for file trailer)
    fields.set(
      'recordType',
      formatField(RECORD_TYPE.FILE_TRAILER, POS.RECORD_TYPE.start, POS.RECORD_TYPE.end, 'numeric'),
    );

    // Positions 9-17: Reserved (spaces)
    fields.set('reserved1', formatField('', POS.RESERVED_1.start, POS.RESERVED_1.end, 'text'));

    // Positions 18-23: Total batches in file (6 numeric)
    fields.set(
      'totalBatches',
      formatNumericField(trailer.totalBatches, POS.BATCH_COUNT.start, POS.BATCH_COUNT.end),
    );

    // Positions 24-29: Total records in file (6 numeric)
    fields.set(
      'totalRecords',
      formatNumericField(trailer.totalRecords, POS.RECORD_COUNT.start, POS.RECORD_COUNT.end),
    );

    // Positions 30-35: Total accounts (6 numeric, optional)
    fields.set(
      'totalAccounts',
      formatNumericField(
        trailer.totalAccounts || 0,
        POS.ACCOUNT_COUNT.start,
        POS.ACCOUNT_COUNT.end,
      ),
    );

    // Positions 36-240: Reserved (spaces)
    fields.set('reserved2', formatField('', POS.RESERVED_2.start, POS.RESERVED_2.end, 'text'));

    const line = buildLine(fields);

    // Validate line length
    if (line.length !== LINE_LENGTH) {
      throw new Error(`Invalid file trailer length: expected ${LINE_LENGTH}, got ${line.length}`);
    }

    return line;
  }

  /**
   * Validates required fields in file trailer
   *
   * @param trailer - File trailer to validate
   * @throws Error if required fields are missing or invalid
   */
  private validate(trailer: FileTrailer): void {
    if (!trailer.bankCode) {
      throw new Error('Bank code is required');
    }

    if (!trailer.batchNumber) {
      throw new Error('Batch number is required');
    }

    if (!trailer.recordType) {
      throw new Error('Record type is required');
    }

    if (trailer.totalBatches === undefined || trailer.totalBatches === null) {
      throw new Error('Total batches is required');
    }

    if (trailer.totalRecords === undefined || trailer.totalRecords === null) {
      throw new Error('Total records is required');
    }
  }
}
