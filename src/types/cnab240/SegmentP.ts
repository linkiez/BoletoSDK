/**
 * CNAB240 Segment P (Record Type 3 - Segment P)
 *
 * Segment P contains the main bank slip/payment data.
 * This is the primary segment for collection operations.
 *
 * @see FEBRABAN CNAB240 Specification - Segmento P (Obrigatório)
 */
export interface SegmentP {
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
   * Sequential number within batch
   */
  sequentialNumber: number;

  /**
   * Segment code - Always "P" for this segment
   */
  segmentCode: string;

  /**
   * CNAB reserved field
   */
  cnabReserved1?: string;

  /**
   * Movement/Occurrence code
   * @example "01" // Entry registration
   * @example "02" // Entry request
   * @example "06" // Payment confirmation
   */
  occurrenceCode: string;

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
   * Bank's "our number" - unique slip identifier
   */
  ourNumber: string;

  /**
   * Our number check digit
   */
  ourNumberDigit?: string;

  /**
   * Portfolio/wallet code
   * @example "109" // Itaú electronic portfolio
   */
  portfolioCode: string;

  /**
   * Form type
   * - "1" = Bank slip self-copy
   * - "2" = Bank slip deposit/collection receipt copy
   * - "4" = Booklet position
   */
  formType?: string;

  /**
   * Bank slip number (if pre-printed)
   */
  slipNumber?: string;

  /**
   * Bank slip number check digit
   */
  slipNumberDigit?: string;

  /**
   * Issuance type
   * - "1" = Bank issues
   * - "2" = Company issues
   */
  issuanceType?: string;

  /**
   * Distribution type
   * - "1" = Bank distributes
   * - "2" = Company distributes
   */
  distributionType?: string;

  /**
   * Document number (invoice number, contract number, etc.)
   */
  documentNumber: string;

  /**
   * Due date
   */
  dueDate: Date;

  /**
   * Slip nominal amount (in cents)
   * @example 15000 // R$ 150.00
   */
  amount: number;

  /**
   * Collection agency (if different from company agency)
   */
  collectionAgency?: string;

  /**
   * Collection agency check digit
   */
  collectionAgencyDigit?: string;

  /**
   * Document species code
   * @example "01" // Duplicata Mercantil
   * @example "02" // Nota Promissória
   */
  speciesCode: string;

  /**
   * Acceptance
   * - "A" = Accepted
   * - "N" = Not accepted
   */
  acceptance: string;

  /**
   * Issue date
   */
  issueDate: Date;

  /**
   * Interest code
   * - "0" = No interest
   * - "1" = Daily amount
   * - "2" = Monthly percentage
   */
  interestCode?: string;

  /**
   * Interest start date
   */
  interestDate?: Date;

  /**
   * Interest amount or percentage
   * If interestCode = 1: daily amount in cents
   * If interestCode = 2: monthly percentage (basis points)
   */
  interestAmount?: number;

  /**
   * Discount code
   * - "0" = No discount
   * - "1" = Fixed amount
   * - "2" = Percentage
   */
  discountCode?: string;

  /**
   * Discount date
   */
  discountDate?: Date;

  /**
   * Discount amount or percentage
   */
  discountAmount?: number;

  /**
   * IOF amount (in cents)
   */
  iofAmount?: number;

  /**
   * Rebate/Allowance amount (in cents)
   */
  rebateAmount?: number;

  /**
   * Protest code
   * - "1" = Protest
   * - "2" = Do not protest (bank default)
   * - "3" = Use company instruction
   */
  protestCode?: string;

  /**
   * Number of days until protest (if protestCode = 1)
   */
  protestDays?: number;

  /**
   * Write-off code
   * - "1" = Write off
   * - "2" = Do not write off
   * - "3" = Cancel write-off
   */
  writeOffCode?: string;

  /**
   * Number of days until write-off
   */
  writeOffDays?: number;

  /**
   * Currency code
   * @example "09" // Brazilian Real (BRL)
   */
  currencyCode: string;

  /**
   * Company identification (35.3P) - 25 characters
   * Internal reference/document number used by the company
   */
  companyIdentification?: string;

  /**
   * Contract number (41.3P) - 10 characters
   * Loan/credit operation contract number
   */
  contractNumber?: string;

  /**
   * Agreement number (optional)
   */
  agreementNumber?: string;

  /**
   * CNAB reserved field
   */
  cnabReserved2?: string;
}
