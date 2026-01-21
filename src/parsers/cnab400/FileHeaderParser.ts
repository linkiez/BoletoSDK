/**
 * CNAB400 File Header Parser
 *
 * @module parsers/cnab400/FileHeaderParser
 */

import {
  FILE_HEADER_POSITIONS,
  FILE_HEADER_RETORNO_POSITIONS,
  FILE_TYPE_RETORNO,
  LINE_LENGTH,
} from '../../constants/cnab400';
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
  if (line.length !== LINE_LENGTH) {
    throw new ParseError(`Invalid header line length: ${line.length}`, 1);
  }

  if (!line.startsWith('0')) {
    throw new ParseError(`Invalid record type for header: ${line.charAt(0)}`, 1);
  }

  const {
    OPERATION_TYPE,
    OPERATION_LITERAL,
    SERVICE_CODE,
    SERVICE_LITERAL,
    AGENCY,
    ZEROS,
    ACCOUNT,
    ACCOUNT_DIGIT,
    COMPANY_NAME,
    BANK_CODE,
    BANK_NAME,
    GENERATION_DATE,
    SEQUENCE_NUMBER,
  } = FILE_HEADER_POSITIONS;
  const { CREATION_DATE } = FILE_HEADER_RETORNO_POSITIONS;

  const operationType = line.substring(OPERATION_TYPE.start - 1, OPERATION_TYPE.end) as '1' | '2';
  const isRetorno = operationType === FILE_TYPE_RETORNO;

  return {
    recordType: '0',
    operationType,
    operationLiteral: line.substring(OPERATION_LITERAL.start - 1, OPERATION_LITERAL.end).trim(),
    serviceCode: line.substring(SERVICE_CODE.start - 1, SERVICE_CODE.end),
    serviceLiteral: line.substring(SERVICE_LITERAL.start - 1, SERVICE_LITERAL.end).trim(),
    agency: line.substring(AGENCY.start - 1, AGENCY.end),
    zeros: line.substring(ZEROS.start - 1, ZEROS.end),
    account: line.substring(ACCOUNT.start - 1, ACCOUNT.end),
    accountDigit: line.substring(ACCOUNT_DIGIT.start - 1, ACCOUNT_DIGIT.end),
    companyName: line.substring(COMPANY_NAME.start - 1, COMPANY_NAME.end).trim(),
    bankCode: line.substring(BANK_CODE.start - 1, BANK_CODE.end),
    bankName: line.substring(BANK_NAME.start - 1, BANK_NAME.end).trim(),
    generationDate: parseDateShort(line.substring(GENERATION_DATE.start - 1, GENERATION_DATE.end)),
    sequenceNumber: parseNumber(
      line.substring(SEQUENCE_NUMBER.start - 1, SEQUENCE_NUMBER.end).trim(),
    ),
    // creationDate only exists in RETORNO files
    creationDate:
      isRetorno && line.substring(CREATION_DATE.start - 1, CREATION_DATE.end).trim()
        ? parseDateShort(line.substring(CREATION_DATE.start - 1, CREATION_DATE.end).trim())
        : undefined,
  };
}
