/**
 * Common validators based on shared schemas
 */

import { z } from 'zod';
import {
  AddressSchema,
  BankAccountSchema,
  BeneficiarySchema,
  PayerSchema,
  TaxIdSchema,
} from '../../schemas/common';
import type { ValidationResult } from './ValidationResult';

const validateWithSchema = (schema: z.ZodType<unknown>, data: unknown): ValidationResult => {
  const result = schema.safeParse(data);
  if (result.success) {
    return { isValid: true, errors: [] };
  }

  const errors = result.error.issues.map((issue) => {
    const path = issue.path.join('.') || 'root';
    return `Schema validation error at ${path}: ${issue.message}`;
  });

  return { isValid: false, errors };
};

export const validateAddress = (data: unknown): ValidationResult =>
  validateWithSchema(AddressSchema, data);

export const validateTaxId = (data: unknown): ValidationResult =>
  validateWithSchema(TaxIdSchema, data);

export const validateBankAccount = (data: unknown): ValidationResult =>
  validateWithSchema(BankAccountSchema, data);

export const validateBeneficiary = (data: unknown): ValidationResult =>
  validateWithSchema(BeneficiarySchema, data);

export const validatePayer = (data: unknown): ValidationResult =>
  validateWithSchema(PayerSchema, data);
