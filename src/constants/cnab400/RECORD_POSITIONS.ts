/**
 * CNAB400 Record Field Position Maps
 *
 * Field position definitions for all CNAB400 record types.
 * Positions are 1-indexed (first character is position 1).
 * All records are exactly 400 characters long.
 *
 * @module constants/cnab400/RECORD_POSITIONS
 */

/**
 * File Header (Record Type 0) field positions
 * Total: 400 characters
 */
export const FILE_HEADER_POSITIONS = {
  RECORD_TYPE: { start: 1, end: 1 },
  OPERATION_TYPE: { start: 2, end: 2 },
  OPERATION_LITERAL: { start: 3, end: 9 },
  SERVICE_CODE: { start: 10, end: 11 },
  SERVICE_LITERAL: { start: 12, end: 26 },
  AGENCY: { start: 27, end: 30 },
  ZEROS: { start: 31, end: 32 },
  ACCOUNT: { start: 33, end: 37 },
  ACCOUNT_DIGIT: { start: 38, end: 38 },
  RESERVED_1: { start: 39, end: 46 },
  COMPANY_NAME: { start: 47, end: 76 },
  BANK_CODE: { start: 77, end: 79 },
  BANK_NAME: { start: 80, end: 94 },
  GENERATION_DATE: { start: 95, end: 100 },
  RESERVED_2: { start: 101, end: 110 },
  SEQUENCE_NUMBER: { start: 111, end: 115 },
  RESERVED_3: { start: 116, end: 394 },
  SEQUENTIAL_NUMBER: { start: 395, end: 400 },
} as const;

/**
 * File Header - RETORNO specific positions
 * Additional fields only present in RETORNO files
 */
export const FILE_HEADER_RETORNO_POSITIONS = {
  ...FILE_HEADER_POSITIONS,
  CREATION_DATE: { start: 114, end: 119 },
} as const;

/**
 * Detail Record (Record Type 1 - REMESSA) field positions
 * Total: 400 characters
 */
export const DETAIL_RECORD_REMESSA_POSITIONS = {
  RECORD_TYPE: { start: 1, end: 1 },
  REGISTRATION_TYPE: { start: 2, end: 3 },
  REGISTRATION_NUMBER: { start: 4, end: 17 },
  AGENCY: { start: 18, end: 21 },
  ZEROS: { start: 22, end: 23 },
  ACCOUNT: { start: 24, end: 28 },
  ACCOUNT_DIGIT: { start: 29, end: 29 },
  RESERVED_1: { start: 30, end: 37 },
  COMPANY_CONTROL: { start: 38, end: 62 },
  OUR_NUMBER: { start: 63, end: 70 },
  RESERVED_2: { start: 71, end: 83 },
  PORTFOLIO_CODE: { start: 84, end: 86 },
  RESERVED_3: { start: 87, end: 107 },
  RESERVED_4: { start: 108, end: 110 },
  DOCUMENT_NUMBER: { start: 111, end: 120 },
  DUE_DATE: { start: 121, end: 126 },
  AMOUNT: { start: 127, end: 139 },
  BANK_CODE: { start: 140, end: 142 },
  AGENCY_COLLECTOR: { start: 143, end: 147 },
  SPECIES_CODE: { start: 148, end: 149 },
  ACCEPTANCE: { start: 150, end: 150 },
  ISSUE_DATE: { start: 151, end: 156 },
  INSTRUCTION_CODE_1: { start: 157, end: 158 },
  INSTRUCTION_CODE_2: { start: 159, end: 160 },
  INTEREST_AMOUNT: { start: 161, end: 173 },
  DISCOUNT_DATE: { start: 174, end: 179 },
  DISCOUNT_AMOUNT: { start: 180, end: 192 },
  IOF_AMOUNT: { start: 193, end: 205 },
  REBATE_AMOUNT: { start: 206, end: 218 },
  PAYER_REGISTRATION_TYPE: { start: 219, end: 220 },
  PAYER_REGISTRATION_NUMBER: { start: 221, end: 234 },
  PAYER_NAME: { start: 235, end: 264 },
  RESERVED_5: { start: 265, end: 274 },
  PAYER_ADDRESS: { start: 275, end: 314 },
  RESERVED_6: { start: 315, end: 326 },
  PAYER_ZIP_CODE: { start: 327, end: 334 },
  PAYER_CITY: { start: 335, end: 349 },
  PAYER_STATE: { start: 350, end: 351 },
  GUARANTOR_NAME: { start: 352, end: 381 },
  RESERVED_7: { start: 382, end: 394 },
  SEQUENTIAL_NUMBER: { start: 395, end: 400 },
} as const;

