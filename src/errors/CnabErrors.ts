/**
 * Custom error classes for BoletoSDK
 * @module errors
 */

/**
 * Base error class for all CNAB-related errors
 * Provides structured error information with code and context
 *
 * @example
 * ```typescript
 * throw new CnabError('Invalid file format', 'INVALID_FORMAT', { lineNumber: 1 });
 * ```
 */
export class CnabError extends Error {
  public readonly code?: string;
  public readonly context?: Record<string, unknown>;

  constructor(message: string, code?: string, context?: Record<string, unknown>) {
    super(message);
    this.name = 'CnabError';
    this.code = code;
    this.context = context;

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, CnabError);
    }
  }
}

/**
 * Error thrown during CNAB file parsing
 */
export class ParseError extends CnabError {
  public readonly line?: number;

  constructor(message: string, line?: number, context?: Record<string, unknown>) {
    super(message, 'PARSE_ERROR', { ...context, line });
    this.name = 'ParseError';
    this.line = line;

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ParseError);
    }
  }
}

/**
 * Error thrown during data validation
 */
export class ValidationError extends CnabError {
  public readonly issues?: Array<{
    path: (string | number)[];
    message: string;
    code?: string;
  }>;

  constructor(
    message: string,
    issues?: Array<{ path: (string | number)[]; message: string; code?: string }>,
  ) {
    super(message, 'VALIDATION_ERROR', { issues });
    this.name = 'ValidationError';
    this.issues = issues;

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ValidationError);
    }
  }
}

/**
 * Error thrown during CNAB file generation
 */
export class GenerationError extends CnabError {
  public readonly field?: string;

  constructor(message: string, field?: string, context?: Record<string, unknown>) {
    super(message, 'GENERATION_ERROR', { ...context, field });
    this.name = 'GenerationError';
    this.field = field;

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, GenerationError);
    }
  }
}
