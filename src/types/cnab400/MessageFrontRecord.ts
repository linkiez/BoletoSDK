/**
 * CNAB400 Message Front Record Type Definition
 *
 * @module types/cnab400/MessageFrontRecord
 */

/**
 * Message Front Record (Type 7) - Required for Itaú
 *
 * Contains up to three formatted message lines for the front of the bank slip.
 *
 * @see CNAB400-ITAU.md section 3.1.1 - Registro mensagem FRENTE
 *
 * @example
 * ```typescript
 * const frontMessage: MessageFrontRecord = {
 *   recordType: '7',
 *   flashCode: '   ',
 *   lineNumber1: 1,
 *   message1: 'PAYMENT FOR SERVICES PROVIDED IN JANUARY 2026',
 *   destinationCode: ' ',
 *   sequentialNumber: 4
 * };
 * ```
 */
export interface MessageFrontRecord {
  /** Record type identifier - Always '7' for front message (Position 001-001) */
  recordType: '7';

  /** Flash code (Position 002-004) */
  flashCode?: string;

  /** Printed line number (Position 005-006) */
  lineNumber1?: number;

  /** First message line - Up to 128 characters (Position 007-134) */
  message1?: string;

  /** Printed line number (Position 135-136) */
  lineNumber2?: number;

  /** Second message line - Up to 128 characters (Position 137-264) */
  message2?: string;

  /** Printed line number (Position 265-266) */
  lineNumber3?: number;

  /** Third message line - Up to 127 characters (Position 267-393) */
  message3?: string;

  /** Destination boleto code (Position 394) */
  destinationCode?: string;

  /** Sequential number - Record sequence in file (Position 395-400) */
  sequentialNumber: number;
}
