import { LINE_LENGTH } from '../../constants/cnab400';
import {
  DETAIL_RECORD_REMESSA_POSITIONS,
  DETAIL_RECORD_RETORNO_POSITIONS,
} from '../../constants/cnab400/RECORD_POSITIONS';
import type { BradescoRemittanceFields, BradescoReturnFields } from '../../types/adapters';
import { parseNumber } from '../../utils/parsers';

function extractField(line: string, start: number, end: number): string {
  return line.substring(start - 1, end);
}

function trimToUndefined(value: string): string | undefined {
  const trimmedValue = value.trim();
  return trimmedValue || undefined;
}

/**
 * Parses Bradesco-specific fields from a CNAB400 remittance detail record.
 *
 * @param line - 400-character remittance detail line.
 * @returns Parsed Bradesco-specific remittance fields.
 * @throws {Error} When line length is invalid.
 */
export function parseBradescoRemittanceFields(line: string): BradescoRemittanceFields {
  if (line.length !== LINE_LENGTH) {
    throw new Error(`Invalid Bradesco remittance detail line length: ${line.length}`);
  }

  const instructionCode = extractField(
    line,
    DETAIL_RECORD_REMESSA_POSITIONS.INSTRUCTION_CODE_1.start,
    DETAIL_RECORD_REMESSA_POSITIONS.INSTRUCTION_CODE_1.end,
  );
  const walletNumber = trimToUndefined(
    extractField(
      line,
      DETAIL_RECORD_REMESSA_POSITIONS.PORTFOLIO_CODE.start,
      DETAIL_RECORD_REMESSA_POSITIONS.PORTFOLIO_CODE.end,
    ),
  );
  const walletType = trimToUndefined(
    extractField(
      line,
      DETAIL_RECORD_REMESSA_POSITIONS.PORTFOLIO_TYPE.start,
      DETAIL_RECORD_REMESSA_POSITIONS.PORTFOLIO_TYPE.end,
    ),
  );
  const occurrenceCode = trimToUndefined(
    extractField(
      line,
      DETAIL_RECORD_REMESSA_POSITIONS.OCCURRENCE_CODE.start,
      DETAIL_RECORD_REMESSA_POSITIONS.OCCURRENCE_CODE.end,
    ),
  );
  const rawDaysCount = trimToUndefined(
    extractField(
      line,
      DETAIL_RECORD_REMESSA_POSITIONS.DAYS_COUNT.start,
      DETAIL_RECORD_REMESSA_POSITIONS.DAYS_COUNT.end,
    ),
  );

  return {
    instructionCode,
    walletNumber,
    walletType,
    occurrenceCode,
    daysCount: rawDaysCount ? parseNumber(rawDaysCount) : undefined,
  };
}

/**
 * Parses Bradesco-specific fields from a CNAB400 return detail record.
 *
 * @param line - 400-character return detail line.
 * @returns Parsed Bradesco-specific return fields.
 * @throws {Error} When line length is invalid.
 */
export function parseBradescoReturnFields(line: string): BradescoReturnFields {
  if (line.length !== LINE_LENGTH) {
    throw new Error(`Invalid Bradesco return detail line length: ${line.length}`);
  }

  return {
    walletNumber: trimToUndefined(extractField(line, 84, 86)),
    walletType: trimToUndefined(
      extractField(
        line,
        DETAIL_RECORD_RETORNO_POSITIONS.PORTFOLIO_CODE.start,
        DETAIL_RECORD_RETORNO_POSITIONS.PORTFOLIO_CODE.end,
      ),
    ),
    occurrenceCode: trimToUndefined(
      extractField(
        line,
        DETAIL_RECORD_RETORNO_POSITIONS.OCCURRENCE_CODE.start,
        DETAIL_RECORD_RETORNO_POSITIONS.OCCURRENCE_CODE.end,
      ),
    ),
    ourNumber: trimToUndefined(
      extractField(
        line,
        DETAIL_RECORD_RETORNO_POSITIONS.OUR_NUMBER.start,
        DETAIL_RECORD_RETORNO_POSITIONS.OUR_NUMBER.end,
      ),
    ),
    ourNumberCheckDigit: trimToUndefined(extractField(line, 71, 71)),
    confirmedOurNumber: trimToUndefined(extractField(line, 127, 134)),
    confirmedOurNumberCheckDigit: trimToUndefined(extractField(line, 135, 135)),
  };
}
