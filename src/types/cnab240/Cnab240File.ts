import type { Batch } from './Batch';
import type { FileHeader } from './FileHeader';
import type { FileTrailer } from './FileTrailer';

/**
 * CNAB240 File Structure
 *
 * Represents a complete CNAB240 file with its hierarchical structure:
 * - File Header (1 record, type 0)
 * - Batches (1 or more)
 *   - Batch Header (1 record per batch, type 1)
 *   - Details (N records per batch, type 3)
 *     - Segment P (mandatory)
 *     - Segment Q (mandatory)
 *     - Segment R (optional)
 *     - Segment S (optional)
 *   - Batch Trailer (1 record per batch, type 5)
 * - File Trailer (1 record, type 9)
 *
 * Each line in a CNAB240 file is exactly 240 characters.
 */
export interface Cnab240File {
  /**
   * File header (record type 0)
   */
  fileHeader: FileHeader;

  /**
   * Batches - One or more groups of operations
   * Each batch contains related bank slips/payments
   */
  batches: Batch[];

  /**
   * File trailer (record type 9)
   */
  fileTrailer: FileTrailer;
}