/**
 * Detail Record (Record Type 1 - RETORNO) field positions
 * Total: 400 characters
 */
export const DETAIL_RECORD_RETORNO_POSITIONS = {
  RECORD_TYPE: { start: 1, end: 1 },
  REGISTRATION_TYPE: { start: 2, end: 3 },
  REGISTRATION_NUMBER: { start: 4, end: 17 },
  AGENCY: { start: 18, end: 21 },
  ZEROS: { start: 22, end: 23 },
  ACCOUNT: { start: 24, end: 28 },
  ACCOUNT_DIGIT: { start: 29, end: 29 },
  RESERVED_1: { start: 30, end: 37 },
  COMPANY_CONTROL: { start: 38, end: 62 },
  OUR_NUMBER: { start: 63, end: 70 },
  RESERVED_2: { start: 71, end: 107 },
  PORTFOLIO_CODE: { start: 108, end: 108 },
  OCCURRENCE_CODE: { start: 109, end: 110 },
  OCCURRENCE_DATE: { start: 111, end: 116 },
  DOCUMENT_NUMBER: { start: 117, end: 126 },
  RESERVED_3: { start: 127, end: 146 },
  DUE_DATE: { start: 147, end: 152 },
  AMOUNT: { start: 153, end: 165 },
  BANK_CODE: { start: 166, end: 168 },
  AGENCY_COLLECTOR: { start: 169, end: 172 },
  AGENCY_DIGIT: { start: 173, end: 173 },
  SPECIES_CODE: { start: 174, end: 175 },
  COLLECTION_FEE: { start: 176, end: 188 },
  RESERVED_4: { start: 189, end: 214 },
  IOF_AMOUNT: { start: 215, end: 227 },
  REBATE_AMOUNT: { start: 228, end: 240 },
  DISCOUNT_AMOUNT: { start: 241, end: 253 },
  RECEIVED_AMOUNT: { start: 254, end: 266 },
  INTEREST_AMOUNT: { start: 267, end: 279 },
  OTHER_CHARGES: { start: 280, end: 292 },
  RESERVED_5: { start: 293, end: 294 },
  CREDIT_DATE: { start: 295, end: 300 },
  INSTRUCTION_CODE: { start: 301, end: 304 },
  RESERVED_6: { start: 305, end: 377 },
  REJECTION_REASON: { start: 378, end: 385 },
  RESERVED_7: { start: 386, end: 394 },
  SEQUENTIAL_NUMBER: { start: 395, end: 400 },
} as const;

/**
 * Penalty Record (Record Type 2) field positions
 * Total: 400 characters
 */
export const PENALTY_RECORD_POSITIONS = {
  RECORD_TYPE: { start: 1, end: 1 },
  MESSAGE_LINE_1: { start: 2, end: 81 },
  MESSAGE_LINE_2: { start: 82, end: 161 },
  MESSAGE_LINE_3: { start: 162, end: 241 },
  MESSAGE_LINE_4: { start: 242, end: 321 },
  RESERVED: { start: 322, end: 394 },
  SEQUENTIAL_NUMBER: { start: 395, end: 400 },
} as const;

/**
 * File Trailer (Record Type 9) field positions
 * Total: 400 characters
 */
export const FILE_TRAILER_POSITIONS = {
  RECORD_TYPE: { start: 1, end: 1 },
  TOTAL_RECORDS: { start: 2, end: 7 },
  TOTAL_AMOUNT: { start: 8, end: 20 },
  RESERVED: { start: 21, end: 394 },
  SEQUENTIAL_NUMBER: { start: 395, end: 400 },
} as const;

/**
 * Helper function to validate position ranges
 * Ensures positions don't overlap and cover all 400 characters
 */
export function validatePositions(
  positions: Record<string, { start: number; end: number }>,
): boolean {
  const ranges = Object.values(positions).sort((a, b) => a.start - b.start);

  // Check first position starts at 1
  if (ranges[0].start !== 1) return false;

  // Check last position ends at 400
  if (ranges[ranges.length - 1].end !== 400) return false;

  // Check no gaps or overlaps
  for (let i = 0; i < ranges.length - 1; i++) {
    const current = ranges[i];
    const next = ranges[i + 1];

    // Allow consecutive ranges (end + 1 = next start)
    if (current.end + 1 !== next.start) {
      return false;
    }
  }

  return true;
}
