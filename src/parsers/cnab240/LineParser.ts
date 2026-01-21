/**
 * CNAB240 Line Parser
 *
 * Base parser for 240-character CNAB lines.
 * All CNAB240 records are exactly 240 characters.
 *
 * @module parsers/cnab240/LineParser
 */

import { ParseError } from '../../errors';

/**
 * Parse a CNAB240 line and extract field by position
 *
 * @param line - The 240-character CNAB line
 * @param start - Start position (1-indexed)
 * @param end - End position (1-indexed, inclusive)
 * @returns Extracted field as string (trimmed)
 * @throws {ParseError} If line length is invalid
 *
 * @example
 * ```typescript
 * const bankCode = extractField(line, 1, 3); // Positions 1-3
 * ```
 */
export function extractField(line: string, start: number, end: number): string {
  if (line.length !== 240) {
    throw new ParseError(`Invalid CNAB240 line length: expected 240, got ${line.length}`);
  }

  // Convert from 1-indexed to 0-indexed
  const value = line.substring(start - 1, end);
  return value.trim();
}

/**
 * Parse a numeric field
 *
 * @param line - The CNAB line
 * @param start - Start position (1-indexed)
 * @param end - End position (1-indexed, inclusive)
 * @returns Parsed number
 *
 * @example
 * ```typescript
 * const sequentialNumber = parseNumericField(line, 158, 163); // 6 digits
 * ```
 */
export function parseNumericField(line: string, start: number, end: number): number {
  const value = extractField(line, start, end);
  return value.length === 0 ? 0 : parseInt(value, 10);
}

/**
 * Parse a decimal field with implied decimals
 *
 * @param line - The CNAB line
 * @param start - Start position (1-indexed)
 * @param end - End position (1-indexed, inclusive)
 * @param decimals - Number of implied decimal places (default: 2)
 * @returns Parsed decimal number
 *
 * @example
 * ```typescript
 * // Value "0000000015000" with 2 decimals = 150.00
 * const amount = parseDecimalField(line, 78, 92, 2);
 * ```
 */
export function parseDecimalField(
  line: string,
  start: number,
  end: number,
  decimals: number = 2,
): number {
  const value = extractField(line, start, end);
  if (value.length === 0) return 0;

  const numValue = parseInt(value, 10);
  return numValue / Math.pow(10, decimals);
}

/**
 * Parse a date field (DDMMYYYY format)
 *
 * @param line - The CNAB line
 * @param start - Start position (1-indexed)
 * @param end - End position (1-indexed, inclusive)
 * @returns Parsed Date object or undefined if date is zeros
 *
 * @example
 * ```typescript
 * // Value "21012026" = 2026-01-21
 * const issueDate = parseDateField(line, 71, 78);
 * ```
 */
export function parseDateField(line: string, start: number, end: number): Date | undefined {
  const value = extractField(line, start, end);

  // Check for zero date (00000000)
  if (!value || value === '00000000' || parseInt(value, 10) === 0) {
    return undefined;
  }

  // Parse DDMMYYYY format
  const day = parseInt(value.substring(0, 2), 10);
  const month = parseInt(value.substring(2, 4), 10);
  const year = parseInt(value.substring(4, 8), 10);

  return new Date(year, month - 1, day);
}

/**
 * Validate CNAB240 record type
 *
 * @param line - The CNAB line
 * @param expectedType - Expected record type
 * @throws {ParseError} If record type doesn't match
 */
export function validateRecordType(line: string, expectedType: string): void {
  const recordType = extractField(line, 8, 8);

  if (recordType !== expectedType) {
    throw new ParseError(`Invalid record type: expected ${expectedType}, got ${recordType}`);
  }
}

/**
 * Validate CNAB240 segment code
 *
 * @param line - The CNAB line
 * @param expectedSegment - Expected segment code
 * @throws {ParseError} If segment code doesn't match
 */
export function validateSegmentCode(line: string, expectedSegment: string): void {
  const segmentCode = extractField(line, 14, 14);

  if (segmentCode !== expectedSegment) {
    throw new ParseError(`Invalid segment code: expected ${expectedSegment}, got ${segmentCode}`);
  }
}
