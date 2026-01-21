/**
 * CNAB240 Segment Q Parser
 *
 * Parses Segment Q (payer information) of a CNAB240 detail record.
 * Segment Q is mandatory and contains payer data.
 *
 * @module parsers/cnab240/SegmentQParser
 */

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
  // Validate record type and segment code
  validateRecordType(line, '3');
  validateSegmentCode(line, 'Q');

  return {
    // Positions 1-3: Bank code
    bankCode: extractField(line, 1, 3),

    // Positions 4-7: Batch number
    batchNumber: parseNumericField(line, 4, 7),

    // Position 8: Record type (always "3" for detail)
    recordType: extractField(line, 8, 8),

    // Positions 9-13: Sequential record number within batch
    sequentialNumber: parseNumericField(line, 9, 13),

    // Position 14: Segment code (always "Q")
    segmentCode: extractField(line, 14, 14),

    // Positions 16-17: Occurrence code
    occurrenceCode: extractField(line, 16, 17),

    // Position 18: Payer registration type (0=CPF, 1=CNPJ, 2=PIS/PASEP, 9=Other)
    payerRegistrationType: extractField(line, 18, 18),

    // Positions 19-33: Payer tax ID (CPF/CNPJ)
    payerTaxId: extractField(line, 19, 33),

    // Positions 34-73: Payer name
    payerName: extractField(line, 34, 73),

    // Positions 74-113: Payer address (street, number, complement)
    payerAddress: extractField(line, 74, 113),

    // Positions 114-128: Payer neighborhood
    payerNeighborhood: extractField(line, 114, 128),

    // Positions 129-133: Payer postal code (first 5 digits)
    payerPostalCode: extractField(line, 129, 136),

    // Positions 137-151: Payer city
    payerCity: extractField(line, 137, 151),

    // Positions 152-153: Payer state (UF)
    payerState: extractField(line, 152, 153),

    // Position 154: Guarantor registration type (optional)
    guarantorRegistrationType: extractField(line, 154, 154) || undefined,

    // Positions 155-169: Guarantor tax ID (optional)
    guarantorTaxId: extractField(line, 155, 169) || undefined,

    // Positions 170-209: Guarantor name (optional)
    guarantorName: extractField(line, 170, 209) || undefined,

    // Positions 210-212: Correspondent bank code
    correspondentBankCode: extractField(line, 210, 212) || undefined,

    // Positions 213-232: Correspondent our number
    correspondentOurNumber: extractField(line, 213, 232) || undefined,
  };
}
