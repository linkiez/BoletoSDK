/**
 * CNAB240 Segment Field Position Maps
 *
 * Field position definitions for all CNAB240 segments.
 * Positions are 1-indexed (first character is position 1).
 *
 * @module constants/cnab240/SEGMENT_POSITIONS
 */

/**
 * File Header (Record Type 0) field positions
 * Total: 240 characters
 */
export const FILE_HEADER_POSITIONS = {
  BANK_CODE: { start: 1, end: 3 },
  BATCH_NUMBER: { start: 4, end: 7 },
  RECORD_TYPE: { start: 8, end: 8 },
  RESERVED_1: { start: 9, end: 17 },
  PERSON_TYPE: { start: 18, end: 18 },
  TAX_ID: { start: 19, end: 32 },
  AGREEMENT_CODE: { start: 33, end: 52 },
  AGENCY: { start: 53, end: 57 },
  AGENCY_DIGIT: { start: 58, end: 58 },
  ACCOUNT: { start: 59, end: 70 },
  ACCOUNT_DIGIT: { start: 71, end: 71 },
  ACCOUNT_DV: { start: 72, end: 72 },
  COMPANY_NAME: { start: 73, end: 102 },
  BANK_NAME: { start: 103, end: 132 },
  RESERVED_2: { start: 133, end: 142 },
  FILE_CODE: { start: 143, end: 143 },
  GENERATION_DATE: { start: 144, end: 151 },
  GENERATION_TIME: { start: 152, end: 157 },
  FILE_SEQUENCE: { start: 158, end: 163 },
  LAYOUT_VERSION: { start: 164, end: 166 },
  FILE_DENSITY: { start: 167, end: 171 },
  RESERVED_BANK: { start: 172, end: 191 },
  RESERVED_COMPANY: { start: 192, end: 211 },
  RESERVED_3: { start: 212, end: 240 },
} as const;

/**
 * Batch Header (Record Type 1) field positions
 * Total: 240 characters
 * Based on original implementation for Collection (Cobrança)
 */
export const BATCH_HEADER_POSITIONS = {
  BANK_CODE: { start: 1, end: 3 },
  BATCH_NUMBER: { start: 4, end: 7 },
  RECORD_TYPE: { start: 8, end: 8 },
  OPERATION_TYPE: { start: 9, end: 9 },
  SERVICE_TYPE: { start: 10, end: 11 },
  SERVICE_VERSION: { start: 12, end: 13 },
  RESERVED_1: { start: 14, end: 14 },
  FORM_TYPE: { start: 15, end: 17 },
  PERSON_TYPE: { start: 18, end: 18 },
  TAX_ID: { start: 19, end: 32 }, // CPF/CNPJ (14 positions)
  AGREEMENT_CODE: { start: 33, end: 52 },
  AGENCY: { start: 53, end: 57 },
  AGENCY_DIGIT: { start: 58, end: 58 },
  ACCOUNT: { start: 59, end: 70 },
  ACCOUNT_DIGIT: { start: 71, end: 71 },
  ACCOUNT_DV: { start: 72, end: 72 },
  COMPANY_NAME: { start: 73, end: 102 },
  MESSAGE_1: { start: 103, end: 142 },
  MESSAGE_2: { start: 143, end: 182 },
  RETURN_NUMBER: { start: 183, end: 190 },
  RETURN_DATE: { start: 191, end: 198 },
  CREDIT_DATE: { start: 199, end: 206 },
  RESERVED_2: { start: 207, end: 240 },
} as const;

/**
 * Segment P (Record Type 3, Segment P) field positions
 * Total: 240 characters
 */
