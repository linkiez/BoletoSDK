/**
 * CNAB400 File Trailer schema
 */

import { z } from 'zod';
import { RecordSequenceSchema, RecordTypeTrailerSchema } from './shared';

export const FileTrailerSchema = z.object({
  recordType: RecordTypeTrailerSchema,
  totalRecords: z.number().int().nonnegative(),
  totalAmount: z.number().nonnegative().optional(),
  totalDetailRecords: z.number().int().nonnegative().optional(),
  zeros: z.string().optional(),
  sequentialNumber: RecordSequenceSchema,
});
