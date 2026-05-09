/**
 * CNAB Parser Factory
 * Creates appropriate parser based on file format detection
 */

import { CnabError } from '../errors';
import type { Cnab240File } from '../types/cnab240';
import type { Cnab400File, Cnab400ReturnFile } from '../types/cnab400';
import { parseCnab240 } from './cnab240';
import { parseCnab400 } from './cnab400';

/**
 * Auto-detect CNAB format and parse accordingly
 *
 * @param content - Complete CNAB file content
 * @returns Parsed CNAB file (240 or 400 format)
 * @throws {CnabError} if format cannot be detected or parsing fails
 *
 * @example
 * ```typescript
 * const parsed = parseCnab(fileContent);
 * if ('fileHeader' in parsed) {
 *   // CNAB240 file
 * } else {
 *   // CNAB400 file
 * }
 * ```
 */
export function parseCnab(content: string): Cnab240File | Cnab400File | Cnab400ReturnFile {
  if (!content || content.trim().length === 0) {
    throw new CnabError('File content cannot be empty');
  }

  const normalizedContent = content.replaceAll('\r', '');
  const lines = normalizedContent.split('\n').filter((line) => line.length > 0);

  if (lines.length === 0) {
    throw new CnabError('File contains no valid lines');
  }

  // Detect format by first line length
  const firstLineLength = lines[0].length;

  if (firstLineLength === 240) {
    return parseCnab240(normalizedContent);
  }

  if (firstLineLength === 400) {
    return parseCnab400(normalizedContent);
  }

  throw new CnabError(`Invalid CNAB format: line length ${firstLineLength} (expected 240 or 400)`);
}
