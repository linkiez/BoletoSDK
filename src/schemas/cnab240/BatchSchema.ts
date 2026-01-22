/**
 * CNAB240 Batch schema
 */

import { z } from 'zod';
import { BatchHeaderSchema } from './BatchHeaderSchema';
import { BatchTrailerSchema } from './BatchTrailerSchema';
import { DetailRecordSchema } from './DetailRecordSchema';

export const BatchSchema = z.object({
  header: BatchHeaderSchema,
  details: z.array(DetailRecordSchema).min(1, 'At least one detail record is required'),
  trailer: BatchTrailerSchema,
});
