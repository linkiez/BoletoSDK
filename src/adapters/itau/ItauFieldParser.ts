import { LINE_LENGTH } from '../../constants/cnab400';
import {
  DETAIL_RECORD_REMESSA_POSITIONS,
  DETAIL_RECORD_RETORNO_POSITIONS,
} from '../../constants/cnab400/RECORD_POSITIONS';
import type { ItauRemittanceFields, ItauReturnFields } from '../../types/adapters';
import { parseNumber } from '../../utils/parsers';

function extractField(line: string, start: number, end: number): string {
  return line.substring(start - 1, end);
}

function trimToUndefined(value: string): string | undefined {
  const trimmedValue = value.trim();
  return trimmedValue ? trimmedValue : undefined;
}

/**
 * Parses Itaú-specific fields from a CNAB400 remittance detail record.
 *
 * @param line - 400-character remittance detail line.
 * @returns Parsed Itaú-specific remittance fields.
 * @throws {Error} When the line length is invalid.
 */
export function parseItauRemittanceFields(line: string): ItauRemittanceFields {
  if (line.length !== LINE_LENGTH) {
    throw new Error(`Invalid Itaú remittance detail line length: ${line.length}`);
  }

  const instructionCancellationCode = extractField(
    line,
    DETAIL_RECORD_REMESSA_POSITIONS.INSTRUCTION_CANCELLATION.start,
    DETAIL_RECORD_REMESSA_POSITIONS.INSTRUCTION_CANCELLATION.end,
  );
  const bankUseOperation = trimToUndefined(
    extractField(
      line,
      DETAIL_RECORD_REMESSA_POSITIONS.RESERVED_3.start,
      DETAIL_RECORD_REMESSA_POSITIONS.RESERVED_3.end,
    ),
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
    instructionCancellationCode,
    bankUseOperation,
    walletNumber,
    walletType,
    occurrenceCode,
    daysCount: rawDaysCount ? parseNumber(rawDaysCount) : undefined,
  };
}

/**
 * Parses Itaú-specific fields from a CNAB400 return detail record.
 *
 * @param line - 400-character return detail line.
 * @returns Parsed Itaú-specific return fields.
 * @throws {Error} When the line length is invalid.
 */
export function parseItauReturnFields(line: string): ItauReturnFields {
  if (line.length !== LINE_LENGTH) {
    throw new Error(`Invalid Itaú return detail line length: ${line.length}`);
  }

  return {
    walletNumber: trimToUndefined(extractField(line, 83, 85)),
    walletType: trimToUndefined(
      extractField(
        line,
        DETAIL_RECORD_RETORNO_POSITIONS.PORTFOLIO_CODE.start,
        DETAIL_RECORD_RETORNO_POSITIONS.PORTFOLIO_CODE.start,
      ),
    ),
    bankOurNumber: trimToUndefined(extractField(line, 86, 93)),
    bankOurNumberDigit: trimToUndefined(extractField(line, 94, 94)),
    confirmedOurNumber: trimToUndefined(extractField(line, 127, 134)),
    canceledInstructionCode: extractField(line, 302, 305),
    rejectionMessage: trimToUndefined(extractField(line, 378, 385)),
    liquidationCode: trimToUndefined(extractField(line, 393, 394)),
  };
}
