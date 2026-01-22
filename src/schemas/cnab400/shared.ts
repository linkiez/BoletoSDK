/**
 * Shared CNAB400 schema helpers
 */

import { z } from 'zod';

export const BankCodeSchema = z.string().regex(/^\d{3}$/, 'Bank code must be 3 digits');

export const AgencySchema = z.string().regex(/^\d{4}$/, 'Agency must be 4 digits');

export const AccountSchema = z.string().regex(/^\d{5}$/, 'Account must be 5 digits');

export const AccountDigitSchema = z.string().regex(/^\d$/, 'Account digit must be 1 digit');

export const RecordSequenceSchema = z
  .number()
  .int('Sequential number must be an integer')
  .nonnegative('Sequential number must be non-negative');

export const CompanyRegistrationTypeSchema = z.enum(['01', '02', '03']);

export const PayerRegistrationTypeSchema = z.enum(['01', '02']);

export const RecordTypeHeaderSchema = z.literal('0');
export const RecordTypeDetailSchema = z.literal('1');
export const RecordTypePenaltySchema = z.literal('2');
export const RecordTypeGuarantorSchema = z.literal('5');
export const RecordTypeMessageFrontSchema = z.literal('7');
export const RecordTypeMessageBackSchema = z.literal('8');
export const RecordTypeTrailerSchema = z.literal('9');

export const DocumentNumberSchema = z
  .string()
  .regex(/^\d{11,14}$/, 'Document number must be 11 or 14 digits');
