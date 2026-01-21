/**
 * CNAB400 Detail Record Generators
 *
 * Generates detail records (Type 1) for both REMESSA and RETORNO layouts.
 *
 * @module generators/cnab400/DetailRecordGenerator
 */

import type { DetailRecord } from '../../types/cnab400';
import { formatDateShort, formatDecimal } from '../../utils/formatters';
import { padLeft, padRight } from '../../utils/generators';

/**
 * Generates detail record for RETORNO files (Type 1)
 *
 * Creates a 400-character detail line with RETORNO layout (return file format).
 *
 * @param detail - DetailRecord data object
 * @returns 400-character detail line for RETORNO
 *
 * @example
 * ```typescript
 * const detail: DetailRecord = {
 *   recordType: '1',
 *   companyRegistrationType: '02',
 *   companyRegistrationNumber: '12345678000195',
 *   agency: '1234',
 *   account: '56789',
 *   accountDigit: '0',
 *   ourNumber: '12345678',
 *   dueDate: new Date('2026-03-15'),
 *   amount: 150.00,
 *   bankCode: '341',
 *   payerName: 'John Doe',
 *   sequentialNumber: 2
 * };
 *
 * const line = generateDetailRecord(detail);
 * ```
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
 * Generates detail record for REMESSA files (Type 1)
 *
 * Creates a 400-character detail line with REMESSA layout (remittance file format).
 *
 * @param detail - DetailRecord data object
 * @returns 400-character detail line for REMESSA
 *
 * @example
 * ```typescript
 * const detail: DetailRecord = {
 *   recordType: '1',
 *   companyRegistrationType: '02',
 *   companyRegistrationNumber: '12345678000195',
 *   agency: '1234',
 *   account: '56789',
 *   accountDigit: '0',
 *   ourNumber: '12345678',
 *   documentNumber: 'DOC123',
 *   dueDate: new Date('2026-03-15'),
 *   amount: 150.00,
 *   bankCode: '341',
 *   speciesCode: 'DM',
 *   acceptance: 'N',
 *   issueDate: new Date('2026-02-01'),
 *   payerName: 'John Doe',
 *   payerAddress: '123 Main St',
 *   payerCity: 'Sao Paulo',
 *   payerState: 'SP',
 *   payerZipCode: '01234567',
 *   sequentialNumber: 2
 * };
 *
 * const line = generateDetailRecordRemessa(detail);
 * ```
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
