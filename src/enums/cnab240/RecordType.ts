/**
 * CNAB240 Record Type Codes
 *
 * Identifies the type of record in a CNAB240 line.
 * CNAB240 files have a hierarchical structure with different record types.
 *
 * @see FEBRABAN CNAB240 Specification
 */
export enum RecordType {
  /**
   * File Header (Type 0)
   * First record of the file, contains general file information
   */
  FILE_HEADER = '0',

  /**
   * Batch Header (Type 1)
   * First record of each batch, contains batch information
   */
  BATCH_HEADER = '1',

  /**
   * Detail Record (Type 3)
   * Contains payment/slip details with segments (P, Q, R, S, etc.)
   */
  DETAIL = '3',

  /**
   * Batch Trailer (Type 5)
   * Last record of each batch, contains batch totals
   */
  BATCH_TRAILER = '5',

  /**
   * File Trailer (Type 9)
   * Last record of the file, contains file totals
   */
  FILE_TRAILER = '9',
}
