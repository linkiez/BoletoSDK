/**
 * CNAB400 Generator - Itaú Layout
 *
 * Generates CNAB400 files according to FEBRABAN standard and Itaú specifications.
 * Converts structured data into fixed-position 400-character lines.
 *
 * @module generators/cnab400
 */

import { GenerationError } from '../../errors';
import type {
  Cnab400File,
  DetailRecord,
  FileHeader,
  FileTrailer,
  PenaltyRecord,
} from '../../types/cnab400';
import { formatDateShort, formatDecimal } from '../../utils';
import { padLeft, padRight } from '../../utils/generators';

/**
 * Generates file header record (Type 0)
 *
 * @param header - FileHeader data object
 * @returns 400-character header line
 * @throws GenerationError if required fields are missing
 */
export function generateFileHeader(header: FileHeader): string {
  if (!header.bankCode) {
    throw new GenerationError('Bank code is required', 'bankCode');
  }

  let line = '';

  // Position 001-001: Record type
  line += '0';

  // Position 002-002: Operation type (1=Remittance, 2=Return)
  line += header.operationType;

  // Position 003-009: Operation literal
  line += padRight(header.operationLiteral || 'RETORNO', 7, ' ');

  // Position 010-011: Service code
  line += padLeft(header.serviceCode || '01', 2, '0');

  // Position 012-026: Service literal
  line += padRight(header.serviceLiteral || 'COBRANCA', 15, ' ');

  // Position 027-030: Agency
  line += padLeft(header.agency || '0', 4, '0');

  // Position 031-032: Zeros
  line += '00';

  // Position 033-037: Account
  line += padLeft(header.account || '0', 5, '0');

  // Position 038-038: Account digit
  line += padLeft(header.accountDigit || '0', 1, '0');

  // Position 039-046: Blank/spaces (8 positions)
  line += '        ';

  // Position 047-076: Company name
  line += padRight(header.companyName || '', 30, ' ');

  // Position 077-079: Bank code
  line += padLeft(header.bankCode, 3, '0');

  // Position 080-094: Bank name
  line += padRight(header.bankName || 'BANCO ITAU S.A.', 15, ' ');

  // Position 095-100: Generation date (DDMMYY)
  line += formatDateShort(header.generationDate);

  // Position 101-108: Density (blank for electronic)
  line += '        ';

  // Position 109-110: Density unit (blank)
  line += '  ';

  // Position 111-115: Sequential number
  line += padLeft(header.sequenceNumber || 1, 5, '0');

  // Position 116-120: Creation date (DDMMYY) - optional
  if (header.creationDate) {
    line += formatDateShort(header.creationDate);
  } else {
    line += '      ';
  }

  // Position 121-400: Fill with spaces to complete 400 characters
  line = padRight(line, 400, ' ');

  return line;
}

/**
 * Generates detail record (Type 1) - RETORNO format
 *
 * @param detail - DetailRecord data object
 * @returns 400-character detail line
 * @throws GenerationError if required fields are missing
 */
