/**
 * CNAB400 Message Front Record Type Definition
 *
 * @module types/cnab400/MessageFrontRecord
 */

/**
 * Message Front Record (Type 7) - Required for Itaú
 *
 * Contains message lines to be printed on the front of the bank slip.
 * At least one Type 7 record is required for Itaú CNAB400 files.
 *
 * @see CNAB400-ITAU.md section 3.1.1 - Registro mensagem FRENTE
 *
 * @example
 * ```typescript
 * const frontMessage: MessageFrontRecord = {
 *   recordType: '7',
 *   message1: 'PAYMENT FOR SERVICES PROVIDED IN JANUARY 2026',
 *   message2: 'INVOICE NUMBER: 12345',
 *   message3: 'THANK YOU FOR YOUR BUSINESS',
 *   sequentialNumber: 4
 * };
 * ```
 */
export interface MessageFrontRecord {
  /** Record type identifier - Always '7' for front message (Position 001-001) */
  recordType: '7';

  /** First message line - Up to 80 characters (Position 002-081) */
  message1?: string;

  /** Second message line - Up to 80 characters (Position 082-161) */
  message2?: string;

  /** Third message line - Up to 80 characters (Position 162-241) */
  message3?: string;

  /** Fourth message line - Up to 80 characters (Position 242-321) */
  message4?: string;

  /** Sequential number - Record sequence in file (Position 395-400) */
  sequentialNumber: number;
}
