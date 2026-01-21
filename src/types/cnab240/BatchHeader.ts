/**
 * CNAB240 Batch Header (Record Type 1)
 *
 * Each batch groups related payment/collection operations.
 * A file can contain multiple batches.
 *
 * @see FEBRABAN CNAB240 Specification - Layout 03 (Header Lote)
 */
export interface BatchHeader {
  /**
   * Bank code (3 digits)
   * @example "341" // Itaú
   */
  bankCode: string;

  /**
   * Batch number (sequential, starting from 1)
   */
  batchNumber: number;

  /**
   * Record type - Always "1" for batch header
   */
  recordType: string;

  /**
   * Operation type
   * - "C" = Credit
   * - "D" = Debit
   * - "E" = Tax payment
   * - "I" = Information
   */
  operationType: string;

  /**
   * Service type
   * - "01" = Bank slip with registration
   * - "02" = Bank slip without registration
   * - "03" = Debit
   * - "04" = Payment/Credit
   * - "98" = Information
   */
  serviceType: string;

  /**
   * Service release version
   * @example "045" // Version 4.5
   */
  serviceVersion?: string;

  /**
   * CNAB reserved field
   */
  cnabReserved1?: string;

  /**
   * Company registration type
   * - "0" = CPF
   * - "1" = CNPJ
   * - "2" = PIS/PASEP
   */
  companyRegistrationType: string;

  /**
   * Company registration number (CPF/CNPJ)
   */
  companyRegistrationNumber: string;

  /**
   * Bank agreement code
   */
  agreementCode?: string;

  /**
   * Company bank agency
   */
  agency: string;

  /**
   * Agency check digit
   */
  agencyDigit?: string;

  /**
   * Company bank account
   */
  account: string;

  /**
   * Account check digit
   */
  accountDigit: string;

  /**
   * Full account check digit
   */
  fullAccountDigit?: string;

  /**
   * Company name
   */
  companyName: string;

  /**
   * Message for all slips in this batch (optional)
   */
  message1?: string;

  /**
   * Additional message (optional)
   */
  message2?: string;

  /**
   * Sequential number for remittance/return control
   */
  remittanceReturnNumber?: number;

  /**
   * Recording date
   */
  recordingDate?: Date;

  /**
   * Credit date (for payments)
   */
  creditDate?: Date;

  /**
   * CNAB reserved field
   */
  cnabReserved2?: string;
}
