/**
 * CNAB400 File Trailer Type Definition
 *
 * @module types/cnab400/FileTrailer
 */

/**
 * File Trailer Record (Type 9)
 *
 * Represents the trailer (summary) of a CNAB400 file.
 * Contains record counts and totals.
 *
 * @see CNAB400-ITAU.md section 3.1 - Registro Trailer
 *
 * @example
 * ```typescript
 * const trailer: FileTrailer = {
 *   recordType: '9',
 *   totalRecords: 10,
 *   totalAmount: 1500.00,
 *   sequentialNumber: 11
 * };
 * ```
 */
export interface FileTrailer {
  /** Record type identifier - Always '9' for trailer (Position 001-001) */
  recordType: '9';

  /** Total number of records in file - Including header and trailer (Position 002-007) */
  totalRecords: number;

  /** Total transaction amount - Sum of all details (Position 008-020) */
  totalAmount?: number;

  /** Total number of detail records - Type 1 records only (Position 021-028) */
  totalDetailRecords?: number;

  /** Zeros - Complement (Position 029-394) */
  zeros?: string;

  /** Sequential number - Record sequence in file (Position 395-400) */
  sequentialNumber: number;
}
