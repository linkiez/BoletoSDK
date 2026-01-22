/**
 * CNAB240 File schema
 */

import { z } from 'zod';
import { BatchSchema } from './BatchSchema';
import { FileHeaderSchema } from './FileHeaderSchema';
import { FileTrailerSchema } from './FileTrailerSchema';

export const Cnab240FileSchema = z.object({
  fileHeader: FileHeaderSchema,
  batches: z.array(BatchSchema).min(1, 'At least one batch is required'),
  fileTrailer: FileTrailerSchema,
});
