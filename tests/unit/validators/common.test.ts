/**
 * Common Validators - Unit Tests
 */

import {
  validateAddress,
  validateBankAccount,
  validateBeneficiary,
  validatePayer,
  validateTaxId,
} from '../../../src/validators/common';

describe('Common Validators', () => {
  it('should validate address', () => {
    const result = validateAddress({
      street: 'Rua das Flores',
      district: 'Centro',
      city: 'Sao Paulo',
      state: 'SP',
      postalCode: '01234567',
    });

    expect(result.isValid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it('should reject invalid address', () => {
    const result = validateAddress({
      street: 'Rua A',
      district: 'Centro',
      city: 'Sao Paulo',
      state: 'XX',
      postalCode: '123',
    });

    expect(result.isValid).toBe(false);
    expect(result.errors.length).toBeGreaterThan(0);
  });

  it('should validate tax ID', () => {
    const result = validateTaxId({
      type: 'CPF',
      number: '11144477735',
    });

    expect(result.isValid).toBe(true);
  });

  it('should reject invalid tax ID', () => {
    const result = validateTaxId({
      type: 'CPF',
      number: '11144477700',
    });

    expect(result.isValid).toBe(false);
    expect(result.errors.length).toBeGreaterThan(0);
  });

  it('should validate bank account', () => {
    const result = validateBankAccount({
      bankCode: '341',
      branch: '1234',
      account: '12345',
      accountDigit: '6',
    });

    expect(result.isValid).toBe(true);
  });

  it('should validate beneficiary', () => {
    const result = validateBeneficiary({
      name: 'ACME Corp',
      taxId: {
        type: 'CNPJ',
        number: '12345678000195',
      },
      bankAccount: {
        bankCode: '341',
        branch: '1234',
        account: '12345',
        accountDigit: '6',
      },
    });

    expect(result.isValid).toBe(true);
  });

  it('should validate payer', () => {
    const result = validatePayer({
      name: 'John Doe',
      taxId: {
        type: 'CPF',
        number: '11144477735',
      },
      address: {
        street: 'Rua das Flores',
        district: 'Centro',
        city: 'Sao Paulo',
        state: 'SP',
        postalCode: '01234567',
      },
    });

    expect(result.isValid).toBe(true);
  });
});
