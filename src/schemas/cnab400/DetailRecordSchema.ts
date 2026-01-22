/**
 * CNAB400 Detail Record schema
 */

import { z } from 'zod';
import {
  AccountDigitSchema,
  AccountSchema,
  AgencySchema,
  BankCodeSchema,
  CompanyRegistrationTypeSchema,
  DocumentNumberSchema,
  PayerRegistrationTypeSchema,
  RecordSequenceSchema,
  RecordTypeDetailSchema,
} from './shared';

export const DetailRecordSchema = z.object({
  recordType: RecordTypeDetailSchema,
  companyRegistrationType: CompanyRegistrationTypeSchema,
  companyRegistrationNumber: DocumentNumberSchema,
  agency: AgencySchema,
  zeros: z.string().optional(),
  account: AccountSchema,
  accountDigit: AccountDigitSchema,
  companyControl: z.string().optional(),
  ourNumber: z.string().min(1, 'Our number is required'),
  discountAmount: z.number().nonnegative().optional(),
  iofPercentage: z.number().nonnegative().optional(),
  portfolioCode: z.string().optional(),
  registrationInstruction: z.string().optional(),
  documentNumber: z.string().optional(),
  dueDate: z.date(),
  amount: z.number().nonnegative(),
  bankCode: BankCodeSchema.optional(),
  collectingAgency: z.string().optional(),
  collectingAgencyDigit: z.string().optional(),
  speciesCode: z.string().optional(),
  acceptance: z.enum(['A', 'N']).optional(),
  issueDate: z.date().optional(),
  instructionCode1: z.string().optional(),
  instructionCode2: z.string().optional(),
  dailyInterestAmount: z.number().nonnegative().optional(),
  discountLimitDate: z.date().optional(),
  discountValue: z.number().nonnegative().optional(),
  iofAmount: z.number().nonnegative().optional(),
  rebateAmount: z.number().nonnegative().optional(),
  payerRegistrationType: PayerRegistrationTypeSchema.optional(),
  payerRegistrationNumber: DocumentNumberSchema.optional(),
  payerName: z.string().min(1, 'Payer name is required'),
  payerAddress: z.string().optional(),
  firstMessage: z.string().optional(),
  payerZipCode: z
    .string()
    .regex(/^\d{8}$/, 'Payer zip code must be 8 digits')
    .optional(),
  guarantor: z.string().optional(),
  guarantorCity: z.string().optional(),
  guarantorState: z.string().optional(),
  payerCity: z.string().optional(),
  payerState: z.string().optional(),
  finePercentage: z.number().nonnegative().optional(),
  fineDays: z.number().int().nonnegative().optional(),
  currencyCode: z
    .string()
    .regex(/^\d{2}$/, 'Currency code must be 2 digits')
    .optional(),
  sequentialNumber: RecordSequenceSchema,
});
