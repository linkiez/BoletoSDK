/**
 * CNAB240 Segment R schema
 */

import { z } from 'zod';
import {
  BankCodeSchema,
  BatchNumberSchema,
  RecordSequenceSchema,
  RecordTypeDetailSchema,
} from './shared';

export const SegmentRSchema = z.object({
  bankCode: BankCodeSchema,
  batchNumber: BatchNumberSchema,
  recordType: RecordTypeDetailSchema,
  sequentialNumber: RecordSequenceSchema,
  segmentCode: z.literal('R'),
  cnabReserved1: z.string().optional(),
  occurrenceCode: z.string().min(1, 'Occurrence code is required'),
  discount2Code: z.string().optional(),
  discount2Date: z.date().optional(),
  discount2Amount: z.number().nonnegative().optional(),
  discount3Code: z.string().optional(),
  discount3Date: z.date().optional(),
  discount3Amount: z.number().nonnegative().optional(),
  fineCode: z.string().optional(),
  fineDate: z.date().optional(),
  fineAmount: z.number().nonnegative().optional(),
  payerInfo: z.string().optional(),
  payerInformation: z.string().optional(),
  payerInformation2: z.string().optional(),
  cnabReserved2: z.string().optional(),
  occurrenceCodeComplement: z.string().optional(),
  debitBankCode: z.string().optional(),
  debitAgency: z.string().optional(),
  debitAgencyDigit: z.string().optional(),
  debitAccount: z.string().optional(),
  debitAccountDigit: z.string().optional(),
  debitAccountDV: z.string().optional(),
  debitNoticeEmission: z.string().optional(),
  cnabReserved3: z.string().optional(),
});
