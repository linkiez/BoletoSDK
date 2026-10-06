/**
 * CNAB400 Penalty Record schema
 */

import { z } from 'zod';
import { RecordSequenceSchema, RecordTypePenaltySchema } from './shared';

export const PenaltyRecordSchema = z.object({
  recordType: RecordTypePenaltySchema,
  detailCompanyControl: z.string().optional(),
  detailIndex: z.number().int().nonnegative().optional(),
  penaltyCode: z.enum(['0', '1', '2']),
  penaltyDate: z.date().optional(),
  penaltyValue: z.number().nonnegative().optional(),
  sequentialNumber: RecordSequenceSchema,
});