export const SEGMENT_P_POSITIONS = {
  BANK_CODE: { start: 1, end: 3 },
  BATCH_NUMBER: { start: 4, end: 7 },
  RECORD_TYPE: { start: 8, end: 8 },
  RECORD_NUMBER: { start: 9, end: 13 },
  SEGMENT_CODE: { start: 14, end: 14 },
  RESERVED_1: { start: 15, end: 15 },
  MOVEMENT_CODE: { start: 16, end: 17 },
  AGENCY: { start: 18, end: 22 },
  AGENCY_DIGIT: { start: 23, end: 23 },
  ACCOUNT: { start: 24, end: 35 },
  ACCOUNT_DIGIT: { start: 36, end: 36 },
  ACCOUNT_DV: { start: 37, end: 37 },
  DOCUMENT_NUMBER: { start: 38, end: 57 },
  PORTFOLIO: { start: 58, end: 58 },
  BOLETO_TYPE: { start: 59, end: 59 },
  BOLETO_FORM: { start: 60, end: 60 },
  DOCUMENT_PRINT: { start: 61, end: 61 },
  POSTING_FORM: { start: 62, end: 62 },
  DOCUMENT_TYPE: { start: 63, end: 63 },
  ISSUE_DATE: { start: 64, end: 71 },
  CREDIT_DATE: { start: 72, end: 79 },
  DUE_DATE: { start: 80, end: 87 },
  AMOUNT: { start: 88, end: 102 },
  AGENCY_COLLECTOR: { start: 103, end: 107 },
  AGENCY_COLLECTOR_DIGIT: { start: 108, end: 108 },
  DOCUMENT_SPECIES: { start: 109, end: 110 },
  ACCEPTANCE: { start: 111, end: 111 },
  CURRENCY: { start: 112, end: 114 },
  INTEREST_CODE: { start: 115, end: 115 },
  INTEREST_DATE: { start: 116, end: 123 },
  INTEREST_AMOUNT: { start: 124, end: 138 },
  DISCOUNT_CODE: { start: 139, end: 139 },
  DISCOUNT_DATE: { start: 140, end: 147 },
  DISCOUNT_AMOUNT: { start: 148, end: 162 },
  IOF_AMOUNT: { start: 163, end: 177 },
  REBATE_AMOUNT: { start: 178, end: 192 },
  OCCURRENCE_CODE: { start: 193, end: 194 },
  PROTEST_CODE: { start: 195, end: 195 },
  PROTEST_DAYS: { start: 196, end: 197 },
  LOW_CODE: { start: 198, end: 198 },
  LOW_DAYS: { start: 199, end: 201 },
  CURRENCY_CODE: { start: 202, end: 203 },
  RESERVED_2: { start: 204, end: 240 },
} as const;

/**
 * Segment Q (Record Type 3, Segment Q) field positions
 * Total: 240 characters
 */
export const SEGMENT_Q_POSITIONS = {
  BANK_CODE: { start: 1, end: 3 },
  BATCH_NUMBER: { start: 4, end: 7 },
  RECORD_TYPE: { start: 8, end: 8 },
  RECORD_NUMBER: { start: 9, end: 13 },
  SEGMENT_CODE: { start: 14, end: 14 },
  RESERVED_1: { start: 15, end: 15 },
  MOVEMENT_CODE: { start: 16, end: 17 },
  PAYER_PERSON_TYPE: { start: 18, end: 18 },
  PAYER_TAX_ID: { start: 19, end: 33 },
  PAYER_NAME: { start: 34, end: 73 },
  PAYER_ADDRESS: { start: 74, end: 113 },
  PAYER_DISTRICT: { start: 114, end: 128 },
  PAYER_ZIP_CODE: { start: 129, end: 136 },
  PAYER_CITY: { start: 137, end: 151 },
  PAYER_STATE: { start: 152, end: 153 },
  GUARANTOR_PERSON_TYPE: { start: 154, end: 154 },
  GUARANTOR_TAX_ID: { start: 155, end: 169 },
  GUARANTOR_NAME: { start: 170, end: 209 },
  BANK_CORRESPONDENT_CODE: { start: 210, end: 212 },
  BANK_CORRESPONDENT_DOCUMENT: { start: 213, end: 232 },
  RESERVED_2: { start: 233, end: 240 },
} as const;

/**
 * Segment R (Record Type 3, Segment R) field positions
 * Total: 240 characters
 */
