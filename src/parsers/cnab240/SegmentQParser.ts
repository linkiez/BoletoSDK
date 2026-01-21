/**
 * CNAB240 Segment Q Parser
 *
 * Parses Segment Q (payer information) of a CNAB240 detail record.
 * Segment Q is mandatory and contains payer data.
 *
 * @module parsers/cnab240/SegmentQParser
 */

import { SEGMENT_Q_POSITIONS } from '../../constants/cnab240';
import { SegmentQ } from '../../types/cnab240';
import {
  extractField,
  parseNumericField,
  validateRecordType,
  validateSegmentCode,
} from './LineParser';

/**
 * Parse CNAB240 Segment Q (record type 3, segment Q)
 *
 * @param line - The 240-character segment Q line
 * @returns Parsed SegmentQ object
 *
 * @example
 * ```typescript
 * const segmentQ = parseSegmentQ(segmentQLine);
 * console.log(segmentQ.payerName); // "ACME CORPORATION"
 * ```
 */
export function parseSegmentQ(line: string): SegmentQ {
  const POS = SEGMENT_Q_POSITIONS;

  // Validate record type and segment code
  validateRecordType(line, '3');
  validateSegmentCode(line, 'Q');

  return {
    // Bank code (01.3Q)
    bankCode: extractField(line, POS.BANK_CODE.start, POS.BANK_CODE.end),

    // Batch number (02.3Q)
    batchNumber: parseNumericField(line, POS.BATCH_NUMBER.start, POS.BATCH_NUMBER.end),

    // Record type (03.3Q)
    recordType: extractField(line, POS.RECORD_TYPE.start, POS.RECORD_TYPE.end),

    // Sequential record number (04.3Q)
    sequentialNumber: parseNumericField(line, POS.RECORD_NUMBER.start, POS.RECORD_NUMBER.end),

    // Segment code (05.3Q)
    segmentCode: extractField(line, POS.SEGMENT_CODE.start, POS.SEGMENT_CODE.end),

    // Movement code (07.3Q)
    occurrenceCode: extractField(line, POS.MOVEMENT_CODE.start, POS.MOVEMENT_CODE.end),

    // Payer person type (08.3Q)
    payerRegistrationType: extractField(
      line,
      POS.PAYER_PERSON_TYPE.start,
      POS.PAYER_PERSON_TYPE.end,
    ),

    // Payer tax ID (09.3Q)
    payerTaxId: extractField(line, POS.PAYER_TAX_ID.start, POS.PAYER_TAX_ID.end),

    // Payer name (10.3Q)
    payerName: extractField(line, POS.PAYER_NAME.start, POS.PAYER_NAME.end),

    // Payer address (11.3Q)
    payerAddress: extractField(line, POS.PAYER_ADDRESS.start, POS.PAYER_ADDRESS.end),

    // Payer district (12.3Q)
    payerNeighborhood: extractField(line, POS.PAYER_DISTRICT.start, POS.PAYER_DISTRICT.end),

    // Payer postal code (13.3Q)
    payerPostalCode: extractField(line, POS.PAYER_ZIP_CODE.start, POS.PAYER_ZIP_CODE.end),

    // Payer city (14.3Q)
    payerCity: extractField(line, POS.PAYER_CITY.start, POS.PAYER_CITY.end),

    // Payer state (15.3Q)
    payerState: extractField(line, POS.PAYER_STATE.start, POS.PAYER_STATE.end),

    // Guarantor person type (16.3Q)
    guarantorRegistrationType:
      extractField(line, POS.GUARANTOR_PERSON_TYPE.start, POS.GUARANTOR_PERSON_TYPE.end) ||
      undefined,

    // Guarantor tax ID (17.3Q)
    guarantorTaxId:
      extractField(line, POS.GUARANTOR_TAX_ID.start, POS.GUARANTOR_TAX_ID.end) || undefined,

    // Guarantor name (18.3Q)
    guarantorName:
      extractField(line, POS.GUARANTOR_NAME.start, POS.GUARANTOR_NAME.end) || undefined,

    // Bank correspondent code (19.3Q)
    correspondentBankCode:
      extractField(line, POS.BANK_CORRESPONDENT_CODE.start, POS.BANK_CORRESPONDENT_CODE.end) ||
      undefined,

    // Bank correspondent document (20.3Q)
    correspondentOurNumber:
      extractField(
        line,
        POS.BANK_CORRESPONDENT_DOCUMENT.start,
        POS.BANK_CORRESPONDENT_DOCUMENT.end,
      ) || undefined,
  };
}
