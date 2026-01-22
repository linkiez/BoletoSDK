/**
 * CNAB400 Return File schema
 */

import { z } from 'zod';
import { Cnab400FileSchema } from './Cnab400FileSchema';
import { ReturnDetailRecordSchema } from './ReturnDetailRecordSchema';

export const Cnab400ReturnFileSchema = Cnab400FileSchema.extend({
  details: z.array(ReturnDetailRecordSchema).min(1, 'At least one detail record is required'),
});
