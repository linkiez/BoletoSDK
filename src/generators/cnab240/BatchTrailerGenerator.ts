import { LINE_LENGTH, RECORD_TYPE } from '../../constants/cnab240';
import { BatchTrailer } from '../../types/cnab240';
import { buildLine, formatField, formatNumericField } from './LineGenerator';

/**
 * Generates CNAB240 Batch Trailer (Record Type 5)
 *
 * The batch trailer closes each batch and contains totals for the batch.
 *
 * @example
 * ```typescript
 * const generator = new BatchTrailerGenerator();
 * const trailer: BatchTrailer = {
 *   bankCode: '341',
 *   batchNumber: 1,
 *   recordType: '5',
 *   totalRecords: 4,
 *   totalSimpleSlips: 2,
 *   totalSimpleAmount: 10050
 * };
 * const line = generator.generate(trailer);
 * ```
 */
export class BatchTrailerGenerator {
  /**
   * Generates a CNAB240 batch trailer line (240 characters)
   *
   * Field positions (1-indexed as per FEBRABAN spec):
   * - 001-003 (3): Bank code
   * - 004-007 (4): Batch number (must match batch header)
   * - 008-008 (1): Record type (always 5 for batch trailer)
   * - 009-017 (9): Reserved (spaces)
   * - 018-023 (6): Total records in batch
   * - 024-029 (6): Total simple slips quantity
   * - 030-047 (18): Total simple slips amount (in cents, 2 implied decimals)
   * - 048-053 (6): Total endorsed slips quantity
   * - 054-071 (18): Total endorsed slips amount
   * - 072-077 (6): Total collection slips quantity
   * - 078-095 (18): Total collection slips amount
   * - 096-103 (8): Reference number (optional)
   * - 104-240 (137): Reserved (spaces)
   *
   * @param trailer - Batch trailer data
   * @returns 240-character CNAB240 batch trailer line
   * @throws Error if validation fails
   */
  public generate(trailer: BatchTrailer): string {
    this.validate(trailer);

    const fields = new Map<string, string>();

    // Positions 1-3: Bank code (3 numeric)
    fields.set('bankCode', formatNumericField(Number(trailer.bankCode), 1, 3));

    // Positions 4-7: Batch number (4 numeric)
    fields.set('batchNumber', formatNumericField(Number(trailer.batchNumber), 4, 7));

    // Position 8: Record type (always 5 for batch trailer)
    fields.set('recordType', formatField(RECORD_TYPE.BATCH_TRAILER, 8, 8, 'numeric'));

    // Positions 9-17: Reserved (spaces)
    fields.set('reserved1', formatField('', 9, 17, 'text'));

    // Positions 18-23: Total records in batch (6 numeric)
    fields.set('totalRecords', formatNumericField(trailer.totalRecords, 18, 23));

    // Positions 24-29: Total simple slips quantity (6 numeric, optional)
    fields.set('totalSimpleSlips', formatNumericField(trailer.totalSimpleSlips || 0, 24, 29));

    // Positions 30-47: Total simple slips amount (18 numeric, optional)
    fields.set('totalSimpleAmount', formatNumericField(trailer.totalSimpleAmount || 0, 30, 47));

    // Positions 48-53: Total endorsed slips quantity (6 numeric, optional)
    fields.set('totalEndorsedSlips', formatNumericField(trailer.totalEndorsedSlips || 0, 48, 53));

    // Positions 54-71: Total endorsed slips amount (18 numeric, optional)
    fields.set('totalEndorsedAmount', formatNumericField(trailer.totalEndorsedAmount || 0, 54, 71));

    // Positions 72-77: Total collection slips quantity (6 numeric, optional)
    fields.set(
      'totalCollectionSlips',
      formatNumericField(trailer.totalCollectionSlips || 0, 72, 77),
    );

    // Positions 78-95: Total collection slips amount (18 numeric, optional)
    fields.set(
      'totalCollectionAmount',
      formatNumericField(trailer.totalCollectionAmount || 0, 78, 95),
    );

    // Positions 96-103: Reference number (8 text, optional)
    fields.set('referenceNumber', formatField(trailer.warningCode || '', 96, 103, 'text'));

    // Positions 104-240: Reserved (spaces)
    fields.set('reserved2', formatField('', 104, LINE_LENGTH, 'text'));

    const line = buildLine(fields);

    // Validate line length
    if (line.length !== LINE_LENGTH) {
      throw new Error(`Invalid batch trailer length: expected ${LINE_LENGTH}, got ${line.length}`);
    }

    return line;
  }

  /**
   * Validates required fields in batch trailer
   *
   * @param trailer - Batch trailer to validate
   * @throws Error if required fields are missing or invalid
   */
  private validate(trailer: BatchTrailer): void {
    if (!trailer.bankCode) {
      throw new Error('Bank code is required');
    }

    if (trailer.batchNumber === undefined || trailer.batchNumber === null) {
      throw new Error('Batch number is required');
    }

    if (!trailer.recordType) {
      throw new Error('Record type is required');
    }

    if (trailer.totalRecords === undefined || trailer.totalRecords === null) {
      throw new Error('Total records is required');
    }
  }
}