export function generateDetailRecord(detail: DetailRecord): string {
  let line = '';

  // Position 001-001: Record type
  line += '1';

  // Position 002-003: Company registration type (01=CPF, 02=CNPJ)
  line += padLeft(detail.companyRegistrationType || '02', 2, '0');

  // Position 004-017: Company registration number (CPF/CNPJ)
  line += padLeft(detail.companyRegistrationNumber || '', 14, '0');

  // Position 018-021: Agency
  line += padLeft(detail.agency || '0', 4, '0');

  // Position 022-023: Zeros
  line += '00';

  // Position 024-028: Account
  line += padLeft(detail.account || '0', 5, '0');

  // Position 029-029: Account digit
  line += padLeft(detail.accountDigit || '0', 1, '0');

  // Position 030-037: Blanks (8 positions)
  line += '        ';

  // Position 038-062: Use of company (company control) - 25 positions
  line += padRight(detail.companyControl || '', 25, ' ');

  // Position 063-070: Our number (8 positions)
  line += padLeft(detail.ourNumber || '', 8, ' ');

  // Position 071-082: Blanks (12 positions)
  line += '            ';

  // Position 083-085: Portfolio number (3 positions)
  line += padLeft(detail.portfolioCode || '', 3, '0');

  // Position 086-093: Our number (8 positions) - confirmation
  line += padLeft(detail.ourNumber || '', 8, ' ');

  // Position 094-094: Our number DAC (1 position) - optional
  line += ' ';

  // Position 095-107: Blanks (13 positions)
  line += '             ';

  // Position 108-108: Portfolio code (single char)
  line += padRight(detail.portfolioCode ? detail.portfolioCode.charAt(0) : '', 1, ' ');

  // Position 109-110: Occurrence code (2 positions) - RETORNO specific
  line += '  ';

  // Position 111-116: Occurrence date (DDMMYY) - RETORNO specific
  line += '      ';

  // Position 117-126: Document number (10 positions)
  line += padRight(detail.documentNumber || '', 10, ' ');

  // Position 127-134: Our number (8 positions) - confirmation
  line += padLeft(detail.ourNumber || '', 8, ' ');

  // Position 135-146: Blanks (12 positions)
  line += '            ';

  // Position 147-152: Due date (DDMMYY) - RETORNO position
  if (detail.dueDate) {
    line += formatDateShort(detail.dueDate);
  } else {
    line += '      ';
  }

  // Position 153-165: Title amount (13 positions: 11 integer + 2 decimal)
  if (detail.amount !== undefined && detail.amount !== null) {
    line += formatDecimal(detail.amount, 13, 2);
  } else {
    line += padLeft('0', 13, '0');
  }

  // Position 166-168: Bank code (3 positions - 341 for Itaú)
  line += padLeft(detail.bankCode || '341', 3, '0');

  // Position 169-172: Collecting agency (4 positions) - RETORNO
  line += padLeft('', 4, '0');

  // Position 173-173: Collecting agency DAC (1 position)
  line += '0';

  // Position 174-175: Species code (2 positions) - optional
  line += padRight(detail.speciesCode || '', 2, ' ');

  // Position 176-188: Collection fee (13 positions: 11 integer + 2 decimal) - RETORNO
  line += padLeft('0', 13, '0');

  // Position 189-214: Blanks (26 positions)
  line += '                          ';

  // Position 215-227: IOF amount (13 positions: 11 integer + 2 decimal) - RETORNO
  line += padLeft('0', 13, '0');

  // Position 228-240: Rebate amount (13 positions: 11 integer + 2 decimal) - RETORNO
  line += padLeft('0', 13, '0');

  // Position 241-253: Discount amount (13 positions: 11 integer + 2 decimal) - RETORNO
  line += padLeft('0', 13, '0');

  // Position 254-266: Principal value (13 positions: 11 integer + 2 decimal) - RETORNO
  line += padLeft('0', 13, '0');

  // Position 267-279: Late fee/fine (13 positions: 11 integer + 2 decimal) - RETORNO
  line += padLeft('0', 13, '0');

  // Position 280-292: Other credits (13 positions: 11 integer + 2 decimal) - RETORNO
  line += padLeft('0', 13, '0');

  // Position 293-293: DDA boleto indicator (1 position) - RETORNO
  line += ' ';

  // Position 294-295: Blanks (2 positions)
  line += '  ';

  // Position 296-301: Credit date (DDMMYY) (6 positions) - RETORNO
  line += '      ';

  // Position 302-305: Cancelled instruction (4 positions) - RETORNO
  line += '0000';

  // Position 306-311: Blanks (6 positions)
  line += '      ';

  // Position 312-324: Zeros (13 positions)
  line += padLeft('0', 13, '0');

  // Position 325-354: Payer name (30 positions)
  line += padRight(detail.payerName || '', 30, ' ');

  // Position 355-377: Blanks (23 positions)
  line += '                       ';

  // Position 378-385: Errors/Messages (8 positions) - RETORNO
  line += '        ';

  // Position 386-392: Blanks (7 positions)
  line += '       ';

  // Position 393-394: Settlement code (2 positions) - RETORNO
  line += '  ';

  // Position 395-400: Sequential number (6 positions)
  line += padLeft(detail.sequentialNumber || '0', 6, '0');

  return line;
}

/**
 * Generates detail record for REMESSA files (Type 1) - REMESSA format
 *
 * @param detail - DetailRecord data object
 * @returns 400-character detail line for REMESSA
 * @throws GenerationError if required fields are missing
 */
