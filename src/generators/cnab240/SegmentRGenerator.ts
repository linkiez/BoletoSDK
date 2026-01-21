import { LINE_LENGTH, RECORD_TYPE, SEGMENT_R_POSITIONS } from '../../constants/cnab240';
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

    const POS = SEGMENT_R_POSITIONS;
    const fields = new Map<string, string>();

    // Positions 1-3: Bank code
    fields.set(
      'bankCode',
      formatNumericField(Number(segment.bankCode), POS.BANK_CODE.start, POS.BANK_CODE.end),
    );

    // Positions 4-7: Batch number
    fields.set(
      'batchNumber',
      formatNumericField(segment.batchNumber, POS.BATCH_NUMBER.start, POS.BATCH_NUMBER.end),
    );

    // Position 8: Record type - Always "3" for detail
    fields.set('recordType', RECORD_TYPE.DETAIL);

    // Positions 9-13: Sequential number within batch
    fields.set(
      'sequentialNumber',
      formatNumericField(segment.sequentialNumber, POS.RECORD_NUMBER.start, POS.RECORD_NUMBER.end),
    );

    // Position 14: Segment code - Always "R"
    fields.set('segmentCode', 'R');

    // Position 15: CNAB reserved
    fields.set('cnabReserved1', ' ');

    // Positions 16-17: Occurrence/Movement code
    fields.set(
      'occurrenceCode',
      formatField(
        segment.occurrenceCode,
        POS.MOVEMENT_CODE.start,
        POS.MOVEMENT_CODE.end,
        'numeric',
      ),
    );

    // Positions 18-41: Second discount
    // Position 18: Discount 2 code
    fields.set(
      'discount2Code',
      formatField(
        segment.discount2Code || '0',
        POS.DISCOUNT_2_CODE.start,
        POS.DISCOUNT_2_CODE.end,
        'numeric',
      ),
    );

    // Positions 19-26: Discount 2 date (DDMMYYYY)
    fields.set(
      'discount2Date',
      formatDateField(segment.discount2Date, POS.DISCOUNT_2_DATE.start, POS.DISCOUNT_2_DATE.end),
    );

    // Positions 27-41: Discount 2 amount/percentage (15 digits, 2 implied decimals)
    fields.set(
      'discount2Amount',
      formatDecimalField(
        segment.discount2Amount || 0,
        POS.DISCOUNT_2_AMOUNT.start,
        POS.DISCOUNT_2_AMOUNT.end,
        2,
      ),
    );

    // Positions 42-65: Third discount
    // Position 42: Discount 3 code
    fields.set(
      'discount3Code',
      formatField(
        segment.discount3Code || '0',
        POS.DISCOUNT_3_CODE.start,
        POS.DISCOUNT_3_CODE.end,
        'numeric',
      ),
    );

    // Positions 43-50: Discount 3 date (DDMMYYYY)
    fields.set(
      'discount3Date',
      formatDateField(segment.discount3Date, POS.DISCOUNT_3_DATE.start, POS.DISCOUNT_3_DATE.end),
    );

    // Positions 51-65: Discount 3 amount/percentage (15 digits, 2 implied decimals)
    fields.set(
      'discount3Amount',
      formatDecimalField(
        segment.discount3Amount || 0,
        POS.DISCOUNT_3_AMOUNT.start,
        POS.DISCOUNT_3_AMOUNT.end,
        2,
      ),
    );

    // Positions 66-89: Fine
    // Position 66: Fine code
    fields.set(
      'fineCode',
      formatField(segment.fineCode || '0', POS.FINE_CODE.start, POS.FINE_CODE.end, 'numeric'),
    );

    // Positions 67-74: Fine date (DDMMYYYY)
    fields.set(
      'fineDate',
      formatDateField(segment.fineDate, POS.FINE_DATE.start, POS.FINE_DATE.end),
    );

    // Positions 75-89: Fine amount/percentage (15 digits, 2 implied decimals)
    fields.set(
      'fineAmount',
      formatDecimalField(segment.fineAmount || 0, POS.FINE_AMOUNT.start, POS.FINE_AMOUNT.end, 2),
    );

    // Payer info (17.3R) - positions 90-99
    fields.set(
      'payerInfo',
      formatField(segment.payerInfo || '', POS.PAYER_INFO.start, POS.PAYER_INFO.end, 'text'),
    );

    // Message 3 (18.3R) - positions 100-139
    fields.set(
      'payerInformation',
      formatField(segment.payerInformation || '', POS.MESSAGE_3.start, POS.MESSAGE_3.end, 'text'),
    );

    // Message 4 (19.3R) - positions 140-179
    fields.set(
      'payerInformation2',
      formatField(segment.payerInformation2 || '', POS.MESSAGE_4.start, POS.MESSAGE_4.end, 'text'),
    );

    // Reserved 2 (20.3R) - positions 180-199
    fields.set('cnabReserved2', formatField('', POS.RESERVED_2.start, POS.RESERVED_2.end, 'text'));

    // Occurrence code complement (21.3R) - positions 200-207
    fields.set(
      'occurrenceCodeComplement',
      formatField(
        segment.occurrenceCodeComplement || '',
        POS.OCCURRENCE_CODE_COMPLEMENT.start,
        POS.OCCURRENCE_CODE_COMPLEMENT.end,
        'text',
      ),
    );

    // Debit bank code (22.3R) - positions 208-210
    fields.set(
      'debitBankCode',
      formatField(
        segment.debitBankCode || '',
        POS.DEBIT_BANK_CODE.start,
        POS.DEBIT_BANK_CODE.end,
        'text',
      ),
    );

    // Debit agency (23.3R) - positions 211-215
    fields.set(
      'debitAgency',
      formatField(segment.debitAgency || '', POS.DEBIT_AGENCY.start, POS.DEBIT_AGENCY.end, 'text'),
    );

    // Debit agency digit (24.3R) - positions 216-216
    fields.set(
      'debitAgencyDigit',
      formatField(
        segment.debitAgencyDigit || '',
        POS.DEBIT_AGENCY_DIGIT.start,
        POS.DEBIT_AGENCY_DIGIT.end,
        'text',
      ),
    );

    // Debit account (25.3R) - positions 217-228
    fields.set(
      'debitAccount',
      formatField(
        segment.debitAccount || '',
        POS.DEBIT_ACCOUNT.start,
        POS.DEBIT_ACCOUNT.end,
        'text',
      ),
    );

    // Debit account digit (26.3R) - positions 229-229
    fields.set(
      'debitAccountDigit',
      formatField(
        segment.debitAccountDigit || '',
        POS.DEBIT_ACCOUNT_DIGIT.start,
        POS.DEBIT_ACCOUNT_DIGIT.end,
        'text',
      ),
    );

    // Debit account DV (27.3R) - positions 230-230
    fields.set(
      'debitAccountDV',
      formatField(
        segment.debitAccountDV || '',
        POS.DEBIT_ACCOUNT_DV.start,
        POS.DEBIT_ACCOUNT_DV.end,
        'text',
      ),
    );

    // Debit notice emission (28.3R) - positions 231-231
    fields.set(
      'debitNoticeEmission',
      formatField(
        segment.debitNoticeEmission || '',
        POS.DEBIT_NOTICE_EMISSION.start,
        POS.DEBIT_NOTICE_EMISSION.end,
        'text',
      ),
    );

    // Reserved 3 (29.3R) - positions 232-240
    fields.set('cnabReserved3', formatField('', POS.RESERVED_3.start, POS.RESERVED_3.end, 'text'));

    // Build and return the line
    const line = buildLine(fields);

    // Validate line length
    if (line.length !== LINE_LENGTH) {
      throw new Error(
        `Generated line has invalid length: ${line.length} (expected ${LINE_LENGTH})`,
      );
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
