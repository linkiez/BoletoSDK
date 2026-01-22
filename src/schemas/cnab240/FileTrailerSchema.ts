/**
 * CNAB240 File Trailer schema
 */

import { z } from 'zod';
import { BankCodeSchema, BatchNumberStringSchema, RecordTypeFileTrailerSchema } from './shared';

export const FileTrailerSchema = z.object({
  bankCode: BankCodeSchema,
  batchNumber: BatchNumberStringSchema,
  recordType: RecordTypeFileTrailerSchema,
  cnabReserved1: z.string().optional(),
  totalBatches: z.number().int().nonnegative(),
  totalRecords: z.number().int().nonnegative(),
  totalAccounts: z.number().int().nonnegative().optional(),
  cnabReserved2: z.string().optional(),
});
