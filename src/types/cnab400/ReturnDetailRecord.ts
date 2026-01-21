/**
 * CNAB400 Return Detail Record Type Definition
 *
 * @module types/cnab400/ReturnDetailRecord
 */

import type { DetailRecord } from './DetailRecord';

/**
 * CNAB400 Return File Additional Fields
 *
 * When processing return files from the bank, additional fields
 * are present in the detail records with occurrence information.
 */
export interface ReturnDetailRecord extends DetailRecord {
  /** Occurrence code - Bank's processing result (Position 109-110) */
  occurrenceCode: string;

  /** Occurrence date - DDMMYY when event occurred (Position 111-116) */
  occurrenceDate?: Date;

  /** Bank's document number - Bank's internal reference (Position 117-126) */
  bankDocumentNumber?: string;

  /** Credit date - DDMMYY when credited (Position 176-181) */
  creditDate?: Date;

  /** Payment amount - Actual amount paid (Position 254-266) */
  paymentAmount?: number;

  /** Expenses amount - Bank fees (Position 267-279) */
  expensesAmount?: number;

  /** Rejection reasons - Up to 8 rejection codes (Position 319-326) */
  rejectionReasons?: string[];
}
