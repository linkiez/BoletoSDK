/**
 * CNAB400 Message Front Record schema
 */

import { z } from 'zod';
import { RecordSequenceSchema, RecordTypeMessageFrontSchema } from './shared';

export const MessageFrontRecordSchema = z.object({
  recordType: RecordTypeMessageFrontSchema,
  message1: z.string().optional(),
  message2: z.string().optional(),
  message3: z.string().optional(),
  message4: z.string().optional(),
  sequentialNumber: RecordSequenceSchema,
});
