import { RECORD_TYPE, SEGMENT_P_POSITIONS } from '../../constants/cnab240';
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

    const POS = SEGMENT_P_POSITIONS;
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

    // Position 8: Record type (always 3 for detail)
    fields.set('recordType', RECORD_TYPE.DETAIL);

    // Positions 9-13: Sequential record number within batch
    fields.set(
      'sequentialNumber',
      formatNumericField(segment.sequentialNumber, POS.RECORD_NUMBER.start, POS.RECORD_NUMBER.end),
    );

    // Position 14: Segment code (always P)
    fields.set('segmentCode', 'P');

    // Position 15: Reserved
    fields.set('reserved1', ' ');

    // Positions 16-17: Occurrence code (instruction)
    fields.set(
      'occurrenceCode',
      formatField(
        segment.occurrenceCode || '01',
        POS.MOVEMENT_CODE.start,
        POS.MOVEMENT_CODE.end,
        'text',
      ),
    );

    // Positions 18-22: Agency
    fields.set(
      'agency',
      formatNumericField(Number(segment.agency || '0'), POS.AGENCY.start, POS.AGENCY.end),
    );

    // Position 23: Agency check digit
    fields.set(
      'agencyDigit',
      formatField(segment.agencyDigit || ' ', POS.AGENCY_DIGIT.start, POS.AGENCY_DIGIT.end, 'text'),
    );

    // Positions 24-35: Account number
    fields.set(
      'account',
      formatNumericField(Number(segment.account || '0'), POS.ACCOUNT.start, POS.ACCOUNT.end),
    );

    // Position 36: Account check digit
    fields.set(
      'accountDigit',
      formatField(
        segment.accountDigit || ' ',
        POS.ACCOUNT_DIGIT.start,
        POS.ACCOUNT_DIGIT.end,
        'text',
      ),
    );

    // Position 37: Full account check digit
    fields.set(
      'fullAccountDigit',
      formatField(
        segment.fullAccountDigit || ' ',
        POS.ACCOUNT_DV.start,
        POS.ACCOUNT_DV.end,
        'text',
      ),
    );

    // Positions 38-57: Our number (bank's slip identifier)
    fields.set(
      'ourNumber',
      formatField(
        segment.ourNumber || '',
        POS.DOCUMENT_NUMBER.start,
        POS.DOCUMENT_NUMBER.end,
        'text',
      ),
    );

    // Position 58: Portfolio code
    fields.set(
      'portfolioCode',
      formatField(segment.portfolioCode || '', POS.PORTFOLIO.start, POS.PORTFOLIO.end, 'numeric'),
    );

    // Positions 59-62: Form type
    fields.set(
      'formType',
      formatField(
        segment.formType || '1',
        POS.REGISTRATION_FORM.start,
        POS.BOLETO_DISTRIBUTION.end,
        'numeric',
      ),
    );

    // Positions 63-77: Billing document number (15 chars) - VALIDATED POSITION
    fields.set(
      'documentNumber',
      formatField(
        segment.documentNumber || '',
        POS.BILLING_DOCUMENT_NUMBER.start,
        POS.BILLING_DOCUMENT_NUMBER.end,
        'text',
      ),
    );

    // Positions 78-85: Due date (DDMMYYYY) - VALIDATED POSITION
    fields.set('dueDate', formatDateField(segment.dueDate, POS.DUE_DATE.start, POS.DUE_DATE.end));

    // Positions 86-100: Slip amount (15 digits, 2 implied decimals) - VALIDATED POSITION
    fields.set(
      'amount',
      formatDecimalField(segment.amount || 0, POS.AMOUNT.start, POS.AMOUNT.end, 2),
    );

    // Positions 101-105: Collection agency (optional)
    fields.set(
      'collectionAgency',
      formatNumericField(
        Number(segment.collectionAgency || '0'),
        POS.COLLECTION_AGENCY.start,
        POS.COLLECTION_AGENCY.end,
      ),
    );

    // Position 106: Collection agency digit
    fields.set(
      'collectionAgencyDigit',
      formatField(
        segment.collectionAgencyDigit || ' ',
        POS.COLLECTION_AGENCY_DIGIT.start,
        POS.COLLECTION_AGENCY_DIGIT.end,
        'text',
      ),
    );

    // Positions 107-108: Slip species code
    fields.set(
      'speciesCode',
      formatField(
        segment.speciesCode || '01',
        POS.DOCUMENT_SPECIES.start,
        POS.DOCUMENT_SPECIES.end,
        'text',
      ),
    );

    // Position 109: Acceptance (A=Accepted, N=Not accepted)
    fields.set(
      'acceptance',
      formatField(segment.acceptance || 'N', POS.ACCEPTANCE.start, POS.ACCEPTANCE.end, 'text'),
    );

    // Positions 110-117: Issue date (DDMMYYYY)
    fields.set(
      'issueDate',
      formatDateField(segment.issueDate, POS.ISSUE_DATE.start, POS.ISSUE_DATE.end),
    );

    // Position 118: Interest code (0=None, 1=Daily amount, 2=Monthly rate)
    fields.set(
      'interestCode',
      formatField(
        segment.interestCode || '0',
        POS.INTEREST_CODE.start,
        POS.INTEREST_CODE.end,
        'text',
      ),
    );

    // Positions 119-126: Interest date (DDMMYYYY)
    fields.set(
      'interestDate',
      segment.interestDate
        ? formatDateField(segment.interestDate, POS.INTEREST_DATE.start, POS.INTEREST_DATE.end)
        : '00000000',
    );

    // Positions 127-141: Interest amount/rate (15 digits, 2 implied decimals)
    fields.set(
      'interestAmount',
      formatDecimalField(
        segment.interestAmount || 0,
        POS.INTEREST_AMOUNT.start,
        POS.INTEREST_AMOUNT.end,
        2,
      ),
    );

    // Position 142: Discount code (0=None, 1=Fixed, 2=Percentage)
    fields.set(
      'discountCode',
      formatField(
        segment.discountCode || '0',
        POS.DISCOUNT_CODE.start,
        POS.DISCOUNT_CODE.end,
        'text',
      ),
    );

    // Positions 143-150: Discount date (DDMMYYYY)
    fields.set(
      'discountDate',
      segment.discountDate
        ? formatDateField(segment.discountDate, POS.DISCOUNT_DATE.start, POS.DISCOUNT_DATE.end)
        : '00000000',
    );

    // Positions 151-165: Discount amount (15 digits, 2 implied decimals)
    fields.set(
      'discountAmount',
      formatDecimalField(
        segment.discountAmount || 0,
        POS.DISCOUNT_AMOUNT.start,
        POS.DISCOUNT_AMOUNT.end,
        2,
      ),
    );

    // Positions 166-180: IOF amount (15 digits, 2 implied decimals)
    fields.set(
      'iofAmount',
      formatDecimalField(segment.iofAmount || 0, POS.IOF_AMOUNT.start, POS.IOF_AMOUNT.end, 2),
    );

    // Positions 181-195: Rebate amount (15 digits, 2 implied decimals)
    fields.set(
      'rebateAmount',
      formatDecimalField(
        segment.rebateAmount || 0,
        POS.REBATE_AMOUNT.start,
        POS.REBATE_AMOUNT.end,
        2,
      ),
    );

    // Positions 196-220: Company identification - VALIDATED POSITION (NEW FIELD)
    fields.set(
      'companyIdentification',
      formatField(
        segment.companyIdentification || '',
        POS.COMPANY_IDENTIFICATION.start,
        POS.COMPANY_IDENTIFICATION.end,
        'text',
      ),
    );

    // Positions 221-222: Protest code (1=Protest, 2=No protest, 3=Use bank default)
    fields.set(
      'protestCode',
      formatField(segment.protestCode || '3', POS.PROTEST_CODE.start, POS.PROTEST_CODE.end, 'text'),
    );

    // Positions 222-223: Days for protest
    fields.set(
      'protestDays',
      formatNumericField(segment.protestDays || 0, POS.PROTEST_DAYS.start, POS.PROTEST_DAYS.end),
    );

    // Position 224: Write-off code (1=Write off, 2=No write off, 3=Use bank default)
    fields.set(
      'writeOffCode',
      formatField(
        segment.writeOffCode || '2',
        POS.LOW_RETURN_CODE.start,
        POS.LOW_RETURN_CODE.end,
        'text',
      ),
    );

    // Positions 225-227: Days for write-off
    fields.set(
      'writeOffDays',
      formatNumericField(
        segment.writeOffDays || 0,
        POS.LOW_RETURN_DAYS.start,
        POS.LOW_RETURN_DAYS.end,
      ),
    );

    // Positions 228-229: Currency code
    fields.set(
      'currencyCode',
      formatField(
        segment.currencyCode || '09',
        POS.CURRENCY_CODE.start,
        POS.CURRENCY_CODE.end,
        'text',
      ),
    );

    // Positions 230-239: Contract number - VALIDATED POSITION (NEW FIELD)
    fields.set(
      'contractNumber',
      formatField(
        segment.contractNumber || '',
        POS.CONTRACT_NUMBER.start,
        POS.CONTRACT_NUMBER.end,
        'text',
      ),
    );

    // Position 240: Free use
    fields.set('reserved3', formatField('', POS.FREE_USE.start, POS.FREE_USE.end, 'text'));

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
