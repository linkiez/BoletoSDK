/**
 * CNAB400 File Header schema
 */

import { z } from 'zod';
import {
  AccountDigitSchema,
  AccountSchema,
  AgencySchema,
  BankCodeSchema,
  RecordSequenceSchema,
  RecordTypeHeaderSchema,
} from './shared';

export const FileHeaderSchema = z.object({
  recordType: RecordTypeHeaderSchema,
  operationType: z.enum(['1', '2']),
  operationLiteral: z.string().min(1, 'Operation literal is required'),
  serviceCode: z.string().regex(/^\d{2}$/, 'Service code must be 2 digits'),
  serviceLiteral: z.string().min(1, 'Service literal is required'),
  agency: AgencySchema,
  zeros: z.string().optional(),
  account: AccountSchema,
  accountDigit: AccountDigitSchema,
  companyName: z.string().min(1, 'Company name is required'),
  bankCode: BankCodeSchema,
  bankName: z.string().min(1, 'Bank name is required'),
  generationDate: z.date(),
  densityCode: z.string().optional(),
  densityUnit: z.string().optional(),
  sequenceNumber: RecordSequenceSchema,
  creationDate: z.date().optional(),
  layoutVersion: z.string().optional(),
  blanks: z.string().optional(),
  sequential: z.string().optional(),
});
