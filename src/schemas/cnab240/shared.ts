/**
 * Shared CNAB240 schema helpers
 */

import { z } from 'zod';
import { RECORD_TYPE } from '../../constants/cnab240';

export const BankCodeSchema = z.string().regex(/^\d{3}$/, 'Bank code must be 3 digits');

export const BatchNumberStringSchema = z.string().regex(/^\d{4}$/, 'Batch number must be 4 digits');

export const BatchNumberSchema = z
  .number()
  .int('Batch number must be an integer')
  .nonnegative('Batch number must be non-negative');

export const RecordTypeFileHeaderSchema = z.literal(RECORD_TYPE.FILE_HEADER);
export const RecordTypeBatchHeaderSchema = z.literal(RECORD_TYPE.BATCH_HEADER);
export const RecordTypeDetailSchema = z.literal(RECORD_TYPE.DETAIL);
export const RecordTypeBatchTrailerSchema = z.literal(RECORD_TYPE.BATCH_TRAILER);
export const RecordTypeFileTrailerSchema = z.literal(RECORD_TYPE.FILE_TRAILER);

export const SegmentCodeSchema = z.enum(['P', 'Q', 'R']);

export const CompanyRegistrationTypeSchema = z.enum(['0', '1', '2']);
export const PayerRegistrationTypeSchema = z.enum(['0', '1', '2', '9']);

export const BankAccountNumberSchema = z.string().min(1, 'Account is required');
export const AgencyNumberSchema = z.string().min(1, 'Agency is required');

export const DocumentNumberSchema = z
  .string()
  .regex(/^\d{11,14}$/, 'Document number must be 11 or 14 digits');

export const RecordSequenceSchema = z
  .number()
  .int('Sequential number must be an integer')
  .nonnegative('Sequential number must be non-negative');
