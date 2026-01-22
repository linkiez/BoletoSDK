/**
 * CNAB240 Batch Header schema
 */

import { z } from 'zod';
import {
  BankCodeSchema,
  BatchNumberSchema,
  CompanyRegistrationTypeSchema,
  DocumentNumberSchema,
  RecordTypeBatchHeaderSchema,
} from './shared';

export const BatchHeaderSchema = z.object({
  bankCode: BankCodeSchema,
  batchNumber: BatchNumberSchema,
  recordType: RecordTypeBatchHeaderSchema,
  operationType: z.enum(['C', 'D', 'E', 'I']),
  serviceType: z.string().regex(/^\d{2}$/, 'Service type must be 2 digits'),
  serviceVersion: z.string().optional(),
  cnabReserved1: z.string().optional(),
  companyRegistrationType: CompanyRegistrationTypeSchema,
  companyRegistrationNumber: DocumentNumberSchema,
  agreementCode: z.string().optional(),
  agency: z.string().min(1, 'Agency is required'),
  agencyDigit: z.string().optional(),
  account: z.string().min(1, 'Account is required'),
  accountDigit: z.string().min(1, 'Account digit is required'),
  fullAccountDigit: z.string().optional(),
  companyName: z.string().min(1, 'Company name is required'),
  message1: z.string().optional(),
  message2: z.string().optional(),
  remittanceReturnNumber: z.number().int().nonnegative().optional(),
  recordingDate: z.date().optional(),
  creditDate: z.date().optional(),
  cnabReserved2: z.string().optional(),
});
