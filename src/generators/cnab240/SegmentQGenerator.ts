import { LINE_LENGTH } from '../../constants/cnab240';
import { SegmentQ } from '../../types/cnab240';
import { buildLine, formatField, formatNumericField } from './LineGenerator';

/**
 * Generates CNAB240 Segment Q (Payer Data)
 *
 * Segment Q contains information about the payer (sacado).
 *
 * @example
 * ```typescript
 * const generator = new SegmentQGenerator();
 * const segment: SegmentQ = {
 *   bankCode: '341',
 *   batchNumber: 1,
 *   recordType: '3',
 *   sequentialNumber: 1,
 *   segmentCode: 'Q',
 *   payerRegistrationType: '1',
 *   payerRegistrationNumber: '12345678901',
 *   payerName: 'JOAO DA SILVA',
 *   payerAddress: 'RUA DAS FLORES 123',
 *   payerDistrict: 'CENTRO',
 *   payerPostalCode: '01234567',
 *   payerCity: 'SAO PAULO',
 *   payerState: 'SP'
 * };
 * const line = generator.generate(segment);
 * ```
 */
export class SegmentQGenerator {
  /**
   * Generates a CNAB240 segment Q line (240 characters)
   *
   * Field positions (1-indexed as per FEBRABAN spec):
   * - 001-003 (3): Bank code
   * - 004-007 (4): Batch number
   * - 008-008 (1): Record type (always 3 for detail)
   * - 009-013 (5): Sequential number within batch
   * - 014-014 (1): Segment code (always Q)
   * - 015-015 (1): Reserved (space)
   * - 016-017 (2): Movement code
   * - 018-018 (1): Payer registration type (1=CPF, 2=CNPJ)
   * - 019-033 (15): Payer registration number
   * - 034-073 (40): Payer name
   * - 074-113 (40): Payer address
   * - 114-128 (15): Payer district/neighborhood
   * - 129-136 (8): Payer postal code (CEP)
   * - 137-151 (15): Payer city
   * - 152-153 (2): Payer state (UF)
   * - 154-154 (1): Guarantor registration type
   * - 155-169 (15): Guarantor registration number
   * - 170-209 (40): Guarantor name
   * - 210-240 (31): Reserved
   *
   * @param segment - Segment Q data
   * @returns 240-character CNAB240 segment Q line
   * @throws Error if validation fails
   */
  public generate(segment: SegmentQ): string {
    this.validate(segment);

    const fields = new Map<string, string>();

    // Positions 1-3: Bank code
    fields.set('bankCode', formatNumericField(Number(segment.bankCode), 1, 3));

    // Positions 4-7: Batch number
    fields.set('batchNumber', formatNumericField(Number(segment.batchNumber), 4, 7));

    // Position 8: Record type (always 3 for detail)
    fields.set('recordType', formatField('3', 8, 8, 'numeric'));

    // Positions 9-13: Sequential number
    fields.set('sequentialNumber', formatNumericField(segment.sequentialNumber, 9, 13));

    // Position 14: Segment code (always Q)
    fields.set('segmentCode', formatField('Q', 14, 14, 'text'));

    // Position 15: Reserved (space)
    fields.set('reserved1', formatField('', 15, 15, 'text'));

    // Positions 16-17: Occurrence code (must match Segment P)
    fields.set('occurrenceCode', formatField(segment.occurrenceCode, 16, 17, 'numeric'));

    // Position 18: Payer registration type
    fields.set(
      'payerRegistrationType',
      formatField(segment.payerRegistrationType, 18, 18, 'numeric'),
    );

    // Positions 19-33: Payer tax ID (CPF/CNPJ) (15 digits)
    fields.set('payerTaxId', formatNumericField(Number(segment.payerTaxId), 19, 33));

    // Positions 34-73: Payer name (40 text)
    fields.set('payerName', formatField(segment.payerName, 34, 73, 'text'));

    // Positions 74-113: Payer address (40 text)
    fields.set('payerAddress', formatField(segment.payerAddress, 74, 113, 'text'));

    // Positions 114-128: Payer neighborhood/district (15 text)
    fields.set('payerNeighborhood', formatField(segment.payerNeighborhood, 114, 128, 'text'));

    // Positions 129-136: Payer postal code (8 numeric)
    fields.set('payerPostalCode', formatNumericField(Number(segment.payerPostalCode), 129, 136));

    // Positions 137-151: Payer city (15 text)
    fields.set('payerCity', formatField(segment.payerCity, 137, 151, 'text'));

    // Positions 152-153: Payer state (2 text)
    fields.set('payerState', formatField(segment.payerState, 152, 153, 'text'));

    // Position 154: Guarantor registration type (optional)
    fields.set(
      'guarantorRegistrationType',
      formatField(segment.guarantorRegistrationType || '0', 154, 154, 'numeric'),
    );

    // Positions 155-169: Guarantor tax ID (15 numeric, optional)
    fields.set('guarantorTaxId', formatNumericField(Number(segment.guarantorTaxId || 0), 155, 169));

    // Positions 170-209: Guarantor name (40 text, optional)
    fields.set('guarantorName', formatField(segment.guarantorName || '', 170, 209, 'text'));

    // Positions 210-240: Reserved (31 spaces)
    fields.set('reserved2', formatField('', 210, LINE_LENGTH, 'text'));

    const line = buildLine(fields);

    // Validate line length
    if (line.length !== LINE_LENGTH) {
      throw new Error(`Invalid segment Q length: expected ${LINE_LENGTH}, got ${line.length}`);
    }

    return line;
  }

  /**
   * Validates required fields in segment Q
   *
   * @param segment - Segment Q to validate
   * @throws Error if required fields are missing or invalid
   */
  private validate(segment: SegmentQ): void {
    if (!segment.bankCode) {
      throw new Error('Bank code is required');
    }

    if (segment.batchNumber === undefined || segment.batchNumber === null) {
      throw new Error('Batch number is required');
    }

    if (!segment.recordType) {
      throw new Error('Record type is required');
    }

    if (segment.sequentialNumber === undefined || segment.sequentialNumber === null) {
      throw new Error('Sequential number is required');
    }

    if (!segment.segmentCode) {
      throw new Error('Segment code is required');
    }

    if (!segment.occurrenceCode) {
      throw new Error('Occurrence code is required');
    }

    if (!segment.payerRegistrationType) {
      throw new Error('Payer registration type is required');
    }

    if (!segment.payerTaxId) {
      throw new Error('Payer tax ID is required');
    }

    if (!segment.payerName) {
      throw new Error('Payer name is required');
    }

    if (!segment.payerAddress) {
      throw new Error('Payer address is required');
    }

    if (!segment.payerNeighborhood) {
      throw new Error('Payer neighborhood is required');
    }

    if (!segment.payerPostalCode) {
      throw new Error('Payer postal code is required');
    }

    if (!segment.payerCity) {
      throw new Error('Payer city is required');
    }

    if (!segment.payerState) {
      throw new Error('Payer state is required');
    }
  }
}
