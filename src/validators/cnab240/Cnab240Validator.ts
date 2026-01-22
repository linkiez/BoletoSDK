/**
 * CNAB240 Validator
 *
 * Validates CNAB240 file structure, batch integrity, and segment sequence.
 */

import { RECORD_TYPE } from '../../constants/cnab240';
import { Cnab240FileSchema } from '../../schemas/cnab240';
import type { Batch, Cnab240File, DetailRecord } from '../../types/cnab240';
import type { ValidationResult } from '../common';

const countDetailSegments = (detail: DetailRecord): number => {
  let count = 0;
  if (detail.segmentP) count += 1;
  if (detail.segmentQ) count += 1;
  if (detail.segmentR) count += 1;
  return count;
};

const countBatchRecords = (batch: Batch): number => {
  const detailSegments = batch.details.reduce(
    (sum, detail) => sum + countDetailSegments(detail),
    0,
  );
  return 2 + detailSegments; // header + trailer + segments
};

const countFileRecords = (file: Cnab240File): number => {
  const batchRecords = file.batches.reduce((sum, batch) => sum + countBatchRecords(batch), 0);
  return 2 + batchRecords; // file header + file trailer + batch records
};

const validateSegmentSequence = (detail: DetailRecord): string | null => {
  if (!detail.segmentP) return 'Missing segment P';
  if (!detail.segmentQ) return 'Missing segment Q';

  if (detail.segmentP.segmentCode !== 'P' || detail.segmentP.recordType !== RECORD_TYPE.DETAIL) {
    return 'Invalid segment P';
  }

  if (detail.segmentQ.segmentCode !== 'Q' || detail.segmentQ.recordType !== RECORD_TYPE.DETAIL) {
    return 'Invalid segment Q';
  }

  const expectedQ = detail.segmentP.sequentialNumber + 1;
  if (detail.segmentQ.sequentialNumber !== expectedQ) {
    return 'Invalid segment sequence';
  }

  if (detail.segmentR) {
    if (detail.segmentR.segmentCode !== 'R' || detail.segmentR.recordType !== RECORD_TYPE.DETAIL) {
      return 'Invalid segment R';
    }

    const expectedR = detail.segmentQ.sequentialNumber + 1;
    if (detail.segmentR.sequentialNumber !== expectedR) {
      return 'Invalid segment sequence';
    }
  }

  return null;
};

const validateBatchStructure = (batch: Batch, batchIndex: number, errors: string[]): void => {
  if (!batch.header) {
    errors.push(`Batch ${batchIndex}: missing header`);
    return;
  }

  if (!batch.trailer) {
    errors.push(`Batch ${batchIndex}: missing trailer`);
    return;
  }

  if (batch.header.recordType !== RECORD_TYPE.BATCH_HEADER) {
    errors.push(`Batch ${batchIndex}: invalid header record type`);
  }

  if (batch.trailer.recordType !== RECORD_TYPE.BATCH_TRAILER) {
    errors.push(`Batch ${batchIndex}: invalid trailer record type`);
  }

  if (batch.header.batchNumber !== batch.trailer.batchNumber) {
    errors.push(`Batch ${batchIndex}: header/trailer batch number mismatch`);
  }

  batch.details.forEach((detail, detailIndex) => {
    const sequenceError = validateSegmentSequence(detail);
    if (sequenceError === 'Missing segment P') {
      errors.push(`Batch ${batchIndex}, Detail ${detailIndex}: missing segment P`);
      return;
    }

    if (sequenceError === 'Missing segment Q') {
      errors.push(`Batch ${batchIndex}, Detail ${detailIndex}: missing segment Q`);
      return;
    }

    if (sequenceError === 'Invalid segment P' || sequenceError === 'Invalid segment Q') {
      errors.push(`Batch ${batchIndex}, Detail ${detailIndex}: invalid segment codes`);
      return;
    }

    if (sequenceError === 'Invalid segment R') {
      errors.push(`Batch ${batchIndex}, Detail ${detailIndex}: invalid segment R`);
      return;
    }

    if (sequenceError === 'Invalid segment sequence') {
      errors.push(`Batch ${batchIndex}, Detail ${detailIndex}: invalid segment sequence`);
    }
  });

  const expectedRecords = countBatchRecords(batch);
  if (batch.trailer.totalRecords !== expectedRecords) {
    errors.push(
      `Batch ${batchIndex}: record count mismatch: expected ${expectedRecords}, got ${batch.trailer.totalRecords}`,
    );
  }
};

/**
 * Validates the basic structure of a CNAB240 file
 *
 * Checks for:
 * - File header and file trailer presence
 * - At least one batch
 * - Batch header/trailer presence
 * - Segment sequence (P, Q, optional R)
 * - Record count consistency in batch trailer and file trailer
 */
export const validateFileStructure = (file: Cnab240File): ValidationResult => {
  const errors: string[] = [];

  if (!file.fileHeader) {
    errors.push('Missing file header');
  }

  if (!file.fileTrailer) {
    errors.push('Missing file trailer');
  }

  if (!file.batches || file.batches.length === 0) {
    errors.push('No batches found');
  }

  if (file.fileHeader && file.fileHeader.recordType !== RECORD_TYPE.FILE_HEADER) {
    errors.push('Invalid file header record type');
  }

  if (file.fileTrailer && file.fileTrailer.recordType !== RECORD_TYPE.FILE_TRAILER) {
    errors.push('Invalid file trailer record type');
  }

  file.batches.forEach((batch, index) => {
    validateBatchStructure(batch, index, errors);
  });

  if (file.fileTrailer && file.batches) {
    const expectedBatches = file.batches.length;
    if (file.fileTrailer.totalBatches !== expectedBatches) {
      errors.push(
        `File trailer batch count mismatch: expected ${expectedBatches}, got ${file.fileTrailer.totalBatches}`,
      );
    }

    const expectedRecords = countFileRecords(file);
    if (file.fileTrailer.totalRecords !== expectedRecords) {
      errors.push(
        `File trailer record count mismatch: expected ${expectedRecords}, got ${file.fileTrailer.totalRecords}`,
      );
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * Performs complete validation of a CNAB240 file
 *
 * Validates:
 * - File structure and counts
 * - Batch integrity
 * - Segment sequence
 */
export const validateCnab240File = (file: Cnab240File): ValidationResult => {
  const errors: string[] = [];

  const schemaResult = Cnab240FileSchema.safeParse(file);
  if (!schemaResult.success) {
    schemaResult.error.issues.forEach((issue) => {
      const path = issue.path.join('.') || 'root';
      errors.push(`Schema validation error at ${path}: ${issue.message}`);
    });
  }

  const structureResult = validateFileStructure(file);
  errors.push(...structureResult.errors);

  return {
    isValid: errors.length === 0,
    errors,
  };
};
