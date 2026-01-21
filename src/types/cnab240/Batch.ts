import type { BatchHeader } from './BatchHeader';
import type { BatchTrailer } from './BatchTrailer';
import type { SegmentP } from './SegmentP';
import type { SegmentQ } from './SegmentQ';
import type { SegmentR } from './SegmentR';

/**
 * Detail Record - Represents a complete bank slip/payment entry
 *
 * In CNAB240, a detail record is composed of multiple segments:
 * - Segment P (mandatory): Main payment data
 * - Segment Q (mandatory): Payer information
 * - Segment R (optional): Additional discounts, fines, interest
 * - Segment S (optional): Additional information (not yet implemented)
 *
 * All segments belonging to the same slip/payment share the same sequentialNumber base.
 */
export interface DetailRecord {
  /**
   * Segment P - Main payment/slip data (mandatory)
   */
  segmentP: SegmentP;

  /**
   * Segment Q - Payer information (mandatory)
   */
  segmentQ: SegmentQ;

  /**
   * Segment R - Additional discounts/fines/interest (optional)
   */
  segmentR?: SegmentR;

  /**
   * Segment S - Additional information (optional, not yet implemented)
   */
  // segmentS?: SegmentS;
}

/**
 * Batch - Group of related operations
 *
 * A batch represents a logical group of bank slips/payments.
 * CNAB240 files can contain multiple batches, each with its own header and trailer.
 */
export interface Batch {
  /**
   * Batch header (record type 1)
   */
  header: BatchHeader;

  /**
   * Detail records (segments P, Q, R, S grouped by slip)
   */
  details: DetailRecord[];

  /**
   * Batch trailer (record type 5)
   */
  trailer: BatchTrailer;
}
