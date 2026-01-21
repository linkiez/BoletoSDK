/**
 * CNAB Generator Factory
 * Creates appropriate generator based on CNAB format type
 */

import { CnabError } from '../errors';
import type { Cnab240File } from '../types/cnab240';
import type { Cnab400File } from '../types/cnab400';
import { generateCnab240 } from './cnab240';
import { generateCnab400 } from './cnab400';

/**
 * Generate CNAB file from parsed structure
 *
 * @param data - Parsed CNAB data (240 or 400 format)
 * @returns Generated CNAB file content
 * @throws {CnabError} if data format is invalid
 *
 * @example
 * ```typescript
 * const cnabContent = generateCnab(parsedData);
 * ```
 */
export function generateCnab(data: Cnab240File | Cnab400File): string {
  // Detect format by presence of specific properties
  if ('fileHeader' in data && 'batches' in data) {
    // CNAB240 has fileHeader and batches
    return generateCnab240(data as Cnab240File);
  }

  if ('header' in data && 'details' in data && 'trailer' in data) {
    // CNAB400 has header, details, trailer
    return generateCnab400(data as Cnab400File);
  }

  throw new CnabError('Invalid CNAB data structure: cannot determine format');
}
