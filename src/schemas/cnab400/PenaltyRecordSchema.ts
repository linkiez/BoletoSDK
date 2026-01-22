/**
 * CNAB400 Penalty Record schema
 */

import { z } from 'zod';
import { RecordSequenceSchema, RecordTypePenaltySchema } from './shared';

export const PenaltyRecordSchema = z.object({
  recordType: RecordTypePenaltySchema,
  penaltyCode: z.enum(['1', '2', '3']),
  penaltyDate: z.date().optional(),
  penaltyValue: z.number().nonnegative().optional(),
  sequentialNumber: RecordSequenceSchema,
});
