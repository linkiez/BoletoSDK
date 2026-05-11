import type { ValidationResult } from '../../validators/common';
import type { BradescoRemittanceFields, BradescoReturnFields } from '../../types/adapters';
import { calculateBradescoOurNumberCheckDigit } from './BradescoOurNumberCalculator';
import { isValidBradescoOccurrenceCode } from './BradescoOccurrenceMapper';
import { isValidBradescoWallet } from './BradescoWalletValidator';

function createValidationResult(errors: string[]): ValidationResult {
  return {
    isValid: errors.length === 0,
    errors,
  };
}

function isTwoDigitCode(value: string): boolean {
  return /^\d{2}$/.test(value);
}

function isValidBradescoCheckDigit(value: string | undefined): boolean {
  return value === undefined || /^[0-9P]$/.test(value);
}

function validateBradescoWalletAndOccurrence(fields: BradescoReturnFields, errors: string[]): void {
  if (fields.walletNumber && !isValidBradescoWallet(fields.walletNumber)) {
    errors.push(`Unsupported Bradesco wallet code: ${fields.walletNumber}`);
  }

  if (fields.walletType !== undefined && fields.walletType !== 'R') {
    errors.push(`Invalid Bradesco wallet type: ${fields.walletType}`);
  }

  if (fields.occurrenceCode && !isValidBradescoOccurrenceCode(fields.occurrenceCode)) {
    errors.push(`Unsupported Bradesco occurrence code: ${fields.occurrenceCode}`);
  }
}

function validateBradescoRawCheckDigits(fields: BradescoReturnFields, errors: string[]): void {
  if (!isValidBradescoCheckDigit(fields.ourNumberCheckDigit)) {
    errors.push(
      `Invalid Bradesco our-number check digit: ${fields.ourNumberCheckDigit ?? ''}`.trim(),
    );
  }

  if (!isValidBradescoCheckDigit(fields.confirmedOurNumberCheckDigit)) {
    errors.push(
      `Invalid Bradesco confirmed our-number check digit: ${fields.confirmedOurNumberCheckDigit ?? ''}`.trim(),
    );
  }
}

function validateBradescoCalculatedCheckDigits(
  fields: BradescoReturnFields,
  errors: string[],
): void {
  if (
    fields.ourNumber &&
    fields.ourNumberCheckDigit &&
    isValidBradescoCheckDigit(fields.ourNumberCheckDigit)
  ) {
    const expectedCheckDigit = calculateBradescoOurNumberCheckDigit(fields.ourNumber);
    if (fields.ourNumberCheckDigit !== expectedCheckDigit) {
      errors.push(
        `Invalid Bradesco our-number check digit for ${fields.ourNumber}: expected ${expectedCheckDigit}, got ${fields.ourNumberCheckDigit}`,
      );
    }
  }

  if (
    fields.confirmedOurNumber &&
    fields.confirmedOurNumberCheckDigit &&
    isValidBradescoCheckDigit(fields.confirmedOurNumberCheckDigit)
  ) {
    const expectedConfirmedCheckDigit = calculateBradescoOurNumberCheckDigit(
      fields.confirmedOurNumber,
    );
    if (fields.confirmedOurNumberCheckDigit !== expectedConfirmedCheckDigit) {
      errors.push(
        `Invalid Bradesco confirmed our-number check digit for ${fields.confirmedOurNumber}: expected ${expectedConfirmedCheckDigit}, got ${fields.confirmedOurNumberCheckDigit}`,
      );
    }
  }
}

function validateBradescoOurNumberConsistency(
  fields: BradescoReturnFields,
  errors: string[],
): void {
  if (
    fields.ourNumber &&
    fields.confirmedOurNumber &&
    fields.ourNumber !== fields.confirmedOurNumber
  ) {
    errors.push('Our-number does not match confirmed our-number');
  }
}

/**
 * Validates Bradesco remittance fields.
 *
 * @param fields - Parsed Bradesco remittance fields.
 * @returns Validation result with collected errors.
 */
export function validateBradescoRemittanceFields(
  fields: BradescoRemittanceFields,
): ValidationResult {
  const errors: string[] = [];

  if (!isTwoDigitCode(fields.instructionCode)) {
    errors.push(`Invalid Bradesco instruction code: ${fields.instructionCode}`);
  }

  if (!fields.walletNumber || !isValidBradescoWallet(fields.walletNumber)) {
    errors.push(`Unsupported Bradesco wallet code: ${fields.walletNumber ?? ''}`.trim());
  }

  if (fields.walletType !== 'R') {
    errors.push(`Invalid Bradesco wallet type: ${fields.walletType ?? ''}`);
  }

  if (
    !fields.occurrenceCode ||
    (fields.occurrenceCode !== '01' && !isValidBradescoOccurrenceCode(fields.occurrenceCode))
  ) {
    errors.push(`Unsupported Bradesco occurrence code: ${fields.occurrenceCode ?? ''}`);
  }

  if (
    fields.daysCount !== undefined &&
    (!Number.isInteger(fields.daysCount) || fields.daysCount < 0 || fields.daysCount > 99)
  ) {
    errors.push(`Invalid Bradesco days count: ${fields.daysCount}`);
  }

  return createValidationResult(errors);
}

/**
 * Validates Bradesco return fields.
 *
 * @param fields - Parsed Bradesco return fields.
 * @returns Validation result with collected errors.
 */
export function validateBradescoReturnFields(fields: BradescoReturnFields): ValidationResult {
  const errors: string[] = [];

  validateBradescoWalletAndOccurrence(fields, errors);
  validateBradescoRawCheckDigits(fields, errors);
  validateBradescoCalculatedCheckDigits(fields, errors);
  validateBradescoOurNumberConsistency(fields, errors);

  return createValidationResult(errors);
}

/**
 * Asserts that Bradesco remittance fields are valid.
 *
 * @param fields - Parsed Bradesco remittance fields.
 * @throws {Error} When remittance fields are invalid.
 */
export function assertValidBradescoRemittanceFields(fields: BradescoRemittanceFields): void {
  const result = validateBradescoRemittanceFields(fields);

  if (!result.isValid) {
    throw new Error('Invalid Bradesco remittance fields');
  }
}

/**
 * Asserts that Bradesco return fields are valid.
 *
 * @param fields - Parsed Bradesco return fields.
 * @throws {Error} When return fields are invalid.
 */
export function assertValidBradescoReturnFields(fields: BradescoReturnFields): void {
  const result = validateBradescoReturnFields(fields);

  if (!result.isValid) {
    throw new Error('Invalid Bradesco return fields');
  }
}
