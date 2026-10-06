/**
 * CNAB400 Main Generator
 *
 * Converts CNAB400File structure to text format.
 *
 * @module generators/cnab400/Cnab400Generator
 */

import { LINE_LENGTH } from '../../constants/cnab400';
import { GenerationError } from '../../errors';
import type { Cnab400File, PenaltyRecord } from '../../types/cnab400';
import { generateDetailRecord, generateDetailRecordRemessa } from './DetailRecordGenerator';
import { generateFileHeader } from './FileHeaderGenerator';
import { generateFileTrailer } from './FileTrailerGenerator';
import { generateMessageFrontRecord } from './MessageFrontRecordGenerator';
import { generatePenaltyRecord } from './PenaltyRecordGenerator';

/**
 * Main generator function - converts CNAB400File to text
 *
 * Orchestrates the generation of all record types and assembles the complete file.
 *
 * @param file - Complete CNAB400 file data structure
 * @returns CNAB400 file content with CRLF-separated, CRLF-terminated records
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
  validateFileStructure(file);

  const isRemessa = file.header.operationType === '1';
  const lines = [
    generateFileHeader(file.header),
    ...generateDetailRecords(file, isRemessa),
    ...generateOptionalRecords(file, isRemessa),
    generateFileTrailer(file.trailer),
  ];

  validateLineLengths(lines);

  return `${lines.join('\r\n')}\r\n`;
}

function validateFileStructure(file: Cnab400File): void {
  if (!file.header) {
    throw new GenerationError('File header is required');
  }

  if (!file.trailer) {
    throw new GenerationError('File trailer is required');
  }

  if (!Array.isArray(file.details)) {
    throw new GenerationError('File details must be an array');
  }
}

function generateDetailRecords(file: Cnab400File, isRemessa: boolean): string[] {
  if (!isRemessa) {
    return file.details.map(generateDetailRecord);
  }

  const detailIndexesByControl = new Map<string, number[]>();
  for (const [index, detail] of file.details.entries()) {
    if (detail.companyControl) {
      const indexes = detailIndexesByControl.get(detail.companyControl) ?? [];
      indexes.push(index);
      detailIndexesByControl.set(detail.companyControl, indexes);
    }
  }

  const penaltiesByDetailIndex = new Map<number, PenaltyRecord>();
  for (const penalty of file.penaltyRecords ?? []) {
    let detailIndexes: number[];
    if (penalty.detailIndex !== undefined) {
      const detail = file.details[penalty.detailIndex];
      detailIndexes =
        Number.isInteger(penalty.detailIndex) &&
        penalty.detailIndex >= 0 &&
        detail !== undefined &&
        (penalty.detailCompanyControl === undefined ||
          detail.companyControl === penalty.detailCompanyControl)
          ? [penalty.detailIndex]
          : [];
    } else if (penalty.detailCompanyControl === undefined) {
      detailIndexes = file.details.length === 1 ? [0] : [];
    } else {
      detailIndexes = detailIndexesByControl.get(penalty.detailCompanyControl) ?? [];
    }

    if (detailIndexes.length !== 1) {
      throw new GenerationError('Penalty record must reference exactly one detail');
    }

    const [detailIndex] = detailIndexes;
    if (penaltiesByDetailIndex.has(detailIndex)) {
      throw new GenerationError('A detail cannot have multiple penalty records');
    }
    penaltiesByDetailIndex.set(detailIndex, penalty);
  }

  const lines: string[] = [];
  for (const [index, detail] of file.details.entries()) {
    lines.push(generateDetailRecordRemessa(detail));
    const penalty = penaltiesByDetailIndex.get(index);
    if (penalty) {
      lines.push(generatePenaltyRecord(penalty));
    }
  }

  return lines;
}

function generateOptionalRecords(file: Cnab400File, isRemessa: boolean): string[] {
  if (!isRemessa) {
    return [];
  }

  return [...(file.messageFrontRecords ?? []).map(generateMessageFrontRecord)];
}

function validateLineLengths(lines: readonly string[]): void {
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].length !== LINE_LENGTH) {
      throw new GenerationError(
        `Line ${i + 1} has invalid length: ${lines[i].length} (expected ${LINE_LENGTH})`,
        'lineLength',
      );
    }
  }
}
