/**
 * CNAB240 Main Parser
 *
 * Parses complete CNAB240 files with hierarchical structure:
 * File → Batches → Details → Segments
 *
 * @module parsers/cnab240/Cnab240Parser
 */

import {
  BATCH_HEADER_POSITIONS,
  BATCH_TRAILER_POSITIONS,
  FILE_TRAILER_POSITIONS,
  RECORD_TYPE,
  RECORD_TYPE_POSITION,
  SEGMENT_CODE_POSITION,
  SEGMENT_R_POSITIONS,
} from '../../constants/cnab240';
import { ParseError } from '../../errors';
import {
  Batch,
  BatchHeader,
  BatchTrailer,
  Cnab240File,
  DetailRecord,
  FileTrailer,
  SegmentR,
} from '../../types/cnab240';
import { parseFileHeader } from './FileHeaderParser';
import {
  extractField,
  parseDecimalField,
  parseNumericField,
  validateRecordType,
} from './LineParser';
import { parseSegmentP } from './SegmentPParser';
import { parseSegmentQ } from './SegmentQParser';

/**
 * Parse CNAB240 file and build hierarchical structure
 *
 * @param content - The complete CNAB240 file content
 * @returns Parsed Cnab240File object with full hierarchy
 * @throws {ParseError} If file structure is invalid
 *
 * @example
 * ```typescript
 * const cnabFile = parseCnab240(fileContent);
 * console.log(cnabFile.batches.length);
 * console.log(cnabFile.batches[0].details.length);
 * ```
 */
export function parseCnab240(content: string): Cnab240File {
  const lines = content.split('\n').filter((line) => line.trim().length > 0);

  if (lines.length < 3) {
    throw new ParseError(
      'CNAB240 file must have at least 3 lines (file header, batch, file trailer)',
    );
  }

  // Parse file header (first line)
  const fileHeader = parseFileHeader(lines[0]);

  // Parse file trailer (last line)
  const fileTrailer = parseFileTrailer(lines.at(-1)!);

  // Parse batches (everything between file header and trailer)
  const batches = parseBatches(lines.slice(1, -1));

  return {
    fileHeader,
    batches,
    fileTrailer,
  };
}

/**
 * Parse all batches from intermediate lines
 */
function parseBatches(lines: string[]): Batch[] {
  const batches: Batch[] = [];
  let currentBatchLines: string[] = [];

  for (const line of lines) {
    const recordType = extractField(line, RECORD_TYPE_POSITION, RECORD_TYPE_POSITION);

    if (recordType === RECORD_TYPE.BATCH_HEADER) {
      // Batch header - start new batch
      if (currentBatchLines.length > 0) {
        batches.push(parseBatch(currentBatchLines));
      }
      currentBatchLines = [line];
    } else {
      currentBatchLines.push(line);
    }
  }

  // Parse last batch
  if (currentBatchLines.length > 0) {
    batches.push(parseBatch(currentBatchLines));
  }

  return batches;
}

/**
 * Parse a single batch (header + details + trailer)
 */
function parseBatch(lines: string[]): Batch {
  if (lines.length < 3) {
    throw new ParseError('Batch must have at least 3 lines (header, detail, trailer)');
  }

  // Parse batch header
  const header = parseBatchHeader(lines[0]);

  // Parse batch trailer
  const trailer = parseBatchTrailer(lines.at(-1)!);

  // Parse detail records (segments P, Q, R)
  const details = parseDetailRecords(lines.slice(1, -1));

  return {
    header,
    details,
    trailer,
  };
}

/**
 * Parse detail records (group segments P+Q+R into DetailRecord objects)
 */
function parseDetailRecords(lines: string[]): DetailRecord[] {
  const details: DetailRecord[] = [];
  let currentDetail: Partial<DetailRecord> = {};

  for (const line of lines) {
    const segmentCode = extractField(line, SEGMENT_CODE_POSITION, SEGMENT_CODE_POSITION);

    if (segmentCode === 'P') {
      // Start new detail record
      if (currentDetail.segmentP) {
        details.push(currentDetail as DetailRecord);
      }
      currentDetail = { segmentP: parseSegmentP(line) };
    } else if (segmentCode === 'Q') {
      currentDetail.segmentQ = parseSegmentQ(line);
    } else if (segmentCode === 'R') {
      currentDetail.segmentR = parseSegmentR(line);
    }
  }

  // Add last detail
  if (currentDetail.segmentP && currentDetail.segmentQ) {
    details.push(currentDetail as DetailRecord);
  }

  return details;
}

/**
 * Parse batch header (record type 1)
 */
