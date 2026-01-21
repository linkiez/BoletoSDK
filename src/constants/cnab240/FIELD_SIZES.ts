/**
 * CNAB240 Field Size Constants
 *
 * Standard field lengths for CNAB240 file format.
 * All sizes are in number of characters.
 *
 * @module constants/cnab240/FIELD_SIZES
 */

/**
 * Common field sizes used across multiple records
 */
export const COMMON_FIELD_SIZES = {
  /** Bank code (3 digits) */
  BANK_CODE: 3,

  /** Record type code (1 digit: 0, 1, 3, 5, 9) */
  RECORD_TYPE: 1,

  /** Batch number (4 digits) */
  BATCH_NUMBER: 4,

  /** Sequential record number (5 digits) */
  RECORD_NUMBER: 5,

  /** Segment code (1 character: P, Q, R, etc.) */
  SEGMENT_CODE: 1,

  /** Operation type (1 character: C, D, E, I) */
  OPERATION_TYPE: 1,

  /** Service type (2 digits) */
  SERVICE_TYPE: 2,

  /** Agency code (5 digits) */
  AGENCY: 5,

  /** Agency check digit (1 character) */
  AGENCY_DIGIT: 1,

  /** Account number (12 digits) */
  ACCOUNT: 12,

  /** Account check digit (1 character) */
  ACCOUNT_DIGIT: 1,

  /** Account digit verifier (1 character) */
  ACCOUNT_DV: 1,

  /** Company name (30 characters) */
  COMPANY_NAME: 30,

  /** Bank name (30 characters) */
  BANK_NAME: 30,

  /** Document number (Our Number - 20 characters) */
  DOCUMENT_NUMBER: 20,

  /** Portfolio code (1 character) */
  PORTFOLIO: 1,

  /** Document type code (1 digit) */
  DOCUMENT_TYPE: 1,

  /** Person type (1 digit: 1=CPF, 2=CNPJ) */
  PERSON_TYPE: 1,

  /** Tax ID (CPF/CNPJ - 15 characters) */
  TAX_ID: 15,

  /** Name (40 characters) */
  NAME: 40,

  /** Address (40 characters) */
  ADDRESS: 40,

  /** District/neighborhood (15 characters) */
  DISTRICT: 15,

  /** City (15 characters) */
  CITY: 15,

  /** State (2 characters) */
  STATE: 2,

  /** ZIP code (CEP - 8 digits) */
  ZIP_CODE: 8,

  /** Date (8 digits: DDMMYYYY) */
  DATE: 8,

  /** Amount (15 digits with 2 implied decimals) */
  AMOUNT: 15,

  /** Percentage (5 digits with 2 implied decimals) */
  PERCENTAGE: 5,

  /** Currency code (3 digits) */
  CURRENCY: 3,

  /** Occurrence code (2 digits) */
  OCCURRENCE_CODE: 2,

  /** Message (40 characters) */
  MESSAGE: 40,

  /** Reserved field (various sizes) */
  RESERVED_10: 10,
  RESERVED_20: 20,
  RESERVED_33: 33,
} as const;

/**
 * File Header (Type 0) specific field sizes
 */
export const FILE_HEADER_SIZES = {
  /** Layout version (3 digits: 087) */
  LAYOUT_VERSION: 3,

  /** File density (5 digits) */
  FILE_DENSITY: 5,

  /** Record size (3 digits: 240) */
  RECORD_SIZE: 3,

  /** Block size (3 digits) */
  BLOCK_SIZE: 3,

  /** Generation date (8 digits: DDMMYYYY) */
  GENERATION_DATE: 8,

  /** Generation time (6 digits: HHMMSS) */
  GENERATION_TIME: 6,

  /** File sequence number (6 digits) */
  FILE_SEQUENCE: 6,
} as const;

/**
 * Batch Header (Type 1) specific field sizes
 */
export const BATCH_HEADER_SIZES = {
  /** Form of launch (1 digit) */
  LAUNCH_FORM: 1,

  /** Layout version (3 digits: 040, 041, 042) */
  LAYOUT_VERSION: 3,

  /** Warning code (2 digits) */
  WARNING_CODE: 2,

  /** Message 1 (40 characters) */
  MESSAGE_1: 40,

  /** Message 2 (40 characters) */
  MESSAGE_2: 40,

  /** Return address (40 characters) */
  RETURN_ADDRESS: 40,
} as const;

/**
 * Segment P specific field sizes
 */
