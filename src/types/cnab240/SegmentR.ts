/**
 * CNAB240 Segment R (Record Type 3 - Segment R)
 *
 * Segment R contains additional discount, fine, and interest details.
 * This segment is optional and may follow Segment Q.
 *
 * @see FEBRABAN CNAB240 Specification - Segmento R (Opcional)
 */
export interface SegmentR {
  /**
   * Bank code (3 digits)
   * @example "341" // Itaú
   */
  bankCode: string;

  /**
   * Batch number
   */
  batchNumber: number;

  /**
   * Record type - Always "3" for detail
   */
  recordType: string;

  /**
   * Sequential number within batch
   */
  sequentialNumber: number;

  /**
   * Segment code - Always "R" for this segment
   */
  segmentCode: string;

  /**
   * CNAB reserved field
   */
  cnabReserved1?: string;

  /**
   * Movement/Occurrence code (must match Segment P)
   */
  occurrenceCode: string;

  /**
   * Second discount code
   * - "0" = No discount
   * - "1" = Fixed amount
   * - "2" = Percentage
   */
  discount2Code?: string;

  /**
   * Second discount date
   */
  discount2Date?: Date;

  /**
   * Second discount amount or percentage
   */
  discount2Amount?: number;

  /**
   * Third discount code
   * - "0" = No discount
   * - "1" = Fixed amount
   * - "2" = Percentage
   */
  discount3Code?: string;

  /**
   * Third discount date
   */
  discount3Date?: Date;

  /**
   * Third discount amount or percentage
   */
  discount3Amount?: number;

  /**
   * Fine code
   * - "0" = No fine
   * - "1" = Fixed amount
   * - "2" = Percentage
   */
  fineCode?: string;

  /**
   * Fine date (when fine becomes effective)
   */
  fineDate?: Date;

  /**
   * Fine amount or percentage
   * If fineCode = 1: amount in cents
   * If fineCode = 2: percentage (basis points)
   */
  fineAmount?: number;

  /**
   * Payer info - 10 characters (17.3R)
   */
  payerInfo?: string;

  /**
   * Information for payer (message line 3) - 40 characters (18.3R)
   */
  payerInformation?: string;

  /**
   * Information for payer (message line 4) - 40 characters (19.3R)
   */
  payerInformation2?: string;

  /**
   * CNAB reserved field - 20 characters (20.3R)
   */
  cnabReserved2?: string;

  /**
   * Occurrence code complement - 8 characters (21.3R)
   */
  occurrenceCodeComplement?: string;

  /**
   * Debit bank code (for automatic debit) - 3 characters (22.3R)
   */
  debitBankCode?: string;

  /**
   * Debit agency (for automatic debit) - 5 characters (23.3R)
   */
  debitAgency?: string;

  /**
   * Debit agency digit - 1 character (24.3R)
   */
  debitAgencyDigit?: string;

  /**
   * Debit account (for automatic debit) - 12 characters (25.3R)
   */
  debitAccount?: string;

  /**
   * Debit account digit - 1 character (26.3R)
   */
  debitAccountDigit?: string;

  /**
   * Debit account DV (agency/account) - 1 character (27.3R)
   */
  debitAccountDV?: string;

  /**
   * Debit notice emission - 1 character (28.3R)
   */
  debitNoticeEmission?: string;

  /**
   * CNAB reserved field - 9 characters (29.3R)
   */
  cnabReserved3?: string;
}
