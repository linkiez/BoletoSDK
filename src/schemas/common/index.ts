/**
 * Common Zod validation schemas
 * @module schemas/common
 */

import { validateTaxId } from '@utils/validators';
import { z } from 'zod';

/**
 * Brazilian states (UF)
 */
const BRAZILIAN_STATES = [
  'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA',
  'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN',
  'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO',
] as const;

/**
 * Address schema
 */
export const AddressSchema = z.object({
  /** Street name */
  street: z.string().min(1, 'Street is required'),
  /** Street number */
  number: z.string().optional(),
  /** Complement (apartment, suite, etc.) */
  complement: z.string().optional(),
  /** District/neighborhood */
  district: z.string().min(1, 'District is required'),
  /** City name */
  city: z.string().min(1, 'City is required'),
  /** State (UF) - 2 letters */
  state: z.enum(BRAZILIAN_STATES, {
    message: 'Invalid Brazilian state code',
  }),
  /** Postal code (CEP) - 8 digits */
  postalCode: z.string().regex(/^\d{8}$/, 'Postal code must be 8 digits'),
});

/**
 * Tax ID schema with validation
 */
export const TaxIdSchema = z
  .object({
    /** Document type */
    type: z.enum(['CPF', 'CNPJ']),
    /** Document number (11 for CPF, 14 for CNPJ) */
    number: z.string(),
  })
  .refine(
    (data) => {
      if (data.type === 'CPF') {
        return /^\d{11}$/.test(data.number);
      }
      return /^\d{14}$/.test(data.number);
    },
    {
      message: 'Invalid tax ID length for type',
    },
  )
  .refine((data) => validateTaxId(data.number), {
    message: 'Invalid tax ID checksum',
  });

/**
 * Bank account schema
 */
export const BankAccountSchema = z.object({
  /** Bank code (3 digits) */
  bankCode: z.string().regex(/^\d{3}$/, 'Bank code must be 3 digits'),
  /** Branch number */
  branch: z.string().min(1, 'Branch is required'),
  /** Branch check digit */
  branchDigit: z.string().optional(),
  /** Account number */
  account: z.string().min(1, 'Account is required'),
  /** Account check digit */
  accountDigit: z.string().optional(),
});

/**
 * Beneficiary schema (creditor/payment receiver)
 */
export const BeneficiarySchema = z.object({
  /** Beneficiary name */
  name: z.string().min(1, 'Name is required'),
  /** Tax ID */
  taxId: TaxIdSchema,
  /** Bank account */
  bankAccount: BankAccountSchema.optional(),
  /** Address */
  address: AddressSchema.optional(),
});

/**
 * Payer schema (debtor/payment maker)
 */
export const PayerSchema = z.object({
  /** Payer name */
  name: z.string().min(1, 'Name is required'),
  /** Tax ID */
  taxId: TaxIdSchema,
  /** Address */
  address: AddressSchema.optional(),
  /** Email address */
  email: z.string().email().optional(),
  /** Phone number */
  phone: z.string().optional(),
});

/**
 * Discount schema
 */
export const DiscountSchema = z.object({
  /** Discount type */
  type: z.enum(['fixed', 'percentage']),
  /** Discount value */
  value: z.number().positive('Value must be positive'),
  /** Due date for discount */
  dueDate: z.date(),
});

/**
 * Fee schema
 */
export const FeeSchema = z.object({
  /** Fee type */
  type: z.enum(['fixed', 'percentage']),
  /** Fee value */
  value: z.number().positive('Value must be positive'),
  /** Start date for fee application */
  startDate: z.date().optional(),
});

/**
 * Fine schema
 */
export const FineSchema = z
  .object({
    /** Fine type */
    type: z.enum(['fixed', 'percentage']),
    /** Fine value */
    value: z.number().positive('Value must be positive'),
    /** Start date for fine application */
    startDate: z.date(),
  })
  .refine(
    (data) => {
      if (data.type === 'percentage') {
        return data.value <= 100;
      }
      return true;
    },
    {
      message: 'Percentage fine cannot exceed 100%',
    },
  );

/**
 * Interest schema
 */
export const InterestSchema = z.object({
  /** Interest calculation type */
  type: z.enum(['monthly', 'daily']),
  /** Interest rate */
  rate: z.number().positive('Rate must be positive'),
  /** Start date for interest calculation */
  startDate: z.date().optional(),
});

// Export inferred types
export type Address = z.infer<typeof AddressSchema>;
export type TaxId = z.infer<typeof TaxIdSchema>;
export type BankAccount = z.infer<typeof BankAccountSchema>;
export type Beneficiary = z.infer<typeof BeneficiarySchema>;
export type Payer = z.infer<typeof PayerSchema>;
export type Discount = z.infer<typeof DiscountSchema>;
export type Fee = z.infer<typeof FeeSchema>;
export type Fine = z.infer<typeof FineSchema>;
export type Interest = z.infer<typeof InterestSchema>;
