/**
 * CNAB400 Guarantor Record schema
 */

import { z } from 'zod';
import {
  AccountDigitSchema,
  AccountSchema,
  AgencySchema,
  DocumentNumberSchema,
  RecordSequenceSchema,
  RecordTypeGuarantorSchema,
} from './shared';

export const GuarantorRecordSchema = z.object({
  recordType: RecordTypeGuarantorSchema,
  companyRegistrationType: z.enum(['01', '02']),
  companyRegistrationNumber: DocumentNumberSchema,
  agency: AgencySchema.optional(),
  account: AccountSchema.optional(),
  accountDigit: AccountDigitSchema.optional(),
  documentNumber: z.string().min(1, 'Document number is required'),
  guarantorRegistrationType: z.enum(['01', '02']).optional(),
  guarantorRegistrationNumber: DocumentNumberSchema.optional(),
  guarantorName: z.string().min(1, 'Guarantor name is required'),
  guarantorAddress: z.string().optional(),
  guarantorZipCode: z
    .string()
    .regex(/^\d{8}$/, 'Guarantor zip code must be 8 digits')
    .optional(),
  guarantorCity: z.string().optional(),
  guarantorState: z.string().optional(),
  sequentialNumber: RecordSequenceSchema,
});
