/**
 * CNAB400 Parser - Itaú Layout
 *
 * Parses CNAB400 files according to FEBRABAN standard and Itaú specifications.
 * Extracts fields from fixed-position 400-character lines.
 *
 * @module parsers/cnab400
 */

import { ParseError } from '../../errors';
import type {
  Cnab400File,
  Cnab400ReturnFile,
  DetailRecord,
  FileHeader,
  FileTrailer,
  GuarantorRecord,
  MessageBackRecord,
  MessageFrontRecord,
  PenaltyRecord,
  ReturnDetailRecord,
} from '../../types/cnab400';
import { parseDateShort, parseDecimal, parseNumber } from '../../utils/parsers';

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

/**
 * Parses return detail record (Type 1 with occurrence data) for RETORNO files
 *
 * @param line - 400-character return detail line
 * @returns Parsed ReturnDetailRecord object
 */
export function parseReturnDetailRecord(line: string): ReturnDetailRecord {
  if (line.length !== 400) {
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
    sequentialNumber: parseNumber(line.substring(394, 400).trim()),
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

/**
 * Parses penalty record (Type 2) - Optional penalty information
 *
 * @param line - 400-character penalty line
 * @returns Parsed PenaltyRecord object
 */
export function parsePenaltyRecord(line: string): PenaltyRecord {
  if (line.length !== 400) {
    throw new ParseError(`Invalid penalty line length: ${line.length}`);
  }

  if (!line.startsWith('2')) {
    throw new ParseError(`Invalid record type for penalty: ${line.charAt(0)}`);
  }

  const record: PenaltyRecord = {
    recordType: '2',
    penaltyCode: line.substring(1, 2) as '1' | '2' | '3',
    sequentialNumber: parseNumber(line.substring(394, 400).trim()),
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

/**
 * Parses guarantor record (Type 5)
 *
 * @param line - 400-character guarantor line
 * @returns Parsed GuarantorRecord object
 */
export function parseGuarantorRecord(line: string): GuarantorRecord {
  if (line.length !== 400) {
    throw new ParseError(`Invalid guarantor line length: ${line.length}`);
  }

  if (!line.startsWith('5')) {
    throw new ParseError(`Invalid record type for guarantor: ${line.charAt(0)}`);
  }

  return {
    recordType: '5',
    companyRegistrationType: line.substring(1, 3) as '01' | '02',
    companyRegistrationNumber: line.substring(3, 17).trim(),
    documentNumber: line.substring(87, 97).trim(),
    guarantorName: line.substring(214, 244).trim(),
    guarantorAddress: line.substring(244, 289).trim() || undefined,
    guarantorZipCode: line.substring(289, 297).trim() || undefined,
    guarantorCity: line.substring(297, 312).trim() || undefined,
    guarantorState: line.substring(312, 314).trim() || undefined,
    sequentialNumber: parseNumber(line.substring(394, 400).trim()),
  };
}

/**
 * Parses message front record (Type 7)
 *
 * @param line - 400-character message line
 * @returns Parsed MessageFrontRecord object
 */
export function parseMessageFrontRecord(line: string): MessageFrontRecord {
  if (line.length !== 400) {
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
    sequentialNumber: parseNumber(line.substring(394, 400).trim()),
  };
}

/**
 * Parses message back record (Type 8)
 *
 * @param line - 400-character message line
 * @returns Parsed MessageBackRecord object
 */
export function parseMessageBackRecord(line: string): MessageBackRecord {
  if (line.length !== 400) {
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
    sequentialNumber: parseNumber(line.substring(394, 400).trim()),
  };
}

/**
 * Parses file trailer record (Type 9)
 *
 * @param line - 400-character trailer line
 * @returns Parsed FileTrailer object
 */
export function parseFileTrailer(line: string): FileTrailer {
  if (line.length !== 400) {
    throw new ParseError(`Invalid trailer line length: ${line.length}`);
  }

  if (!line.startsWith('9')) {
    throw new ParseError(`Invalid record type for trailer: ${line.charAt(0)}`);
  }

  const totalRecordsStr = line.substring(1, 7).trim();
  const totalAmountStr = line.substring(7, 20).trim();

  return {
    recordType: '9',
    totalRecords: totalRecordsStr ? parseNumber(totalRecordsStr) : 0,
    totalAmount: totalAmountStr ? parseDecimal(totalAmountStr, 2) : 0,
    sequentialNumber: parseNumber(line.substring(394, 400).trim()),
  };
}

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
    if (lines[i].length !== 400) {
      throw new ParseError(
        `Invalid line length: ${lines[i].length} (expected 400)`,
        i + 1,
      );
    }
  }

  // Validate first record is header (type 0)
  if (!lines[0].startsWith('0')) {
    throw new ParseError(
      'First record must be header (type 0)',
      1,
    );
  }

  // Validate last record is trailer (type 9)
  if (!lines.at(-1)!.startsWith('9')) {
    throw new ParseError(
      'Last record must be trailer (type 9)',
      lines.length,
    );
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
