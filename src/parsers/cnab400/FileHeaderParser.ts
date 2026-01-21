/**
 * CNAB400 File Header Parser
 *
 * @module parsers/cnab400/FileHeaderParser
 */

import { ParseError } from '../../errors';
import type { FileHeader } from '../../types/cnab400';
import { parseDateShort, parseNumber } from '../../utils/parsers';

/**
 * Parses file header record (Type 0)
 *
 * @param line - 400-character header line
 * @returns Parsed FileHeader object
 * @throws ParseError if line is invalid
 */
export function parseFileHeader(line: string): FileHeader {
  if (line.length !== 400) {
    throw new ParseError(`Invalid header line length: ${line.length}`, 1);
  }

  if (!line.startsWith('0')) {
    throw new ParseError(`Invalid record type for header: ${line.charAt(0)}`, 1);
  }

  const operationType = line.substring(1, 2) as '1' | '2';
  const isRetorno = operationType === '2';

  return {
    recordType: '0',
    operationType,
    operationLiteral: line.substring(2, 9).trim(),
    serviceCode: line.substring(9, 11),
    serviceLiteral: line.substring(11, 26).trim(),
    agency: line.substring(26, 30),
    zeros: line.substring(30, 32),
    account: line.substring(32, 37),
    accountDigit: line.substring(37, 38),
    companyName: line.substring(46, 76).trim(),
    bankCode: line.substring(76, 79),
    bankName: line.substring(79, 94).trim(),
    generationDate: parseDateShort(line.substring(94, 100)),
    sequenceNumber: parseNumber(line.substring(110, 115).trim()),
    // creationDate only exists in RETORNO files (position 114-119)
    // REMESSA files have blanks in position 101-394
    creationDate:
      isRetorno && line.substring(113, 119).trim()
        ? parseDateShort(line.substring(113, 119).trim())
        : undefined,
  };
}
