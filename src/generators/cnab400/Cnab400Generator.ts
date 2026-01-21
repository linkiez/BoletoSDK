/**
 * CNAB400 Main Generator
 *
 * Converts CNAB400File structure to text format.
 *
 * @module generators/cnab400/Cnab400Generator
 */

import { GenerationError } from '../../errors';
import type { Cnab400File } from '../../types/cnab400';
import { generateDetailRecord, generateDetailRecordRemessa } from './DetailRecordGenerator';
import { generateFileHeader } from './FileHeaderGenerator';
import { generateFileTrailer } from './FileTrailerGenerator';
import { generatePenaltyRecord } from './PenaltyRecordGenerator';

/**
 * Main generator function - converts CNAB400File to text
 *
 * Orchestrates the generation of all record types and assembles the complete file.
 *
 * @param file - Complete CNAB400 file data structure
 * @returns CNAB400 file content as string (lines separated by \n)
 * @throws GenerationError if file structure is invalid
 *
 * @example
 * ```typescript
 * const file: Cnab400File = {
 *   header: {
 *     recordType: '0',
 *     operationType: '1',
 *     bankCode: '341',
 *     companyName: 'ACME Corp',
 *     generationDate: new Date('2026-02-01'),
 *     sequenceNumber: 1
 *   },
 *   details: [
 *     {
 *       recordType: '1',
 *       ourNumber: '12345678',
 *       amount: 150.00,
 *       dueDate: new Date('2026-03-15'),
 *       payerName: 'John Doe',
 *       sequentialNumber: 2
 *     }
 *   ],
 *   trailer: {
 *     recordType: '9',
 *     totalRecords: 3,
 *     totalAmount: 150.00,
 *     sequentialNumber: 3
 *   }
 * };
 *
 * const cnabText = generateCnab400(file);
 * // Returns multiline string with 400-character lines
 * ```
 */
export function generateCnab400(file: Cnab400File): string {
  if (!file.header) {
    throw new GenerationError('File header is required');
  }

  if (!file.trailer) {
    throw new GenerationError('File trailer is required');
  }

  if (!Array.isArray(file.details)) {
    throw new GenerationError('File details must be an array');
  }

  const lines: string[] = [];
  const isRemessa = file.header.operationType === '1';

  // Generate header
  lines.push(generateFileHeader(file.header));

  // Generate all detail records
  for (const detail of file.details) {
    if (isRemessa) {
      lines.push(generateDetailRecordRemessa(detail));
    } else {
      lines.push(generateDetailRecord(detail));
    }
  }

  // Generate penalty records (REMESSA only)
  if (isRemessa && file.penaltyRecords && file.penaltyRecords.length > 0) {
    for (const penalty of file.penaltyRecords) {
      lines.push(generatePenaltyRecord(penalty));
    }
  }

  // Generate trailer
  lines.push(generateFileTrailer(file.trailer));

  // Validate all lines are exactly 400 characters
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].length !== 400) {
      throw new GenerationError(
        `Line ${i + 1} has invalid length: ${lines[i].length} (expected 400)`,
        'lineLength',
      );
    }
  }

  return lines.join('\n');
}
