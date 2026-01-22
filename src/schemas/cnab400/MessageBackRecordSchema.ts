/**
 * CNAB400 Message Back Record schema
 */

import { z } from 'zod';
import { RecordSequenceSchema, RecordTypeMessageBackSchema } from './shared';

export const MessageBackRecordSchema = z.object({
  recordType: RecordTypeMessageBackSchema,
  message1: z.string().optional(),
  message2: z.string().optional(),
  message3: z.string().optional(),
  message4: z.string().optional(),
  sequentialNumber: RecordSequenceSchema,
});
