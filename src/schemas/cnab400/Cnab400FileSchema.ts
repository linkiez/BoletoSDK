/**
 * CNAB400 File schema
 */

import { z } from 'zod';
import { DetailRecordSchema } from './DetailRecordSchema';
import { FileHeaderSchema } from './FileHeaderSchema';
import { FileTrailerSchema } from './FileTrailerSchema';
import { GuarantorRecordSchema } from './GuarantorRecordSchema';
import { MessageBackRecordSchema } from './MessageBackRecordSchema';
import { MessageFrontRecordSchema } from './MessageFrontRecordSchema';
import { PenaltyRecordSchema } from './PenaltyRecordSchema';

export const Cnab400FileSchema = z.object({
  header: FileHeaderSchema,
  details: z.array(DetailRecordSchema).min(1, 'At least one detail record is required'),
  penaltyRecords: z.array(PenaltyRecordSchema).optional(),
  guarantorRecords: z.array(GuarantorRecordSchema).optional(),
  messageFrontRecords: z.array(MessageFrontRecordSchema).optional(),
  messageBackRecords: z.array(MessageBackRecordSchema).optional(),
  trailer: FileTrailerSchema,
});
