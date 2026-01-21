/**
 * CNAB400 Main Parser
 *
 * @module parsers/cnab400/Cnab400Parser
 */

import { LINE_LENGTH } from '../../constants/cnab400';
import { ParseError } from '../../errors';
import type {
    Cnab400File,
    Cnab400ReturnFile,
    DetailRecord,
    GuarantorRecord,
    MessageBackRecord,
    MessageFrontRecord,
    PenaltyRecord,
} from '../../types/cnab400';
import { parseDetailRecord } from './DetailRecordParser';
import { parseFileHeader } from './FileHeaderParser';
import { parseFileTrailer } from './FileTrailerParser';
import { parseGuarantorRecord } from './GuarantorRecordParser';
import { parseMessageBackRecord, parseMessageFrontRecord } from './MessageRecordParser';
import { parsePenaltyRecord } from './PenaltyRecordParser';
import { parseReturnDetailRecord } from './ReturnDetailRecordParser';

/**
 * Main CNAB400 Parser
 *
 * Parses complete CNAB400 files (remittance or return).
 *
 * @param content - Complete file content
 * @returns Parsed Cnab400File or Cnab400ReturnFile
 * @throws ParseError if file is malformed
 */
export function parseCnab400(content: string): Cnab400File | Cnab400ReturnFile {
  // Validate content is not empty
  if (!content || content.trim().length === 0) {
    throw new ParseError('File content cannot be empty');
  }

  // Split lines but keep empty ones for validation
  const allLines = content.split('\n');
  const lines = allLines.filter((line) => line.length > 0);

  // First validate we have content
  if (lines.length === 0) {
    throw new ParseError('File content cannot be empty');
  }

  if (lines.length < 2) {
    throw new ParseError('File must have at least header and trailer');
  }

  // Validate all lines are exactly 400 characters
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].length !== LINE_LENGTH) {
      throw new ParseError(
        `Invalid line length: ${lines[i].length} (expected ${LINE_LENGTH})`,
        i + 1,
      );
    }
  }

  // Validate first record is header (type 0)
  if (!lines[0].startsWith('0')) {
    throw new ParseError('First record must be header (type 0)', 1);
  }

  // Validate last record is trailer (type 9)
  if (!lines.at(-1)!.startsWith('9')) {
    throw new ParseError('Last record must be trailer (type 9)', lines.length);
  }

  // Parse header
  const header = parseFileHeader(lines[0]);

  // Parse trailer
  const trailer = parseFileTrailer(lines.at(-1)!);

  // Parse detail lines
  const details: DetailRecord[] = [];
  const penaltyRecords: PenaltyRecord[] = [];
  const guarantorRecords: GuarantorRecord[] = [];
  const messageFrontRecords: MessageFrontRecord[] = [];
  const messageBackRecords: MessageBackRecord[] = [];

  const isReturn = header.operationType === '2';

  for (let i = 1; i < lines.length - 1; i++) {
    const line = lines[i];
    const recordType = line[0];

    try {
      switch (recordType) {
        case '1':
          details.push(isReturn ? parseReturnDetailRecord(line) : parseDetailRecord(line));
          break;
        case '2':
          penaltyRecords.push(parsePenaltyRecord(line));
          break;
        case '5':
          guarantorRecords.push(parseGuarantorRecord(line));
          break;
        case '7':
          messageFrontRecords.push(parseMessageFrontRecord(line));
          break;
        case '8':
          messageBackRecords.push(parseMessageBackRecord(line));
          break;
        default:
          throw new ParseError(`Invalid record type: ${recordType}`, i + 1);
      }
    } catch (error) {
      if (error instanceof ParseError) {
        throw new ParseError(`${error.message} at line ${i + 1}`, i + 1);
      }
      throw error;
    }
  }

  const result: Cnab400File = {
    header,
    details,
    trailer,
  };

  if (penaltyRecords.length > 0) result.penaltyRecords = penaltyRecords;
  if (guarantorRecords.length > 0) result.guarantorRecords = guarantorRecords;
  if (messageFrontRecords.length > 0) result.messageFrontRecords = messageFrontRecords;
  if (messageBackRecords.length > 0) result.messageBackRecords = messageBackRecords;

  return result;
}
