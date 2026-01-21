/**
 * CNAB240 Batch Trailer (Record Type 5)
 *
 * The batch trailer contains summary information for a specific batch.
 *
 * @see FEBRABAN CNAB240 Specification - Layout 04 (Trailer Lote)
 */
export interface BatchTrailer {
  /**
   * Bank code (3 digits)
   * @example "341" // Itaú
   */
  bankCode: string;

  /**
   * Batch number (must match batch header)
   */
  batchNumber: number;

  /**
   * Record type - Always "5" for batch trailer
   */
  recordType: string;

  /**
   * CNAB reserved field
   */
  cnabReserved1?: string;

  /**
   * Total number of records in this batch
   * Includes: batch header, all detail records (segments), batch trailer
   */
  totalRecords: number;

  /**
   * Total simple slips/payments in this batch
   */
  totalSimpleSlips?: number;

  /**
   * Total amount of simple slips/payments
   * Amount in cents (divide by 100 for BRL)
   */
  totalSimpleAmount?: number;

  /**
   * Total endorsed slips in this batch (optional)
   */
  totalEndorsedSlips?: number;

  /**
   * Total amount of endorsed slips (optional)
   */
  totalEndorsedAmount?: number;

  /**
   * Total collection slips in this batch (optional)
   */
  totalCollectionSlips?: number;

  /**
   * Total amount of collections (optional)
   */
  totalCollectionAmount?: number;

  /**
   * Warning code (optional)
   */
  warningCode?: string;

  /**
   * CNAB reserved field
   */
  cnabReserved2?: string;
}
