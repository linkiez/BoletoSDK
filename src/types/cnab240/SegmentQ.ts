/**
 * CNAB240 Segment Q (Record Type 3 - Segment Q)
 *
 * Segment Q contains payer (sacado) information.
 * This segment is mandatory and always follows Segment P.
 *
 * @see FEBRABAN CNAB240 Specification - Segmento Q (Obrigatório)
 */
export interface SegmentQ {
  /**
   * Bank code (3 digits)
   * @example "341" // Itaú
   */
  bankCode: string;

  /**
   * Batch number
   */
  batchNumber: number;

  /**
   * Record type - Always "3" for detail
   */
  recordType: string;

  /**
   * Sequential number within batch (must be sequentialNumber + 1 from Segment P)
   */
  sequentialNumber: number;

  /**
   * Segment code - Always "Q" for this segment
   */
  segmentCode: string;

  /**
   * CNAB reserved field
   */
  cnabReserved1?: string;

  /**
   * Movement/Occurrence code (must match Segment P)
   */
  occurrenceCode: string;

  /**
   * Payer registration type
   * - "0" = CPF
   * - "1" = CNPJ
   * - "2" = PIS/PASEP
   * - "9" = Other
   */
  payerRegistrationType: string;

  /**
   * Payer CPF/CNPJ
   * @example "12345678901" // CPF
   * @example "12345678000195" // CNPJ
   */
  payerTaxId: string;

  /**
   * Payer name
   * @example "ACME CORPORATION LTDA"
   */
  payerName: string;

  /**
   * Payer address (street, number, complement)
   */
  payerAddress: string;

  /**
   * Payer neighborhood/district
   */
  payerNeighborhood: string;

  /**
   * Payer postal code (CEP)
   * @example "01310100"
   */
  payerPostalCode: string;

  /**
   * Payer city
   * @example "SAO PAULO"
   */
  payerCity: string;

  /**
   * Payer state (UF)
   * @example "SP"
   */
  payerState: string;

  /**
   * Guarantor registration type (if exists)
   * - "0" = CPF
   * - "1" = CNPJ
   */
  guarantorRegistrationType?: string;

  /**
   * Guarantor CPF/CNPJ (if exists)
   */
  guarantorTaxId?: string;

  /**
   * Guarantor name (if exists)
   */
  guarantorName?: string;

  /**
   * Correspondent bank code (for bank slips from other banks)
   */
  correspondentBankCode?: string;

  /**
   * Our number at correspondent bank
   */
  correspondentOurNumber?: string;

  /**
   * CNAB reserved field
   */
  cnabReserved2?: string;
}
