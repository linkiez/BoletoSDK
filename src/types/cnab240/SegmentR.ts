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
   * Information for payer (message line 3)
   */
  payerInformation?: string;

  /**
   * Information for payer (message line 4)
   */
  payerInformation2?: string;

  /**
   * CNAB reserved field
   */
  cnabReserved2?: string;

  /**
   * CNAB reserved field
   */
  cnabReserved3?: string;

  /**
   * CNAB reserved field
   */
  cnabReserved4?: string;

  /**
   * Occurrence code (for this segment)
   */
  segmentOccurrenceCode?: string;

  /**
   * Debit bank code (for automatic debit)
   */
  debitBankCode?: string;

  /**
   * Debit agency (for automatic debit)
   */
  debitAgency?: string;

  /**
   * Debit agency digit
   */
  debitAgencyDigit?: string;

  /**
   * Debit account (for automatic debit)
   */
  debitAccount?: string;

  /**
   * Debit account digit
   */
  debitAccountDigit?: string;

  /**
   * Debit full account digit
   */
  debitFullAccountDigit?: string;

  /**
   * Automatic debit warning code
   */
  automaticDebitWarning?: string;

  /**
   * CNAB reserved field
   */
  cnabReserved5?: string;
}
