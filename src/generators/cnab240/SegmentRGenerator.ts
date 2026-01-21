import { SegmentR } from '../../types';
import {
  buildLine,
  formatDateField,
  formatDecimalField,
  formatField,
  formatNumericField,
} from './LineGenerator';

/**
 * CNAB240 Segment R Generator
 *
 * Generates Segment R lines (type 3 - detail segment R) for CNAB240 files.
 * Segment R contains additional discount, fine, and interest details.
 * This segment is optional and may follow Segment Q.
 *
 * @see FEBRABAN CNAB240 Specification - Segmento R (Opcional)
 */
export class SegmentRGenerator {
  /**
   * Generates a CNAB240 Segment R line (240 characters)
   *
   * @param segment - The segment R data
   * @returns A 240-character string representing the segment R line
   * @throws Error if required fields are missing
   */
  generate(segment: SegmentR): string {
    this.validate(segment);

    const fields = new Map<string, string>();

    // Positions 1-3: Bank code
    fields.set('bankCode', formatNumericField(Number(segment.bankCode), 1, 3));

    // Positions 4-7: Batch number
    fields.set('batchNumber', formatNumericField(segment.batchNumber, 4, 7));

    // Position 8: Record type - Always "3" for detail
    fields.set('recordType', '3');

    // Positions 9-13: Sequential number within batch
    fields.set('sequentialNumber', formatNumericField(segment.sequentialNumber, 9, 13));

    // Position 14: Segment code - Always "R"
    fields.set('segmentCode', 'R');

    // Position 15: CNAB reserved
    fields.set('cnabReserved1', ' ');

    // Positions 16-17: Occurrence/Movement code
    fields.set('occurrenceCode', formatField(segment.occurrenceCode, 16, 17, 'numeric'));

    // Positions 18-41: Second discount
    // Position 18: Discount 2 code
    fields.set('discount2Code', formatField(segment.discount2Code || '0', 18, 18, 'numeric'));

    // Positions 19-26: Discount 2 date (DDMMYYYY)
    fields.set('discount2Date', formatDateField(segment.discount2Date, 19, 26));

    // Positions 27-41: Discount 2 amount/percentage (15 digits, 2 implied decimals)
    fields.set('discount2Amount', formatDecimalField(segment.discount2Amount || 0, 27, 41, 2));

    // Positions 42-65: Third discount
    // Position 42: Discount 3 code
    fields.set('discount3Code', formatField(segment.discount3Code || '0', 42, 42, 'numeric'));

    // Positions 43-50: Discount 3 date (DDMMYYYY)
    fields.set('discount3Date', formatDateField(segment.discount3Date, 43, 50));

    // Positions 51-65: Discount 3 amount/percentage (15 digits, 2 implied decimals)
    fields.set('discount3Amount', formatDecimalField(segment.discount3Amount || 0, 51, 65, 2));

    // Positions 66-89: Fine
    // Position 66: Fine code
    fields.set('fineCode', formatField(segment.fineCode || '0', 66, 66, 'numeric'));

    // Positions 67-74: Fine date (DDMMYYYY)
    fields.set('fineDate', formatDateField(segment.fineDate, 67, 74));

    // Positions 75-89: Fine amount/percentage (15 digits, 2 implied decimals)
    fields.set('fineAmount', formatDecimalField(segment.fineAmount || 0, 75, 89, 2));

    // Positions 90-129: Payer information (message line 3)
    fields.set('payerInformation', formatField(segment.payerInformation || '', 90, 129, 'text'));

    // Positions 130-169: Payer information 2 (message line 4)
    fields.set('payerInformation2', formatField(segment.payerInformation2 || '', 130, 169, 'text'));

    // Positions 170-240: CNAB reserved (71 spaces)
    fields.set('cnabReserved2', ' '.repeat(71));

    // Build and return the line
    const line = buildLine(fields);

    // Validate line length
    if (line.length !== 240) {
      throw new Error(`Generated line has invalid length: ${line.length} (expected 240)`);
    }

    return line;
  }

  /**
   * Validates required fields for Segment R
   *
   * @param segment - The segment R data to validate
   * @throws Error if required fields are missing or invalid
   */
  private validate(segment: SegmentR): void {
    if (!segment.bankCode) {
      throw new Error('Bank code is required');
    }

    if (segment.batchNumber === undefined || segment.batchNumber === null) {
      throw new Error('Batch number is required');
    }

    if (segment.sequentialNumber === undefined || segment.sequentialNumber === null) {
      throw new Error('Sequential number is required');
    }

    if (!segment.occurrenceCode) {
      throw new Error('Occurrence code is required');
    }

    // Validate discount 2 consistency
    if (segment.discount2Code && segment.discount2Code !== '0') {
      if (!segment.discount2Date) {
        throw new Error('Discount 2 date is required when discount 2 code is set');
      }
      if (segment.discount2Amount === undefined || segment.discount2Amount === null) {
        throw new Error('Discount 2 amount is required when discount 2 code is set');
      }
    }

    // Validate discount 3 consistency
    if (segment.discount3Code && segment.discount3Code !== '0') {
      if (!segment.discount3Date) {
        throw new Error('Discount 3 date is required when discount 3 code is set');
      }
      if (segment.discount3Amount === undefined || segment.discount3Amount === null) {
        throw new Error('Discount 3 amount is required when discount 3 code is set');
      }
    }

    // Validate fine consistency
    if (segment.fineCode && segment.fineCode !== '0') {
      if (!segment.fineDate) {
        throw new Error('Fine date is required when fine code is set');
      }
      if (segment.fineAmount === undefined || segment.fineAmount === null) {
        throw new Error('Fine amount is required when fine code is set');
      }
    }
  }
}
