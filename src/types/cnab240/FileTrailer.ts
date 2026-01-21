/**
 * CNAB240 File Trailer (Record Type 9)
 *
 * The file trailer contains summary information about the entire file,
 * including total batches and records. Each CNAB240 file has exactly one file trailer.
 *
 * @see FEBRABAN CNAB240 Specification - Layout 02 (Trailer Arquivo)
 */
export interface FileTrailer {
  /**
   * Bank code (3 digits)
   * @example "341" // Itaú
   */
  bankCode: string;

  /**
   * Batch number - Always "9999" for file trailer
   */
  batchNumber: string;

  /**
   * Record type - Always "9" for file trailer
   */
  recordType: string;

  /**
   * CNAB reserved field
   */
  cnabReserved1?: string;

  /**
   * Total number of batches in the file
   */
  totalBatches: number;

  /**
   * Total number of records in the file
   * Includes: file header, all batch headers, all details, all batch trailers, file trailer
   */
  totalRecords: number;

  /**
   * Total number of accounts (optional)
   */
  totalAccounts?: number;

  /**
   * CNAB reserved field
   */
  cnabReserved2?: string;
}
