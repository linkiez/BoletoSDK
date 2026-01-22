/**
 * CNAB240 Batch Trailer schema
 */

import { z } from 'zod';
import { BankCodeSchema, BatchNumberSchema, RecordTypeBatchTrailerSchema } from './shared';

export const BatchTrailerSchema = z.object({
  bankCode: BankCodeSchema,
  batchNumber: BatchNumberSchema,
  recordType: RecordTypeBatchTrailerSchema,
  cnabReserved1: z.string().optional(),
  totalRecords: z.number().int().nonnegative(),
  totalSimpleSlips: z.number().int().nonnegative().optional(),
  totalSimpleAmount: z.number().nonnegative().optional(),
  totalEndorsedSlips: z.number().int().nonnegative().optional(),
  totalEndorsedAmount: z.number().nonnegative().optional(),
  totalCollectionSlips: z.number().int().nonnegative().optional(),
  totalCollectionAmount: z.number().nonnegative().optional(),
  warningCode: z.string().optional(),
  cnabReserved2: z.string().optional(),
});
