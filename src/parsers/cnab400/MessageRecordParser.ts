/**
 * CNAB400 Message Record Parsers
 *
 * @module parsers/cnab400/MessageRecordParser
 */

import { LINE_LENGTH } from '../../constants/cnab400';
import { ParseError } from '../../errors';
import type { MessageBackRecord, MessageFrontRecord } from '../../types/cnab400';
import { parseNumber } from '../../utils/parsers';

/**
 * Parses message front record (Type 7)
 *
 * @param line - 400-character message line
 * @returns Parsed MessageFrontRecord object
 * @throws ParseError if line is invalid
 */
export function parseMessageFrontRecord(line: string): MessageFrontRecord {
  if (line.length !== LINE_LENGTH) {
    throw new ParseError(`Invalid message line length: ${line.length}`);
  }

  if (!line.startsWith('7')) {
    throw new ParseError(`Invalid record type for message front: ${line.charAt(0)}`);
  }

  return {
    recordType: '7',
    message1: line.substring(1, 81).trim() || undefined,
    message2: line.substring(81, 161).trim() || undefined,
    message3: line.substring(161, 241).trim() || undefined,
    message4: line.substring(241, 321).trim() || undefined,
    sequentialNumber: parseNumber(line.substring(LINE_LENGTH - 6, LINE_LENGTH).trim()),
  };
}

/**
 * Parses message back record (Type 8)
 *
 * @param line - 400-character message line
 * @returns Parsed MessageBackRecord object
 * @throws ParseError if line is invalid
 */
export function parseMessageBackRecord(line: string): MessageBackRecord {
  if (line.length !== LINE_LENGTH) {
    throw new ParseError(`Invalid message line length: ${line.length}`);
  }

  if (!line.startsWith('8')) {
    throw new ParseError(`Invalid record type for message back: ${line.charAt(0)}`);
  }

  return {
    recordType: '8',
    message1: line.substring(1, 81).trim() || undefined,
    message2: line.substring(81, 161).trim() || undefined,
    message3: line.substring(161, 241).trim() || undefined,
    message4: line.substring(241, 321).trim() || undefined,
    sequentialNumber: parseNumber(line.substring(LINE_LENGTH - 6, LINE_LENGTH).trim()),
  };
}