function parseBatchHeader(line: string): BatchHeader {
  validateRecordType(line, '1');
  const POS = BATCH_HEADER_POSITIONS;

  return {
    bankCode: extractField(line, POS.BANK_CODE.start, POS.BANK_CODE.end),
    batchNumber: parseNumericField(line, POS.BATCH_NUMBER.start, POS.BATCH_NUMBER.end),
    recordType: extractField(line, POS.RECORD_TYPE.start, POS.RECORD_TYPE.end),
    operationType: extractField(line, POS.OPERATION_TYPE.start, POS.OPERATION_TYPE.end),
    serviceType: extractField(line, POS.SERVICE_TYPE.start, POS.SERVICE_TYPE.end),
    companyRegistrationType: extractField(line, POS.PERSON_TYPE.start, POS.PERSON_TYPE.end),
    companyRegistrationNumber: extractField(line, POS.TAX_ID.start, POS.TAX_ID.end),
    agency: extractField(line, POS.AGENCY.start, POS.AGENCY.end),
    account: extractField(line, POS.ACCOUNT.start, POS.ACCOUNT.end),
    accountDigit: extractField(line, POS.ACCOUNT_DIGIT.start, POS.ACCOUNT_DIGIT.end),
    companyName: extractField(line, POS.COMPANY_NAME.start, POS.COMPANY_NAME.end),
    message1: extractField(line, POS.MESSAGE_1.start, POS.MESSAGE_1.end) || undefined,
    message2: extractField(line, POS.MESSAGE_2.start, POS.MESSAGE_2.end) || undefined,
  };
}

/**
 * Parse batch trailer (record type 5)
 */
function parseBatchTrailer(line: string): BatchTrailer {
  validateRecordType(line, '5');
  const POS = BATCH_TRAILER_POSITIONS;

  return {
    bankCode: extractField(line, POS.BANK_CODE.start, POS.BANK_CODE.end),
    batchNumber: parseNumericField(line, POS.BATCH_NUMBER.start, POS.BATCH_NUMBER.end),
    recordType: extractField(line, POS.RECORD_TYPE.start, POS.RECORD_TYPE.end),
    totalRecords: parseNumericField(line, POS.DETAIL_COUNT.start, POS.DETAIL_COUNT.end),
    totalSimpleSlips:
      parseNumericField(line, POS.TOTAL_SIMPLE_SLIPS.start, POS.TOTAL_SIMPLE_SLIPS.end) ||
      undefined,
    totalSimpleAmount:
      parseDecimalField(line, POS.TOTAL_SIMPLE_AMOUNT.start, POS.TOTAL_SIMPLE_AMOUNT.end, 2) ||
      undefined,
  };
}

/**
 * Parse file trailer (record type 9)
 */
function parseFileTrailer(line: string): FileTrailer {
  validateRecordType(line, '9');
  const POS = FILE_TRAILER_POSITIONS;

  return {
    bankCode: extractField(line, POS.BANK_CODE.start, POS.BANK_CODE.end),
    batchNumber: extractField(line, POS.BATCH_NUMBER.start, POS.BATCH_NUMBER.end),
    recordType: extractField(line, POS.RECORD_TYPE.start, POS.RECORD_TYPE.end),
    totalBatches: parseNumericField(line, POS.BATCH_COUNT.start, POS.BATCH_COUNT.end),
    totalRecords: parseNumericField(line, POS.RECORD_COUNT.start, POS.RECORD_COUNT.end),
    totalAccounts:
      parseNumericField(line, POS.ACCOUNT_COUNT.start, POS.ACCOUNT_COUNT.end) || undefined,
  };
}

/**
 * Parse Segment R (optional discount/fine details)
 * Uses SEGMENT_R_POSITIONS for field extraction
 */
function parseSegmentR(line: string): SegmentR {
  const POS = SEGMENT_R_POSITIONS;
  validateRecordType(line, '3');
  const segmentCode = extractField(line, SEGMENT_CODE_POSITION, SEGMENT_CODE_POSITION);
  if (segmentCode !== 'R') {
    throw new ParseError(`Expected segment R, got ${segmentCode}`);
  }

  return {
    bankCode: extractField(line, POS.BANK_CODE.start, POS.BANK_CODE.end),
    batchNumber: parseNumericField(line, POS.BATCH_NUMBER.start, POS.BATCH_NUMBER.end),
    recordType: extractField(line, POS.RECORD_TYPE.start, POS.RECORD_TYPE.end),
    sequentialNumber: parseNumericField(line, POS.RECORD_NUMBER.start, POS.RECORD_NUMBER.end),
    segmentCode: extractField(line, POS.SEGMENT_CODE.start, POS.SEGMENT_CODE.end),
    occurrenceCode: extractField(line, POS.MOVEMENT_CODE.start, POS.MOVEMENT_CODE.end),
    discount2Code:
      extractField(line, POS.DISCOUNT_2_CODE.start, POS.DISCOUNT_2_CODE.end) || undefined,
    fineCode: extractField(line, POS.FINE_CODE.start, POS.FINE_CODE.end) || undefined,
  };
}
