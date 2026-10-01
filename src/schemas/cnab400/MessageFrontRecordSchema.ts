/**
 * CNAB400 Message Front Record schema
 */

import { z } from 'zod';
import { RecordSequenceSchema, RecordTypeMessageFrontSchema } from './shared';

export const MessageFrontRecordSchema = z.object({
  recordType: RecordTypeMessageFrontSchema,
  flashCode: z.string().max(3).optional(),
  lineNumber1: z.number().int().min(0).max(99).optional(),
  message1: z.string().max(128).optional(),
  lineNumber2: z.number().int().min(0).max(99).optional(),
  message2: z.string().max(128).optional(),
  lineNumber3: z.number().int().min(0).max(99).optional(),
  message3: z.string().max(127).optional(),
  destinationCode: z.string().max(1).optional(),
  sequentialNumber: RecordSequenceSchema,
});
