/**
 * CNAB240 Main Parser
 *
 * Parses complete CNAB240 files with hierarchical structure:
 * File → Batches → Details → Segments
 *
 * @module parsers/cnab240/Cnab240Parser
 */

import { RECORD_TYPE } from '../../constants/cnab240';
import { ParseError } from '../../errors';
import { Batch, Cnab240File, DetailRecord, FileTrailer } from '../../types/cnab240';
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
    const recordType = extractField(line, 8, 8);

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
    const segmentCode = extractField(line, 14, 14);

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
function parseBatchHeader(line: string): any {
  validateRecordType(line, '1');

  return {
    bankCode: extractField(line, 1, 3),
    batchNumber: parseNumericField(line, 4, 7),
    recordType: extractField(line, 8, 8),
    operationType: extractField(line, 9, 9),
    serviceType: extractField(line, 10, 11),
    companyRegistrationType: extractField(line, 18, 18),
    companyRegistrationNumber: extractField(line, 19, 32),
    agency: extractField(line, 53, 57),
    account: extractField(line, 59, 70),
    accountDigit: extractField(line, 71, 71),
    companyName: extractField(line, 73, 102),
    message1: extractField(line, 103, 142) || undefined,
    message2: extractField(line, 143, 182) || undefined,
  };
}

/**
 * Parse batch trailer (record type 5)
 */
function parseBatchTrailer(line: string) {
  validateRecordType(line, '5');

  return {
    bankCode: extractField(line, 1, 3),
    batchNumber: parseNumericField(line, 4, 7),
    recordType: extractField(line, 8, 8),
    totalRecords: parseNumericField(line, 18, 23),
    totalSimpleSlips: parseNumericField(line, 24, 29) || undefined,
    totalSimpleAmount: parseDecimalField(line, 30, 46, 2) || undefined,
  };
}

/**
 * Parse file trailer (record type 9)
 */
function parseFileTrailer(line: string): FileTrailer {
  validateRecordType(line, '9');

  return {
    bankCode: extractField(line, 1, 3),
    batchNumber: extractField(line, 4, 7),
    recordType: extractField(line, 8, 8),
    totalBatches: parseNumericField(line, 18, 23),
    totalRecords: parseNumericField(line, 24, 29),
    totalAccounts: parseNumericField(line, 30, 35) || undefined,
  };
}

/**
 * Placeholder for Segment R parser (will be implemented)
 */
function parseSegmentR(line: string) {
  validateRecordType(line, '3');
  const segmentCode = extractField(line, 14, 14);
  if (segmentCode !== 'R') {
    throw new ParseError(`Expected segment R, got ${segmentCode}`);
  }

  return {
    bankCode: extractField(line, 1, 3),
    batchNumber: parseNumericField(line, 4, 7),
    recordType: extractField(line, 8, 8),
    sequentialNumber: parseNumericField(line, 9, 13),
    segmentCode: extractField(line, 14, 14),
    occurrenceCode: extractField(line, 16, 17),
    discount2Code: extractField(line, 18, 18) || undefined,
    fineCode: extractField(line, 66, 66) || undefined,
  };
}
