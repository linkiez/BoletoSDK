/**
 * CNAB400 Detail Record Parser
 *
 * @module parsers/cnab400/DetailRecordParser
 */

import { ParseError } from '../../errors';
import type { DetailRecord } from '../../types/cnab400';
import { parseDateShort, parseDecimal, parseNumber } from '../../utils/parsers';

/**
 * Parses detail record (Type 1) for REMESSA files
 *
 * @param line - 400-character detail line
 * @returns Parsed DetailRecord object
 * @throws ParseError if line is invalid
 */
export function parseDetailRecord(line: string): DetailRecord {
  if (line.length !== 400) {
    throw new ParseError(`Invalid detail line length: ${line.length}`);
  }

  if (!line.startsWith('1')) {
    throw new ParseError(`Invalid record type for detail: ${line.charAt(0)}`);
  }

  // REMESSA layout (operationType '1')
  const detail: DetailRecord = {
    recordType: '1',
    companyRegistrationType: line.substring(1, 3) as '01' | '02' | '03',
    companyRegistrationNumber: line.substring(3, 17).trim(),
    agency: line.substring(17, 21),
    zeros: line.substring(21, 23),
    account: line.substring(23, 28),
    accountDigit: line.substring(28, 29),
    companyControl: line.substring(37, 62).trim() || undefined,
    ourNumber: line.substring(62, 70).trim(),
    dueDate: parseDateShort(line.substring(120, 126)), // REMESSA: 121-126
    amount: parseDecimal(line.substring(126, 139), 2), // REMESSA: 127-139
    bankCode: line.substring(139, 142), // REMESSA: 140-142
    payerName: line.substring(234, 264).trim(),
    payerAddress: line.substring(274, 314).trim() || undefined,
    payerCity: line.substring(334, 349).trim() || undefined,
    payerState: line.substring(349, 351).trim() || undefined,
    payerZipCode: line.substring(326, 334).trim() || undefined,
    sequentialNumber: parseNumber(line.substring(394, 400).trim()),
  };

  // Optional fields (REMESSA layout)
  const portfolioCode = line.substring(83, 86).trim();
  if (portfolioCode) detail.portfolioCode = portfolioCode;

  const documentNumber = line.substring(110, 120).trim();
  if (documentNumber) detail.documentNumber = documentNumber;

  const speciesCode = line.substring(147, 149).trim();
  if (speciesCode) detail.speciesCode = speciesCode;

  const acceptance = line.substring(149, 150).trim();
  if (acceptance === 'A' || acceptance === 'N') detail.acceptance = acceptance;

  const issueDate = line.substring(150, 156).trim();
  if (issueDate && issueDate !== '000000' && /^\d{6}$/.test(issueDate)) {
    detail.issueDate = parseDateShort(issueDate);
  }

  const instructionCode1 = line.substring(156, 158).trim();
  if (instructionCode1 && instructionCode1 !== '00') detail.instructionCode1 = instructionCode1;

  const instructionCode2 = line.substring(158, 160).trim();
  if (instructionCode2 && instructionCode2 !== '00') detail.instructionCode2 = instructionCode2;

  return detail;
}
