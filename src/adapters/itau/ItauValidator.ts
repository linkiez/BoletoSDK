import type { ValidationResult } from '../../validators/common';
import { isValidItauOccurrenceCode } from './ItauOccurrenceMapper';
import { isValidItauWallet } from './ItauWalletValidator';
import type { ItauRemittanceFields, ItauReturnFields } from '../../types/adapters';

function createValidationResult(errors: string[]): ValidationResult {
  return {
    isValid: errors.length === 0,
    errors,
  };
}

function isFourDigitCode(value: string): boolean {
  return /^\d{4}$/.test(value);
}

function isTwoDigitCode(value: string): boolean {
  return /^\d{2}$/.test(value);
}

function isSingleItauWalletType(value: string | undefined): boolean {
  return value === 'I';
}

/**
 * Validates Itaú-specific remittance fields.
 *
 * @param fields - Parsed Itaú remittance fields.
 * @returns Validation result with collected errors.
 */
export function validateItauRemittanceFields(fields: ItauRemittanceFields): ValidationResult {
  const errors: string[] = [];

  if (!isFourDigitCode(fields.instructionCancellationCode)) {
    errors.push(
      `Invalid Itaú instruction cancellation code: ${fields.instructionCancellationCode}`,
    );
  }

  if (!fields.walletNumber || !isValidItauWallet(fields.walletNumber)) {
    errors.push(`Unsupported Itau wallet code: ${fields.walletNumber ?? ''}`.trim());
  }

  if (!isSingleItauWalletType(fields.walletType)) {
    errors.push(`Invalid Itaú wallet type: ${fields.walletType ?? ''}`);
  }

  if (
    !fields.occurrenceCode ||
    (fields.occurrenceCode !== '01' && !isValidItauOccurrenceCode(fields.occurrenceCode))
  ) {
    errors.push(`Unsupported Itau occurrence code: ${fields.occurrenceCode ?? ''}`);
  }

  if (
    fields.daysCount !== undefined &&
    (!Number.isInteger(fields.daysCount) || fields.daysCount < 0 || fields.daysCount > 99)
  ) {
    errors.push(`Invalid Itaú days count: ${fields.daysCount}`);
  }

  return createValidationResult(errors);
}

/**
 * Validates Itaú-specific return fields.
 *
 * @param fields - Parsed Itaú return fields.
 * @returns Validation result with collected errors.
 */
export function validateItauReturnFields(fields: ItauReturnFields): ValidationResult {
  const errors: string[] = [];

  if (fields.walletNumber && !isValidItauWallet(fields.walletNumber)) {
    errors.push(`Unsupported Itau wallet code: ${fields.walletNumber}`);
  }

  if (!isSingleItauWalletType(fields.walletType)) {
    errors.push(`Invalid Itaú wallet type: ${fields.walletType ?? ''}`);
  }

  if (fields.bankOurNumberDigit !== undefined && !/^\d$/.test(fields.bankOurNumberDigit)) {
    errors.push(`Invalid Itaú bank our-number digit: ${fields.bankOurNumberDigit}`);
  }

  if (
    fields.bankOurNumber &&
    fields.confirmedOurNumber &&
    fields.bankOurNumber !== fields.confirmedOurNumber
  ) {
    errors.push('Bank our-number does not match confirmed our-number');
  }

  if (!isFourDigitCode(fields.canceledInstructionCode)) {
    errors.push(`Invalid Itaú canceled instruction code: ${fields.canceledInstructionCode}`);
  }

  if (fields.liquidationCode !== undefined && !isTwoDigitCode(fields.liquidationCode)) {
    errors.push(`Invalid Itaú liquidation code: ${fields.liquidationCode}`);
  }

  return createValidationResult(errors);
}

/**
 * Asserts that Itaú remittance fields are valid.
 *
 * @param fields - Parsed Itaú remittance fields.
 * @throws {Error} When the remittance fields are invalid.
 */
export function assertValidItauRemittanceFields(fields: ItauRemittanceFields): void {
  const result = validateItauRemittanceFields(fields);
  if (!result.isValid) {
    throw new Error('Invalid Itaú remittance fields');
  }
}

/**
 * Asserts that Itaú return fields are valid.
 *
 * @param fields - Parsed Itaú return fields.
 * @throws {Error} When the return fields are invalid.
 */
export function assertValidItauReturnFields(fields: ItauReturnFields): void {
  const result = validateItauReturnFields(fields);
  if (!result.isValid) {
    throw new Error('Invalid Itaú return fields');
  }
}
