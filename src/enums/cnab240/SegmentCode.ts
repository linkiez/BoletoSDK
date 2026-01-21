/**
 * CNAB240 Segment Codes
 *
 * Identifies the type of segment within a detail record (Type 3).
 * Multiple segments can exist for a single slip/payment.
 *
 * @see FEBRABAN CNAB240 Specification
 */
export enum SegmentCode {
  /**
   * Segment P - Mandatory
   * Main payment/slip data (amounts, dates, portfolio, etc.)
   */
  P = 'P',

  /**
   * Segment Q - Mandatory
   * Payer (sacado) information (name, address, tax ID, etc.)
   */
  Q = 'Q',

  /**
   * Segment R - Optional
   * Additional discounts, fines, messages for the payer
   */
  R = 'R',

  /**
   * Segment S - Optional
   * Additional information (bank-specific data)
   */
  S = 'S',

  /**
   * Segment T - Optional (Retorno)
   * Return information about slip status and payments
   */
  T = 'T',

  /**
   * Segment U - Optional (Retorno)
   * Additional return information
   */
  U = 'U',

  /**
   * Segment Y - Optional
   * PIX-related information
   */
  Y = 'Y',
}
