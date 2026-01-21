/**
 * CNAB240 Operation Type Codes
 *
 * Identifies the type of operation being performed.
 *
 * @see FEBRABAN CNAB240 Specification
 */
export enum OperationType {
  /**
   * C - Lançamento a Crédito (Credit Entry)
   * Credit operation
   */
  CREDIT = 'C',

  /**
   * D - Lançamento a Débito (Debit Entry)
   * Debit operation
   */
  DEBIT = 'D',

  /**
   * E - Extrato para Conciliação (Statement for Reconciliation)
   * Bank statement information
   */
  STATEMENT = 'E',

  /**
   * I - Informações de Títulos Capturados do Próprio Banco
   * Information about slips captured from the bank itself
   */
  INFORMATION = 'I',
}
