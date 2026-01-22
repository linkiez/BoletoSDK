/**
 * ValidationResult
 *
 * Standard result for validation operations across validators.
 */
export interface ValidationResult {
  /** Whether validation passed */
  isValid: boolean;
  /** List of validation error messages */
  errors: string[];
}
