/**
 * CNAB240 File Header schema
 */

import { z } from 'zod';
import {
  BankCodeSchema,
  BatchNumberStringSchema,
  CompanyRegistrationTypeSchema,
  DocumentNumberSchema,
  RecordTypeFileHeaderSchema,
} from './shared';

export const FileHeaderSchema = z.object({
  bankCode: BankCodeSchema,
  batchNumber: BatchNumberStringSchema,
  recordType: RecordTypeFileHeaderSchema,
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
  bankName: z.string().min(1, 'Bank name is required'),
  cnabReserved2: z.string().optional(),
  fileCode: z.enum(['1', '2']),
  generationDate: z.date(),
  generationTime: z
    .string()
    .regex(/^\d{6}$/, 'Generation time must be HHMMSS')
    .optional(),
  sequentialNumber: z.number().int().nonnegative(),
  layoutVersion: z.string().min(1, 'Layout version is required'),
  currencyCode: z
    .string()
    .regex(/^\d{2}$/, 'Currency code must be 2 digits')
    .optional(),
  density: z.string().optional(),
  bankReserved: z.string().optional(),
  companyReserved: z.string().optional(),
  cnabReserved3: z.string().optional(),
});