export function generateDetailRecordRemessa(detail: DetailRecord): string {
  let line = '';

  // Position 001-001: Record type
  line += '1';

  // Position 002-003: Company registration type (01=CPF, 02=CNPJ)
  line += padLeft(detail.companyRegistrationType || '02', 2, '0');

  // Position 004-017: Company registration number (CPF/CNPJ)
  line += padLeft(detail.companyRegistrationNumber || '', 14, '0');

  // Position 018-021: Agency
  line += padLeft(detail.agency || '0', 4, '0');

  // Position 022-023: Zeros
  line += '00';

  // Position 024-028: Account
  line += padLeft(detail.account || '0', 5, '0');

  // Position 029-029: Account digit
  line += padLeft(detail.accountDigit || '0', 1, '0');

  // Position 030-037: Blanks (8 positions)
  line += '        ';

  // Position 038-062: Use of company (company control) - 25 positions
  line += padRight(detail.companyControl || '', 25, ' ');

  // Position 063-070: Our number (8 positions)
  line += padLeft(detail.ourNumber || '', 8, ' ');

  // Position 071-083: Blanks/Quantity variable currency (13 positions)
  line += '             ';

  // Position 084-086: Portfolio code (3 positions)
  line += padLeft(detail.portfolioCode || '', 3, '0');

  // Position 087-107: Use of bank / blanks (21 positions)
  line += '                     ';

  // Position 108-108: Portfolio code (1 position)
  line += padRight(detail.portfolioCode ? detail.portfolioCode.charAt(0) : '', 1, ' ');

  // Position 109-110: Occurrence code (2 positions)
  line += '01'; // Default: entry request

  // Position 111-120: Document number (10 positions)
  line += padRight(detail.documentNumber || '', 10, ' ');

  // Position 121-126: Due date (DDMMYY) - REMESSA position
  if (detail.dueDate) {
    line += formatDateShort(detail.dueDate);
  } else {
    line += '000000';
  }

  // Position 127-139: Title amount (13 positions: 11 integer + 2 decimal) - REMESSA position
  if (detail.amount !== undefined && detail.amount !== null) {
    line += formatDecimal(detail.amount, 13, 2);
  } else {
    line += padLeft('0', 13, '0');
  }

  // Position 140-142: Bank code (3 positions - 341 for Itaú) - REMESSA position
  line += padLeft(detail.bankCode || '341', 3, '0');

  // Position 143-147: Collecting agency (5 positions)
  line += padLeft('', 5, '0');

  // Position 148-149: Species code (2 positions) - REMESSA
  line += padRight(detail.speciesCode || '', 2, ' ');

  // Position 150-150: Acceptance (1 position)
  line += padRight(detail.acceptance || 'N', 1, ' ');

  // Position 151-156: Issue date (DDMMYY)
  if (detail.issueDate) {
    line += formatDateShort(detail.issueDate);
  } else {
    line += '000000';
  }

  // Position 157-158: First instruction code (2 positions)
  line += padRight(detail.instructionCode1 || '', 2, ' ');

  // Position 159-160: Second instruction code (2 positions)
  line += padRight(detail.instructionCode2 || '', 2, ' ');

  // Position 161-173: Daily interest (13 positions: 11 integer + 2 decimal)
  line += padLeft('0', 13, '0');

  // Position 174-179: Discount until date (DDMMYY)
  line += '000000';

  // Position 180-192: Discount amount (13 positions: 11 integer + 2 decimal)
  line += padLeft('0', 13, '0');

  // Position 193-205: IOF value (13 positions: 11 integer + 2 decimal)
  line += padLeft('0', 13, '0');

  // Position 206-218: Rebate amount (13 positions: 11 integer + 2 decimal)
  line += padLeft('0', 13, '0');

  // Position 219-220: Payer registration type (01=CPF, 02=CNPJ)
  line += '01';

  // Position 221-234: Payer registration number (14 positions)
  line += padLeft('', 14, '0');

  // Position 235-264: Payer name (30 positions)
  line += padRight(detail.payerName || '', 30, ' ');

  // Position 265-274: Blanks (10 positions)
  line += '          ';

  // Position 275-314: Payer address (40 positions)
  line += padRight(detail.payerAddress || '', 40, ' ');

  // Position 315-326: Payer neighborhood (12 positions)
  line += padRight('', 12, ' ');

  // Position 327-334: Payer ZIP code (8 positions)
  line += padLeft(detail.payerZipCode || '', 8, '0');

  // Position 335-349: Payer city (15 positions)
  line += padRight(detail.payerCity || '', 15, ' ');

  // Position 350-351: Payer state (2 positions)
  line += padRight(detail.payerState || '', 2, ' ');

  // Position 352-381: Guarantor/Endorser name (30 positions)
  line += padRight('', 30, ' ');

  // Position 382-385: Blanks (4 positions)
  line += '    ';

  // Position 386-391: Interest date (DDMMYY)
  line += '000000';

  // Position 392-393: Days for automatic protest (2 positions)
  line += '00';

  // Position 394-394: Blank (1 position)
  line += ' ';

  // Position 395-400: Sequential number (6 positions)
  line += padLeft(detail.sequentialNumber || '0', 6, '0');

  return line;
}

