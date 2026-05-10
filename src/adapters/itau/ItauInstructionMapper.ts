import { CommonInstructionCode } from '../../enums';
import type { ItauInstructionCode, ItauInstructionMapping } from '../../types/adapters';

/**
 * Normalized mapping for Itaú CNAB400 instruction codes.
 */
export const ITAU_INSTRUCTION_CODE_MAP: Record<ItauInstructionCode, ItauInstructionMapping> = {
  '00': { code: '00', commonCode: CommonInstructionCode.NONE, description: 'No instruction' },
  '01': {
    code: '01',
    commonCode: CommonInstructionCode.PROTEST,
    description: 'Protest automatically after N days',
  },
  '02': {
    code: '02',
    commonCode: CommonInstructionCode.DO_NOT_PROTEST,
    description: 'Do not protest',
  },
  '03': {
    code: '03',
    commonCode: CommonInstructionCode.RETURN,
    description: 'Lower to profit after N days',
  },
  '04': { code: '04', description: 'Waive protest' },
  '05': { code: '05', description: 'Protest on due date' },
  '06': { code: '06', description: 'Automatic cancellation after N days overdue' },
  '07': { code: '07', description: 'Negative for non-payment' },
  '08': { code: '08', description: 'Do not collect bank fee' },
  '09': { code: '09', description: 'Cancellation for specific title' },
  '10': {
    code: '10',
    commonCode: CommonInstructionCode.NO_INTEREST,
    description: 'Do not charge interest',
  },
  '11': { code: '11', description: 'Cancel conditional discount' },
  '12': {
    code: '12',
    commonCode: CommonInstructionCode.NO_FINE,
    description: 'Exempt fine',
  },
  '13': { code: '13', description: 'Limit discount to settlement date' },
  '14': { code: '14', description: 'Exempt IOF' },
  '15': { code: '15', description: 'Cancel protest and automatic negative' },
};

/**
 * Checks whether a code is a supported Itaú instruction code.
 *
 * @param instructionCode - Two-digit instruction code.
 * @returns True when the code is supported by the Itaú mapper.
 */
export function isValidItauInstructionCode(
  instructionCode: string,
): instructionCode is ItauInstructionCode {
  return /^\d{2}$/.test(instructionCode) && instructionCode in ITAU_INSTRUCTION_CODE_MAP;
}

/**
 * Maps an Itaú instruction code to a normalized representation.
 *
 * @param instructionCode - Two-digit Itaú instruction code.
 * @returns Normalized instruction mapping.
 * @throws {Error} When the instruction code is not supported.
 */
export function mapItauInstructionCode(instructionCode: string): ItauInstructionMapping {
  if (!isValidItauInstructionCode(instructionCode)) {
    throw new Error(`Unsupported Itau instruction code: ${instructionCode}`);
  }

  return ITAU_INSTRUCTION_CODE_MAP[instructionCode];
}
