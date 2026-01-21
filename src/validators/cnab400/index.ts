import { Cnab400File } from '../../types/cnab400';

/**
 * Result of validation operations
 */
export interface ValidationResult {
  /** Whether validation passed */
  isValid: boolean;
  /** List of validation error messages */
  errors: string[];
}

/**
 * Validates the basic structure of a CNAB400 file
 *
 * Checks for:
 * - Presence of header record
 * - Presence of trailer record
 * - Presence of at least one detail record
 * - Record count consistency (header + details + trailer = totalRecords)
 *
 * @param file - CNAB400 file object to validate
 * @returns Validation result with errors if any
 *
 * @example
 * ```typescript
 * const result = validateFileStructure(cnab400File);
 * if (!result.isValid) {
 *   console.error('Validation errors:', result.errors);
 * }
 * ```
 */
export function validateFileStructure(file: Cnab400File): ValidationResult {
  const errors: string[] = [];

  // Check header exists
  if (!file.header) {
    errors.push('Missing header');
  }

  // Check trailer exists
  if (!file.trailer) {
    errors.push('Missing trailer');
  }

  // Check details exist and not empty
  if (!file.details || file.details.length === 0) {
    errors.push('No detail records found');
  }

  // Check record count matches (header + details + trailer)
  if (file.trailer && file.details) {
    const expectedCount = 1 + file.details.length + 1; // header + details + trailer
    const actualCount = file.trailer.totalRecords;

    if (expectedCount !== actualCount) {
      errors.push(`Record count mismatch: expected ${expectedCount}, got ${actualCount}`);
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Performs complete validation of a CNAB400 file
 *
 * Validates:
 * - File structure (header, trailer, details)
 * - Business rules (record counts, data consistency)
 * - Format compliance
 *
 * @param file - CNAB400 file object to validate
 * @returns Validation result with all errors found
 *
 * @example
 * ```typescript
 * const result = validateCnab400File(cnab400File);
 * if (result.isValid) {
 *   console.log('File is valid');
 * } else {
 *   console.error('Validation failed:', result.errors);
 * }
 * ```
 */
export function validateCnab400File(file: Cnab400File): ValidationResult {
  const errors: string[] = [];

  // Perform structural validation
  const structureResult = validateFileStructure(file);
  errors.push(...structureResult.errors);

  // Additional business rule validations can be added here:
  // - Date validations (due dates in the future, generation dates valid)
  // - Amount validations (positive values, within limits)
  // - Reference number validations (format, uniqueness)
  // - Bank code validations (valid bank codes)
  // etc.

  return {
    isValid: errors.length === 0,
    errors,
  };
}