export const SEGMENT_P_SIZES = {
  /** Movement code (2 digits) */
  MOVEMENT_CODE: 2,

  /** Account type (1 digit) */
  ACCOUNT_TYPE: 1,

  /** Boleto type (1 character) */
  BOLETO_TYPE: 1,

  /** Boleto form (1 character) */
  BOLETO_FORM: 1,

  /** Document print (1 character) */
  DOCUMENT_PRINT: 1,

  /** Posting form (1 character) */
  POSTING_FORM: 1,

  /** Issue date (8 digits: DDMMYYYY) */
  ISSUE_DATE: 8,

  /** Credit date (8 digits: DDMMYYYY) */
  CREDIT_DATE: 8,

  /** Interest code (1 digit) */
  INTEREST_CODE: 1,

  /** Interest date (8 digits: DDMMYYYY) */
  INTEREST_DATE: 8,

  /** Interest amount (15 digits) */
  INTEREST_AMOUNT: 15,

  /** Discount code (1 digit) */
  DISCOUNT_CODE: 1,

  /** Discount date (8 digits: DDMMYYYY) */
  DISCOUNT_DATE: 8,

  /** Discount amount (15 digits) */
  DISCOUNT_AMOUNT: 15,

  /** IOF amount (15 digits) */
  IOF_AMOUNT: 15,

  /** Rebate amount (15 digits) */
  REBATE_AMOUNT: 15,

  /** Protest code (1 digit) */
  PROTEST_CODE: 1,

  /** Protest days (2 digits) */
  PROTEST_DAYS: 2,

  /** Low code (1 digit) */
  LOW_CODE: 1,

  /** Low days (3 digits) */
  LOW_DAYS: 3,
} as const;

/**
 * Segment Q specific field sizes
 */
export const SEGMENT_Q_SIZES = {
  /** Payer name (40 characters) */
  PAYER_NAME: 40,

  /** Payer address (40 characters) */
  PAYER_ADDRESS: 40,

  /** Payer district (15 characters) */
  PAYER_DISTRICT: 15,

  /** Payer city (15 characters) */
  PAYER_CITY: 15,

  /** Payer state (2 characters) */
  PAYER_STATE: 2,

  /** Payer ZIP code (8 digits) */
  PAYER_ZIP_CODE: 8,

  /** Guarantor name (40 characters) */
  GUARANTOR_NAME: 40,

  /** Guarantor tax ID (15 characters) */
  GUARANTOR_TAX_ID: 15,
} as const;

/**
 * Segment R specific field sizes
 */
export const SEGMENT_R_SIZES = {
  /** Discount 2 code (1 digit) */
  DISCOUNT_2_CODE: 1,

  /** Discount 2 date (8 digits: DDMMYYYY) */
  DISCOUNT_2_DATE: 8,

  /** Discount 2 amount (15 digits) */
  DISCOUNT_2_AMOUNT: 15,

  /** Discount 3 code (1 digit) */
  DISCOUNT_3_CODE: 1,

  /** Discount 3 date (8 digits: DDMMYYYY) */
  DISCOUNT_3_DATE: 8,

  /** Discount 3 amount (15 digits) */
  DISCOUNT_3_AMOUNT: 15,

  /** Fine code (1 digit) */
  FINE_CODE: 1,

  /** Fine date (8 digits: DDMMYYYY) */
  FINE_DATE: 8,

  /** Fine amount (15 digits) */
  FINE_AMOUNT: 15,
} as const;

/**
 * Batch Trailer (Type 5) specific field sizes
 */
export const BATCH_TRAILER_SIZES = {
  /** Quantity of detail records (6 digits) */
  DETAIL_COUNT: 6,

  /** Quantity of slips (6 digits) */
  SLIP_COUNT: 6,

  /** Total slip amounts (17 digits) */
  TOTAL_AMOUNT: 17,

  /** Total warning amounts (17 digits) */
  WARNING_AMOUNT: 17,
} as const;

/**
 * File Trailer (Type 9) specific field sizes
 */
export const FILE_TRAILER_SIZES = {
  /** Quantity of batches (6 digits) */
  BATCH_COUNT: 6,

  /** Quantity of records (6 digits) */
  RECORD_COUNT: 6,

  /** Quantity of accounts (6 digits) */
  ACCOUNT_COUNT: 6,
} as const;

/**
 * Total line length (constant validation)
 */
export const TOTAL_LINE_LENGTH = 240 as const;

/**
 * Common position constants (1-indexed)
 */
export const RECORD_TYPE_POSITION = 8;
export const SEGMENT_CODE_POSITION = 14;