/**
 * Generates penalty/fine record (Type 2) - Optional for REMESSA
 *
 * @param penalty - PenaltyRecord data object
 * @returns 400-character penalty line
 */
export function generatePenaltyRecord(penalty: PenaltyRecord): string {
  let line = '';

  // Position 001-001: Record type
  line += '2';

  // Position 002-002: Penalty code (1=None, 2=Percentage, 3=Fixed value)
  line += penalty.penaltyCode;

  // Position 003-010: Penalty date (DDMMYYYY)
  if (penalty.penaltyDate) {
    const date = penalty.penaltyDate;
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = String(date.getFullYear());
    line += day + month + year;
  } else {
    line += '00000000';
  }

  // Position 011-023: Penalty value/percentage (13 positions)
  if (penalty.penaltyValue !== undefined && penalty.penaltyValue !== null) {
    line += formatDecimal(penalty.penaltyValue, 13, 2);
  } else {
    line += padLeft('0', 13, '0');
  }

  // Position 024-394: Blanks (371 positions)
  line += ' '.repeat(371);

  // Position 395-400: Sequential number (6 positions)
  line += padLeft(penalty.sequentialNumber || '0', 6, '0');

  return line;
}

/**
 * Generates file trailer record (Type 9)
 *
 * @param trailer - FileTrailer data object
 * @returns 400-character trailer line
 */
export function generateFileTrailer(trailer: FileTrailer): string {
  let line = '';

  // Position 001-001: Record type
  line += '9';

  // Position 002-007: Total records (including header and trailer)
  line += padLeft(trailer.totalRecords, 6, '0');

  // Position 008-020: Total amount (13 positions, implied 2 decimals) - optional
  if (trailer.totalAmount) {
    line += formatDecimal(trailer.totalAmount, 13, 2);
  } else {
    line += padLeft('0', 13, '0');
  }

  // Position 021-027: Zeros
  line += '0000000';

  // Position 028-394: Blank
  line += ' '.repeat(367);

  // Position 395-400: Sequential number
  line += padLeft(trailer.sequentialNumber || trailer.totalRecords, 6, '0');

  return line;
}

/**
 * Main generator function - converts CNAB400File to text
 *
 * @param file - Complete CNAB400 file data structure
 * @returns CNAB400 file content as string (lines separated by \n)
 * @throws GenerationError if file structure is invalid
 */
export function generateCnab400(file: Cnab400File): string {
  if (!file.header) {
    throw new GenerationError('File header is required');
  }

  if (!file.trailer) {
    throw new GenerationError('File trailer is required');
  }

  if (!Array.isArray(file.details)) {
    throw new GenerationError('File details must be an array');
  }

  const lines: string[] = [];
  const isRemessa = file.header.operationType === '1';

  // Generate header
  lines.push(generateFileHeader(file.header));

  // Generate all detail records
  for (const detail of file.details) {
    if (isRemessa) {
      lines.push(generateDetailRecordRemessa(detail));
    } else {
      lines.push(generateDetailRecord(detail));
    }
  }

  // Generate penalty records (REMESSA only)
  if (isRemessa && file.penaltyRecords && file.penaltyRecords.length > 0) {
    for (const penalty of file.penaltyRecords) {
      lines.push(generatePenaltyRecord(penalty));
    }
  }

  // Generate trailer
  lines.push(generateFileTrailer(file.trailer));

  // Validate all lines are exactly 400 characters
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].length !== 400) {
      throw new GenerationError(
        `Line ${i + 1} has invalid length: ${lines[i].length} (expected 400)`,
        'lineLength',
      );
    }
  }

  return lines.join('\n');
}
