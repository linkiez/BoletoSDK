/**
 * CNAB400 Detail Record Parser
 *
 * @module parsers/cnab400/DetailRecordParser
 */

import { ParseError } from '../../errors';
import type { DetailRecord } from '../../types/cnab400';
import { parseDateShort, parseDecimal, parseNumber } from '../../utils/parsers';
import { LINE_LENGTH, DETAIL_RECORD_REMESSA_POSITIONS } from '../../constants/cnab400';

/**
 * Parses detail record (Type 1) for REMESSA files
 *
 * @param line - 400-character detail line
 * @returns Parsed DetailRecord object
 * @throws ParseError if line is invalid
 */
export function parseDetailRecord(line: string): DetailRecord {
  if (line.length !== LINE_LENGTH) {
    throw new ParseError(`Invalid detail line length: ${line.length}`);
  }

  if (!line.startsWith('1')) {
    throw new ParseError(`Invalid record type for detail: ${line.charAt(0)}`);
  }

  const {
    REGISTRATION_TYPE,
    REGISTRATION_NUMBER,
    AGENCY,
    ZEROS,
    ACCOUNT,
    ACCOUNT_DIGIT,
    COMPANY_CONTROL,
    OUR_NUMBER,
    PORTFOLIO_CODE,
    DOCUMENT_NUMBER,
    DUE_DATE,
    AMOUNT,
    BANK_CODE,
    SPECIES_CODE,
    ACCEPTANCE,
    ISSUE_DATE,
    INSTRUCTION_CODE_1,
    INSTRUCTION_CODE_2,
    PAYER_NAME,
    PAYER_ADDRESS,
    PAYER_CITY,
    PAYER_STATE,
    PAYER_ZIP_CODE,
    SEQUENTIAL_NUMBER,
  } = DETAIL_RECORD_REMESSA_POSITIONS;

  // REMESSA layout (operationType '1')
  const detail: DetailRecord = {
    recordType: '1',
    companyRegistrationType: line.substring(REGISTRATION_TYPE.start - 1, REGISTRATION_TYPE.end) as
      | '01'
      | '02'
      | '03',
    companyRegistrationNumber: line
      .substring(REGISTRATION_NUMBER.start - 1, REGISTRATION_NUMBER.end)
      .trim(),
    agency: line.substring(AGENCY.start - 1, AGENCY.end),
    zeros: line.substring(ZEROS.start - 1, ZEROS.end),
    account: line.substring(ACCOUNT.start - 1, ACCOUNT.end),
    accountDigit: line.substring(ACCOUNT_DIGIT.start - 1, ACCOUNT_DIGIT.end),
    companyControl:
      line.substring(COMPANY_CONTROL.start - 1, COMPANY_CONTROL.end).trim() || undefined,
    ourNumber: line.substring(OUR_NUMBER.start - 1, OUR_NUMBER.end).trim(),
    dueDate: parseDateShort(line.substring(DUE_DATE.start - 1, DUE_DATE.end)),
    amount: parseDecimal(line.substring(AMOUNT.start - 1, AMOUNT.end), 2),
    bankCode: line.substring(BANK_CODE.start - 1, BANK_CODE.end),
    payerName: line.substring(PAYER_NAME.start - 1, PAYER_NAME.end).trim(),
    payerAddress: line.substring(PAYER_ADDRESS.start - 1, PAYER_ADDRESS.end).trim() || undefined,
    payerCity: line.substring(PAYER_CITY.start - 1, PAYER_CITY.end).trim() || undefined,
    payerState: line.substring(PAYER_STATE.start - 1, PAYER_STATE.end).trim() || undefined,
    payerZipCode: line.substring(PAYER_ZIP_CODE.start - 1, PAYER_ZIP_CODE.end).trim() || undefined,
    sequentialNumber: parseNumber(
      line.substring(SEQUENTIAL_NUMBER.start - 1, SEQUENTIAL_NUMBER.end).trim(),
    ),
  };

  // Optional fields (REMESSA layout)
  const portfolioCode = line.substring(PORTFOLIO_CODE.start - 1, PORTFOLIO_CODE.end).trim();
  if (portfolioCode) detail.portfolioCode = portfolioCode;

  const documentNumber = line.substring(DOCUMENT_NUMBER.start - 1, DOCUMENT_NUMBER.end).trim();
  if (documentNumber) detail.documentNumber = documentNumber;

  const speciesCode = line.substring(SPECIES_CODE.start - 1, SPECIES_CODE.end).trim();
  if (speciesCode) detail.speciesCode = speciesCode;

  const acceptance = line.substring(ACCEPTANCE.start - 1, ACCEPTANCE.end).trim();
  if (acceptance === 'A' || acceptance === 'N') detail.acceptance = acceptance;

  const issueDate = line.substring(ISSUE_DATE.start - 1, ISSUE_DATE.end).trim();
  if (issueDate && issueDate !== '000000' && /^\d{6}$/.test(issueDate)) {
    detail.issueDate = parseDateShort(issueDate);
  }

  const instructionCode1 = line
    .substring(INSTRUCTION_CODE_1.start - 1, INSTRUCTION_CODE_1.end)
    .trim();
  if (instructionCode1 && instructionCode1 !== '00') detail.instructionCode1 = instructionCode1;

  const instructionCode2 = line
    .substring(INSTRUCTION_CODE_2.start - 1, INSTRUCTION_CODE_2.end)
    .trim();
  if (instructionCode2 && instructionCode2 !== '00') detail.instructionCode2 = instructionCode2;

  return detail;
}