export const SEGMENT_R_POSITIONS = {
  BANK_CODE: { start: 1, end: 3 },
  BATCH_NUMBER: { start: 4, end: 7 },
  RECORD_TYPE: { start: 8, end: 8 },
  RECORD_NUMBER: { start: 9, end: 13 },
  SEGMENT_CODE: { start: 14, end: 14 },
  RESERVED_1: { start: 15, end: 15 },
  MOVEMENT_CODE: { start: 16, end: 17 },
  DISCOUNT_2_CODE: { start: 18, end: 18 },
  DISCOUNT_2_DATE: { start: 19, end: 26 },
  DISCOUNT_2_AMOUNT: { start: 27, end: 41 },
  DISCOUNT_3_CODE: { start: 42, end: 42 },
  DISCOUNT_3_DATE: { start: 43, end: 50 },
  DISCOUNT_3_AMOUNT: { start: 51, end: 65 },
  FINE_CODE: { start: 66, end: 66 },
  FINE_DATE: { start: 67, end: 74 },
  FINE_AMOUNT: { start: 75, end: 89 },
  PAYER_INFO: { start: 90, end: 99 },
  MESSAGE_3: { start: 100, end: 139 },
  MESSAGE_4: { start: 140, end: 179 },
  RESERVED_2: { start: 180, end: 199 },
  OCCURRENCE_CODE_COMPLEMENT: { start: 200, end: 207 },
  DEBIT_BANK_CODE: { start: 208, end: 210 },
  DEBIT_AGENCY: { start: 211, end: 215 },
  DEBIT_AGENCY_DIGIT: { start: 216, end: 216 },
  DEBIT_ACCOUNT: { start: 217, end: 228 },
  DEBIT_ACCOUNT_DIGIT: { start: 229, end: 229 },
  DEBIT_ACCOUNT_DV: { start: 230, end: 230 },
  RESERVED_3: { start: 231, end: 240 },
} as const;

/**
 * Batch Trailer (Record Type 5) field positions
 * Total: 240 characters
 * Based on original implementation for Collection (Cobrança) with multiple total types
 */
export const BATCH_TRAILER_POSITIONS = {
  BANK_CODE: { start: 1, end: 3 },
  BATCH_NUMBER: { start: 4, end: 7 },
  RECORD_TYPE: { start: 8, end: 8 },
  RESERVED_1: { start: 9, end: 17 },
  DETAIL_COUNT: { start: 18, end: 23 }, // Total records in batch
  TOTAL_SIMPLE_SLIPS: { start: 24, end: 29 }, // Total simple slips quantity
  TOTAL_SIMPLE_AMOUNT: { start: 30, end: 47 }, // Total simple slips amount (18 positions, 16+2 decimal)
  TOTAL_ENDORSED_SLIPS: { start: 48, end: 53 }, // Total endorsed slips quantity
  TOTAL_ENDORSED_AMOUNT: { start: 54, end: 71 }, // Total endorsed slips amount (18 positions, 16+2 decimal)
  TOTAL_COLLECTION_SLIPS: { start: 72, end: 77 }, // Total collection slips quantity
  TOTAL_COLLECTION_AMOUNT: { start: 78, end: 95 }, // Total collection slips amount (18 positions, 16+2 decimal)
  WARNING_CODE: { start: 96, end: 103 }, // Reference/warning number
  RESERVED_2: { start: 104, end: 240 },
} as const;

/**
 * File Trailer (Record Type 9) field positions
 * Total: 240 characters
 */
export const FILE_TRAILER_POSITIONS = {
  BANK_CODE: { start: 1, end: 3 },
  BATCH_NUMBER: { start: 4, end: 7 },
  RECORD_TYPE: { start: 8, end: 8 },
  RESERVED_1: { start: 9, end: 17 },
  BATCH_COUNT: { start: 18, end: 23 },
  RECORD_COUNT: { start: 24, end: 29 },
  ACCOUNT_COUNT: { start: 30, end: 35 },
  RESERVED_2: { start: 36, end: 240 },
} as const;

/**
 * Helper function to validate position ranges
 * Ensures positions don't overlap and cover all 240 characters
 */
export function validatePositions(
  positions: Record<string, { start: number; end: number }>,
): boolean {
  const ranges = Object.values(positions).sort((a, b) => a.start - b.start);

  // Check first position starts at 1
  if (ranges[0].start !== 1) return false;

  // Check last position ends at 240
  if (ranges[ranges.length - 1].end !== 240) return false;

  // Check no gaps or overlaps
  for (let i = 0; i < ranges.length - 1; i++) {
    const current = ranges[i];
    const next = ranges[i + 1];

    // Check for gaps
    if (current.end + 1 !== next.start) {
      // Allow consecutive ranges (end + 1 = next start)
      if (current.end !== next.start - 1) return false;
    }
  }

  return true;
}
