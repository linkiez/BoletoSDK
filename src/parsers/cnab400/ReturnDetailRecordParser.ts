/**
 * CNAB400 Return Detail Record Parser
 *
 * @module parsers/cnab400/ReturnDetailRecordParser
 */

import { LINE_LENGTH } from '../../constants/cnab400';
import { ParseError } from '../../errors';
import type { ReturnDetailRecord } from '../../types/cnab400';
import { parseDateShort, parseDecimal, parseNumber } from '../../utils/parsers';

/**
 * Parses return detail record (Type 1 with occurrence data) for RETORNO files
 *
 * @param line - 400-character return detail line
 * @returns Parsed ReturnDetailRecord object
 * @throws ParseError if line is invalid
 */
export function parseReturnDetailRecord(line: string): ReturnDetailRecord {
  if (line.length !== LINE_LENGTH) {
    throw new ParseError(`Invalid detail line length: ${line.length}`);
  }

  if (!line.startsWith('1')) {
    throw new ParseError(`Invalid record type for detail: ${line.charAt(0)}`);
  }

  // RETORNO layout (operationType '2') - different field positions
  const detail: ReturnDetailRecord = {
    recordType: '1',
    companyRegistrationType: line.substring(1, 3) as '01' | '02' | '03',
    companyRegistrationNumber: line.substring(3, 17).trim(),
    agency: line.substring(17, 21),
    zeros: line.substring(21, 23),
    account: line.substring(23, 28),
    accountDigit: line.substring(28, 29),
    companyControl: line.substring(29, 54).trim() || undefined,
    ourNumber: line.substring(54, 62).trim(),
    dueDate: parseDateShort(line.substring(146, 152)), // RETORNO: 147-152
    amount: parseDecimal(line.substring(152, 165), 2), // RETORNO: 153-165
    bankCode: line.substring(119, 122), // RETORNO: 120-122
    occurrenceCode: line.substring(108, 110), // RETORNO-specific field
    payerName: line.substring(214, 244).trim(),
    payerAddress: line.substring(244, 284).trim() || undefined,
    payerCity: line.substring(354, 374).trim() || undefined,
    payerState: line.substring(374, 376).trim() || undefined,
    payerZipCode: line.substring(314, 322).trim() || undefined,
    sequentialNumber: parseNumber(line.substring(LINE_LENGTH - 6, LINE_LENGTH).trim()),
  };

  // Return-specific date field
  const occurrenceDate = line.substring(110, 116).trim();
  if (occurrenceDate && occurrenceDate !== '000000') {
    detail.occurrenceDate = parseDateShort(occurrenceDate);
  }

  const bankDocumentNumber = line.substring(116, 126).trim();
  if (bankDocumentNumber) detail.bankDocumentNumber = bankDocumentNumber;

  // Optional fields (RETORNO layout)
  const portfolioCode = line.substring(82, 85).trim();
  if (portfolioCode) detail.portfolioCode = portfolioCode;

  const documentNumber = line.substring(87, 97).trim();
  if (documentNumber) detail.documentNumber = documentNumber;

  const speciesCode = line.substring(127, 129).trim();
  if (speciesCode) detail.speciesCode = speciesCode;

  const acceptance = line.substring(129, 130).trim();
  if (acceptance === 'A' || acceptance === 'N') detail.acceptance = acceptance;

  const issueDate = line.substring(130, 136).trim();
  if (issueDate && issueDate !== '000000' && /^\d{6}$/.test(issueDate)) {
    detail.issueDate = parseDateShort(issueDate);
  }

  const instructionCode1 = line.substring(136, 138).trim();
  if (instructionCode1 && instructionCode1 !== '00') detail.instructionCode1 = instructionCode1;

  const instructionCode2 = line.substring(138, 140).trim();
  if (instructionCode2 && instructionCode2 !== '00') detail.instructionCode2 = instructionCode2;

  return detail;
}
