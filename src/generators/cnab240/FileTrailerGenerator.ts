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

    // Positions 1-3: Bank code (3 numeric)
    fields.set('bankCode', formatNumericField(Number(trailer.bankCode), 1, 3));

    // Positions 4-7: Batch number (always 9999 for file trailer)
    fields.set('batchNumber', formatField('9999', 4, 7, 'numeric'));

    // Position 8: Record type (always 9 for file trailer)
    fields.set('recordType', formatField('9', 8, 8, 'numeric'));

    // Positions 9-17: Reserved (spaces)
    fields.set('reserved1', formatField('', 9, 17, 'text'));

    // Positions 18-23: Total batches in file (6 numeric)
    fields.set('totalBatches', formatNumericField(trailer.totalBatches, 18, 23));

    // Positions 24-29: Total records in file (6 numeric)
    fields.set('totalRecords', formatNumericField(trailer.totalRecords, 24, 29));

    // Positions 30-35: Total accounts (6 numeric, optional)
    fields.set('totalAccounts', formatNumericField(trailer.totalAccounts || 0, 30, 35));

    // Positions 36-240: Reserved (spaces)
    fields.set('reserved2', formatField('', 36, 240, 'text'));

    const line = buildLine(fields);

    // Validate line length
    if (line.length !== 240) {
      throw new Error(`Invalid file trailer length: expected 240, got ${line.length}`);
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
