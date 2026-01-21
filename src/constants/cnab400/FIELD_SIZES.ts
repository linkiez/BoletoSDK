/**
 * CNAB400 Field Size Constants
 *
 * Standard field lengths for all CNAB400 record types.
 * All sizes are in characters.
 *
 * @module constants/cnab400/FIELD_SIZES
 */

/**
 * Common field sizes used across multiple record types
 */
export const COMMON_FIELD_SIZES = {
  /** Record type indicator (1 digit: 0, 1, 2, 9) */
  RECORD_TYPE: 1,

  /** Operation type (1 digit: 1=REMESSA, 2=RETORNO) */
  OPERATION_TYPE: 1,

  /** Service code (2 digits) */
  SERVICE_CODE: 2,

  /** Bank code (3 digits) */
  BANK_CODE: 3,

  /** Agency number (4 digits) */
  AGENCY: 4,

  /** Account number (5 digits) */
  ACCOUNT: 5,

  /** Account check digit (1 digit) */
  ACCOUNT_DIGIT: 1,

  /** Company registration number - CPF/CNPJ (14 digits) */
  REGISTRATION_NUMBER: 14,

  /** Company registration type (2 digits: 01=CPF, 02=CNPJ, 03=PIS) */
  REGISTRATION_TYPE: 2,

  /** Our number - bank identification (8 digits) */
  OUR_NUMBER: 8,

  /** Document number (10 digits) */
  DOCUMENT_NUMBER: 10,

  /** Portfolio code (3 digits) */
  PORTFOLIO_CODE: 3,

  /** Date in DDMMYY format (6 digits) */
  DATE_SHORT: 6,

  /** Amount (13 digits with 2 implied decimals) */
  AMOUNT: 13,

  /** Species code (2 digits) */
  SPECIES_CODE: 2,

  /** Acceptance (1 character: A=Aceite, N=Não aceite) */
  ACCEPTANCE: 1,

  /** Instruction code (2 digits) */
  INSTRUCTION_CODE: 2,

  /** Occurrence code (2 digits) */
  OCCURRENCE_CODE: 2,

  /** Sequential number (6 digits) */
  SEQUENTIAL_NUMBER: 6,

  /** Interest amount (13 digits with 2 implied decimals) */
  INTEREST_AMOUNT: 13,

  /** Discount amount (13 digits with 2 implied decimals) */
  DISCOUNT_AMOUNT: 13,

  /** Fine amount (13 digits with 2 implied decimals) */
  FINE_AMOUNT: 13,

  /** Name (30 characters) */
  NAME: 30,

  /** Address (40 characters) */
  ADDRESS: 40,

  /** City (15 characters) */
  CITY: 15,

  /** State (2 characters) */
  STATE: 2,

  /** ZIP code (8 digits) */
  ZIP_CODE: 8,
} as const;

/**
 * File Header (Type 0) specific field sizes
 */
export const FILE_HEADER_SIZES = {
  /** Operation literal (7 characters: REMESSA/RETORNO) */
  OPERATION_LITERAL: 7,

  /** Service literal (15 characters: COBRANCA) */
  SERVICE_LITERAL: 15,

  /** Zeros placeholder (2 digits) */
  ZEROS: 2,

  /** Company name (30 characters) */
  COMPANY_NAME: 30,

  /** Bank name (15 characters) */
  BANK_NAME: 15,

  /** Generation date (6 digits: DDMMYY) */
  GENERATION_DATE: 6,

  /** File sequence number (5 digits) */
  SEQUENCE_NUMBER: 5,

  /** Creation date - RETORNO only (6 digits: DDMMYY) */
  CREATION_DATE: 6,

  /** Reserved/blank space (various sizes) */
  RESERVED_8: 8,
  RESERVED_16: 16,
  RESERVED_294: 294,
} as const;

/**
 * Detail Record (Type 1) specific field sizes
 */
export const DETAIL_RECORD_SIZES = {
  /** Company control field (25 characters) */
  COMPANY_CONTROL: 25,

  /** Payer name (30 characters) */
  PAYER_NAME: 30,

  /** Payer address (40 characters) */
  PAYER_ADDRESS: 40,

  /** Payer neighborhood (12 characters) */
  PAYER_NEIGHBORHOOD: 12,

  /** Payer city (15 characters) */
  PAYER_CITY: 15,

  /** Payer state (2 characters) */
  PAYER_STATE: 2,

  /** Payer ZIP code (8 digits) */
  PAYER_ZIP_CODE: 8,

  /** Guarantor name (30 characters) */
  GUARANTOR_NAME: 30,

  /** Guarantor registration (14 digits) */
  GUARANTOR_REGISTRATION: 14,

  /** Reserved/blank space (various sizes) */
  RESERVED_1: 1,
  RESERVED_8: 8,
  RESERVED_10: 10,
  RESERVED_20: 20,
} as const;

/**
 * Penalty Record (Type 2) specific field sizes
 */
export const PENALTY_RECORD_SIZES = {
  /** Message/instruction line (80 characters) */
  MESSAGE_LINE: 80,

  /** Reserved/blank space */
  RESERVED_318: 318,
} as const;

/**
 * File Trailer (Type 9) specific field sizes
 */
export const FILE_TRAILER_SIZES = {
  /** Total number of detail records (6 digits) */
  TOTAL_RECORDS: 6,

  /** Total amount of all slips (13 digits with 2 implied decimals) */
  TOTAL_AMOUNT: 13,

  /** Reserved/blank space */
  RESERVED_374: 374,
} as const;

/**
 * Total line length validation constant
 */
export const TOTAL_LINE_LENGTH = 400 as const;
