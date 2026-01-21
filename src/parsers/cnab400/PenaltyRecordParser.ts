/**
 * CNAB400 Penalty Record Parser
 *
 * @module parsers/cnab400/PenaltyRecordParser
 */

import { LINE_LENGTH } from '../../constants/cnab400';
import { ParseError } from '../../errors';
import type { PenaltyRecord } from '../../types/cnab400';
import { parseDecimal, parseNumber } from '../../utils/parsers';

/**
 * Parses penalty record (Type 2) - Optional penalty information
 *
 * @param line - 400-character penalty line
 * @returns Parsed PenaltyRecord object
 * @throws ParseError if line is invalid
 */
export function parsePenaltyRecord(line: string): PenaltyRecord {
  if (line.length !== LINE_LENGTH) {
    throw new ParseError(`Invalid penalty line length: ${line.length}`);
  }

  if (!line.startsWith('2')) {
    throw new ParseError(`Invalid record type for penalty: ${line.charAt(0)}`);
  }

  const record: PenaltyRecord = {
    recordType: '2',
    penaltyCode: line.substring(1, 2) as '1' | '2' | '3',
    sequentialNumber: parseNumber(line.substring(LINE_LENGTH - 6, LINE_LENGTH).trim()),
  };

  // Optional: penalty date (DDMMYYYY format)
  const penaltyDateStr = line.substring(2, 10).trim();
  if (penaltyDateStr && penaltyDateStr !== '00000000' && /^\d{8}$/.test(penaltyDateStr)) {
    const day = Number.parseInt(penaltyDateStr.substring(0, 2), 10);
    const month = Number.parseInt(penaltyDateStr.substring(2, 4), 10) - 1;
    const year = Number.parseInt(penaltyDateStr.substring(4, 8), 10);
    record.penaltyDate = new Date(year, month, day);
  }

  // Optional: penalty value/percentage
  const penaltyValueStr = line.substring(10, 23).trim();
  if (penaltyValueStr && /^\d+$/.test(penaltyValueStr)) {
    record.penaltyValue = parseDecimal(penaltyValueStr, 2);
  }

  return record;
}
