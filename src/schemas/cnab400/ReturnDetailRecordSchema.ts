/**
 * CNAB400 Return Detail Record schema
 */

import { z } from 'zod';
import { DetailRecordSchema } from './DetailRecordSchema';

export const ReturnDetailRecordSchema = DetailRecordSchema.extend({
  occurrenceCode: z.string().min(1, 'Occurrence code is required'),
  occurrenceDate: z.date().optional(),
  bankDocumentNumber: z.string().optional(),
  creditDate: z.date().optional(),
  paymentAmount: z.number().nonnegative().optional(),
  expensesAmount: z.number().nonnegative().optional(),
  rejectionReasons: z.array(z.string()).optional(),
});
