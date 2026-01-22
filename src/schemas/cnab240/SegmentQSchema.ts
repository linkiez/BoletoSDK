/**
 * CNAB240 Segment Q schema
 */

import { z } from 'zod';
import {
  BankCodeSchema,
  BatchNumberSchema,
  PayerRegistrationTypeSchema,
  RecordSequenceSchema,
  RecordTypeDetailSchema,
} from './shared';

export const SegmentQSchema = z.object({
  bankCode: BankCodeSchema,
  batchNumber: BatchNumberSchema,
  recordType: RecordTypeDetailSchema,
  sequentialNumber: RecordSequenceSchema,
  segmentCode: z.literal('Q'),
  cnabReserved1: z.string().optional(),
  occurrenceCode: z.string().min(1, 'Occurrence code is required'),
  payerRegistrationType: PayerRegistrationTypeSchema,
  payerTaxId: z.string().regex(/^\d{11,14}$/, 'Payer tax ID must be 11 or 14 digits'),
  payerName: z.string().min(1, 'Payer name is required'),
  payerAddress: z.string().min(1, 'Payer address is required'),
  payerNeighborhood: z.string().min(1, 'Payer neighborhood is required'),
  payerPostalCode: z.string().regex(/^\d{8}$/, 'Payer postal code must be 8 digits'),
  payerCity: z.string().min(1, 'Payer city is required'),
  payerState: z.string().regex(/^[A-Z]{2}$/, 'Payer state must be 2 letters'),
  guarantorRegistrationType: z.string().optional(),
  guarantorTaxId: z.string().optional(),
  guarantorName: z.string().optional(),
  correspondentBankCode: z.string().optional(),
  correspondentOurNumber: z.string().optional(),
  cnabReserved2: z.string().optional(),
});
