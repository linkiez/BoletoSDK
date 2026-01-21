import { BATCH_TRAILER_POSITIONS, LINE_LENGTH, RECORD_TYPE } from '../../constants/cnab240';
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
    const POS = BATCH_TRAILER_POSITIONS;

    // Positions 1-3: Bank code (3 numeric)
    fields.set(
      'bankCode',
      formatNumericField(Number(trailer.bankCode), POS.BANK_CODE.start, POS.BANK_CODE.end),
    );

    // Positions 4-7: Batch number (4 numeric)
    fields.set(
      'batchNumber',
      formatNumericField(Number(trailer.batchNumber), POS.BATCH_NUMBER.start, POS.BATCH_NUMBER.end),
    );

    // Position 8: Record type (always 5 for batch trailer)
    fields.set(
      'recordType',
      formatField(RECORD_TYPE.BATCH_TRAILER, POS.RECORD_TYPE.start, POS.RECORD_TYPE.end, 'numeric'),
    );

    // Positions 9-17: Reserved (spaces)
    fields.set('reserved1', formatField('', POS.RESERVED_1.start, POS.RESERVED_1.end, 'text'));

    // Positions 18-23: Total records in batch (6 numeric)
    fields.set(
      'totalRecords',
      formatNumericField(trailer.totalRecords, POS.DETAIL_COUNT.start, POS.DETAIL_COUNT.end),
    );

    // Positions 24-29: Total simple slips quantity (6 numeric, optional)
    fields.set(
      'totalSimpleSlips',
      formatNumericField(
        trailer.totalSimpleSlips || 0,
        POS.TOTAL_SIMPLE_SLIPS.start,
        POS.TOTAL_SIMPLE_SLIPS.end,
      ),
    );

    // Positions 30-47: Total simple slips amount (18 numeric, optional)
    fields.set(
      'totalSimpleAmount',
      formatNumericField(
        trailer.totalSimpleAmount || 0,
        POS.TOTAL_SIMPLE_AMOUNT.start,
        POS.TOTAL_SIMPLE_AMOUNT.end,
      ),
    );

    // Positions 48-53: Total endorsed slips quantity (6 numeric, optional)
    fields.set(
      'totalEndorsedSlips',
      formatNumericField(
        trailer.totalEndorsedSlips || 0,
        POS.TOTAL_ENDORSED_SLIPS.start,
        POS.TOTAL_ENDORSED_SLIPS.end,
      ),
    );

    // Positions 54-71: Total endorsed slips amount (18 numeric, optional)
    fields.set(
      'totalEndorsedAmount',
      formatNumericField(
        trailer.totalEndorsedAmount || 0,
        POS.TOTAL_ENDORSED_AMOUNT.start,
        POS.TOTAL_ENDORSED_AMOUNT.end,
      ),
    );

    // Positions 72-77: Total collection slips quantity (6 numeric, optional)
    fields.set(
      'totalCollectionSlips',
      formatNumericField(
        trailer.totalCollectionSlips || 0,
        POS.TOTAL_COLLECTION_SLIPS.start,
        POS.TOTAL_COLLECTION_SLIPS.end,
      ),
    );

    // Positions 78-95: Total collection slips amount (18 numeric, optional)
    fields.set(
      'totalCollectionAmount',
      formatNumericField(
        trailer.totalCollectionAmount || 0,
        POS.TOTAL_COLLECTION_AMOUNT.start,
        POS.TOTAL_COLLECTION_AMOUNT.end,
      ),
    );

    // Positions 96-103: Reference number (8 text, optional)
    fields.set(
      'referenceNumber',
      formatField(trailer.warningCode || '', POS.WARNING_CODE.start, POS.WARNING_CODE.end, 'text'),
    );

    // Positions 104-240: Reserved (spaces)
    fields.set('reserved2', formatField('', POS.RESERVED_2.start, POS.RESERVED_2.end, 'text'));

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
