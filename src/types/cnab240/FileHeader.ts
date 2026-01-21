/**
 * CNAB240 File Header (Record Type 0)
 *
 * The file header contains general information about the file,
 * the company, and the bank. Each CNAB240 file has exactly one file header.
 *
 * @see FEBRABAN CNAB240 Specification - Layout 01 (Header Arquivo)
 */
export interface FileHeader {
  /**
   * Bank code (3 digits)
   * @example "341" // Itaú
   */
  bankCode: string;

  /**
   * Batch number - Always "0000" for file header
   */
  batchNumber: string;

  /**
   * Record type - Always "0" for file header
   */
  recordType: string;

  /**
   * CNAB reserved field
   */
  cnabReserved1?: string;

  /**
   * Company registration type
   * - "0" = CPF (Individual)
   * - "1" = CNPJ (Company)
   * - "2" = PIS/PASEP
   */
  companyRegistrationType: string;

  /**
   * Company registration number (CPF/CNPJ)
   * @example "12345678000195" // CNPJ
   */
  companyRegistrationNumber: string;

  /**
   * Bank agreement code/contract number
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
   * Full account check digit (agency + account)
   */
  fullAccountDigit?: string;

  /**
   * Company name
   * @example "JCM INDUSTRIA E COMERCIO LTDA"
   */
  companyName: string;

  /**
   * Bank name
   * @example "BANCO ITAU SA"
   */
  bankName: string;

  /**
   * CNAB reserved field
   */
  cnabReserved2?: string;

  /**
   * File code
   * - "1" = Remessa (Remittance - to bank)
   * - "2" = Retorno (Return - from bank)
   */
  fileCode: string;

  /**
   * File generation date
   */
  generationDate: Date;

  /**
   * File generation time (HHMMSS)
   */
  generationTime?: string;

  /**
   * Sequential file number
   */
  sequentialNumber: number;

  /**
   * Layout version
   * @example "103" // CNAB240 version 10.3
   */
  layoutVersion: string;

  /**
   * Currency code
   * @example "09" // BRL (Real)
   */
  currencyCode?: string;

  /**
   * File density (for magnetic tape - usually blank)
   */
  density?: string;

  /**
   * Bank reserved field
   */
  bankReserved?: string;

  /**
   * Company reserved field
   */
  companyReserved?: string;

  /**
   * CNAB reserved field
   */
  cnabReserved3?: string;
}
