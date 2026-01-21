/**
 * CNAB400 Message Back Record Type Definition
 *
 * @module types/cnab400/MessageBackRecord
 */

/**
 * Message Back Record (Type 8) - Optional
 *
 * Contains message lines to be printed on the back of the bank slip.
 * This record is optional and used for additional information.
 *
 * @see CNAB400-ITAU.md section 3.1.2 - Registro mensagem VERSO
 *
 * @example
 * ```typescript
 * const backMessage: MessageBackRecord = {
 *   recordType: '8',
 *   message1: 'ADDITIONAL INFORMATION',
 *   message2: 'PAYMENT CAN BE MADE AT ANY BANK BRANCH',
 *   sequentialNumber: 5
 * };
 * ```
 */
export interface MessageBackRecord {
  /** Record type identifier - Always '8' for back message (Position 001-001) */
  recordType: '8';

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
