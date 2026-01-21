import { LINE_LENGTH } from '../../constants/cnab240';
import { CnabError } from '../../errors';
import { SegmentP } from '../../types';
import {
    buildLine,
    formatDateField,
    formatDecimalField,
    formatField,
    formatNumericField,
} from './LineGenerator';

/**
 * Generates CNAB240 Segment P lines (Payment detail)
 * Record type 3, Segment code P
 * Used in REMESSA files for payment instructions
 */
export class SegmentPGenerator {
  /**
   * Generates a complete segment P line (240 characters)
   * @param segment - Segment P data
   * @returns 240-character formatted string
   */
  public generate(segment: SegmentP): string {
    this.validate(segment);

    const fields = new Map<string, string>();

    // Positions 1-3: Bank code
    fields.set('bankCode', formatNumericField(Number(segment.bankCode), 1, 3));

    // Positions 4-7: Batch number
    fields.set('batchNumber', formatNumericField(segment.batchNumber, 4, 7));

    // Position 8: Record type (always 3 for detail)
    fields.set('recordType', '3');

    // Positions 9-13: Sequential record number within batch
    fields.set('sequentialNumber', formatNumericField(segment.sequentialNumber, 9, 13));

    // Position 14: Segment code (always P)
    fields.set('segmentCode', 'P');

    // Position 15: Reserved
    fields.set('reserved1', ' ');

    // Positions 16-17: Occurrence code (instruction)
    fields.set('occurrenceCode', formatField(segment.occurrenceCode || '01', 16, 17, 'text'));

    // Positions 18-22: Agency
    fields.set('agency', formatNumericField(Number(segment.agency || '0'), 18, 22));

    // Position 23: Agency check digit
    fields.set('agencyDigit', formatField(segment.agencyDigit || ' ', 23, 23, 'text'));

    // Positions 24-35: Account number
    fields.set('account', formatNumericField(Number(segment.account || '0'), 24, 35));

    // Position 36: Account check digit
    fields.set('accountDigit', formatField(segment.accountDigit || ' ', 36, 36, 'text'));

    // Position 37: Full account check digit
    fields.set('fullAccountDigit', formatField(segment.fullAccountDigit || ' ', 37, 37, 'text'));

    // Positions 38-57: Our number (bank's slip identifier)
    fields.set('ourNumber', formatField(segment.ourNumber || '', 38, 57, 'text'));

    // Positions 58-60: Portfolio code
    fields.set('portfolioCode', formatField(segment.portfolioCode || '', 58, 60, 'numeric'));

    // Positions 61-62: Form type
    fields.set('formType', formatField(segment.formType || '1', 61, 62, 'numeric'));

    // Positions 63-71: Slip number (if pre-printed)
    fields.set('slipNumber', formatField(segment.slipNumber || '', 63, 71, 'text'));

    // Position 72: Slip number check digit
    fields.set('slipNumberDigit', formatField(segment.slipNumberDigit || ' ', 72, 72, 'text'));

    // Position 73: Issuance type
    fields.set('issuanceType', formatField(segment.issuanceType || '1', 73, 73, 'text'));

    // Position 74: Distribution type
    fields.set('distributionType', formatField(segment.distributionType || '1', 74, 74, 'text'));

    // Positions 75-89: Document number (invoice/reference) - 15 chars
    fields.set('documentNumber', formatField(segment.documentNumber || '', 75, 89, 'text'));

    // Positions 90-97: Due date (DDMMYYYY)
    fields.set('dueDate', formatDateField(segment.dueDate, 90, 97));

    // Positions 98-112: Slip amount (15 digits, 2 implied decimals)
    fields.set('amount', formatDecimalField(segment.amount || 0, 98, 112, 2));

    // Positions 113-117: Collection agency (optional)
    fields.set(
      'collectionAgency',
      formatNumericField(Number(segment.collectionAgency || '0'), 113, 117),
    );

    // Position 118: Collection agency digit
    fields.set(
      'collectionAgencyDigit',
      formatField(segment.collectionAgencyDigit || ' ', 118, 118, 'text'),
    );

    // Positions 119-120: Slip species code
    fields.set('speciesCode', formatField(segment.speciesCode || '01', 119, 120, 'text'));

    // Position 121: Acceptance (A=Accepted, N=Not accepted)
    fields.set('acceptance', formatField(segment.acceptance || 'N', 121, 121, 'text'));

    // Positions 122-129: Issue date (DDMMYYYY)
    fields.set('issueDate', formatDateField(segment.issueDate, 122, 129));

    // Position 130: Interest code (0=None, 1=Daily amount, 2=Monthly rate)
    fields.set('interestCode', formatField(segment.interestCode || '0', 130, 130, 'text'));

    // Positions 131-138: Interest date (DDMMYYYY)
    fields.set(
      'interestDate',
      segment.interestDate ? formatDateField(segment.interestDate, 131, 138) : '00000000',
    );

    // Positions 139-153: Interest amount/rate (15 digits, 2 implied decimals)
    fields.set('interestAmount', formatDecimalField(segment.interestAmount || 0, 139, 153, 2));

    // Position 154: Discount code (0=None, 1=Fixed, 2=Percentage)
    fields.set('discountCode', formatField(segment.discountCode || '0', 154, 154, 'text'));

    // Positions 155-162: Discount date (DDMMYYYY)
    fields.set(
      'discountDate',
      segment.discountDate ? formatDateField(segment.discountDate, 155, 162) : '00000000',
    );

    // Positions 163-177: Discount amount (15 digits, 2 implied decimals)
    fields.set('discountAmount', formatDecimalField(segment.discountAmount || 0, 163, 177, 2));

    // Positions 178-192: IOF amount (15 digits, 2 implied decimals)
    fields.set('iofAmount', formatDecimalField(segment.iofAmount || 0, 178, 192, 2));

    // Positions 193-207: Rebate amount (15 digits, 2 implied decimals)
    fields.set('rebateAmount', formatDecimalField(segment.rebateAmount || 0, 193, 207, 2));

    // Positions 208-209: Protest code (1=Protest, 2=No protest, 3=Use bank default)
    fields.set('protestCode', formatField(segment.protestCode || '3', 208, 209, 'text'));

    // Positions 210-211: Days for protest
    fields.set('protestDays', formatNumericField(segment.protestDays || 0, 210, 211));

    // Positions 212-213: Write-off code (1=Write off, 2=No write off, 3=Use bank default)
    fields.set('writeOffCode', formatField(segment.writeOffCode || '2', 212, 213, 'text'));

    // Positions 214-216: Days for write-off
    fields.set('writeOffDays', formatNumericField(segment.writeOffDays || 0, 214, 216));

    // Positions 217-218: Currency code (09=BRL)
    fields.set('currencyCode', formatField(segment.currencyCode || '09', 217, 218, 'text'));

    // Positions 219-228: Agreement number (10 digits, optional)
    fields.set(
      'agreementNumber',
      formatNumericField(Number(segment.agreementNumber || '0'), 219, 228),
    );

    // Positions 229-229: Reserved
    fields.set('reserved2', formatField('', 229, 229, 'text'));

    // Positions 230-240: Reserved
    fields.set('reserved3', formatField('', 230, LINE_LENGTH, 'text'));

    return buildLine(fields);
  }

  /**
   * Validates required fields
   * @param segment - Segment P data
   * @throws CnabError if validation fails
   */
  private validate(segment: SegmentP): void {
    if (!segment.bankCode) {
      throw new CnabError('Bank code is required', 'VALIDATION_ERROR');
    }
    if (segment.batchNumber === undefined || segment.batchNumber === null) {
      throw new CnabError('Batch number is required', 'VALIDATION_ERROR');
    }
    if (segment.sequentialNumber === undefined || segment.sequentialNumber === null) {
      throw new CnabError('Sequential number is required', 'VALIDATION_ERROR');
    }
    if (!segment.dueDate) {
      throw new CnabError('Due date is required', 'VALIDATION_ERROR');
    }
    if (segment.amount === undefined || segment.amount === null) {
      throw new CnabError('Amount is required', 'VALIDATION_ERROR');
    }
  }
}
