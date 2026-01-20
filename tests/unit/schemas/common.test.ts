import {
  AddressSchema,
  TaxIdSchema,
  BankAccountSchema,
  BeneficiarySchema,
  PayerSchema,
  DiscountSchema,
  FeeSchema,
  FineSchema,
  InterestSchema,
} from '@schemas/common';

describe('Common Schemas', () => {
  describe('AddressSchema', () => {
    it('should validate complete address', () => {
      const address = {
        street: 'Rua das Flores',
        number: '123',
        complement: 'Apto 45',
        district: 'Centro',
        city: 'São Paulo',
        state: 'SP',
        postalCode: '01234567',
      };

      expect(AddressSchema.safeParse(address).success).toBe(true);
    });

    it('should validate address without optional fields', () => {
      const address = {
        street: 'Av Paulista',
        district: 'Bela Vista',
        city: 'São Paulo',
        state: 'SP',
        postalCode: '01310000',
      };

      expect(AddressSchema.safeParse(address).success).toBe(true);
    });

    it('should reject invalid postal code', () => {
      const address = {
        street: 'Rua A',
        district: 'Centro',
        city: 'São Paulo',
        state: 'SP',
        postalCode: '123', // Invalid length
      };

      const result = AddressSchema.safeParse(address);
      expect(result.success).toBe(false);
    });

    it('should reject invalid state', () => {
      const address = {
        street: 'Rua A',
        district: 'Centro',
        city: 'São Paulo',
        state: 'XX', // Invalid state
        postalCode: '01234567',
      };

      const result = AddressSchema.safeParse(address);
      expect(result.success).toBe(false);
    });
  });

  describe('TaxIdSchema', () => {
    it('should validate CPF', () => {
      const taxId = {
        type: 'CPF' as const,
        number: '11144477735',
      };

      expect(TaxIdSchema.safeParse(taxId).success).toBe(true);
    });

    it('should validate CNPJ', () => {
      const taxId = {
        type: 'CNPJ' as const,
        number: '11222333000181',
      };

      expect(TaxIdSchema.safeParse(taxId).success).toBe(true);
    });

    it('should reject invalid CPF length', () => {
      const taxId = {
        type: 'CPF' as const,
        number: '123456789', // Too short
      };

      const result = TaxIdSchema.safeParse(taxId);
      expect(result.success).toBe(false);
    });

    it('should reject invalid CNPJ checksum', () => {
      const taxId = {
        type: 'CNPJ' as const,
        number: '11222333000182', // Invalid checksum
      };

      const result = TaxIdSchema.safeParse(taxId);
      expect(result.success).toBe(false);
    });
  });

  describe('BankAccountSchema', () => {
    it('should validate complete bank account', () => {
      const account = {
        bankCode: '341',
        branch: '1234',
        branchDigit: '5',
        account: '12345',
        accountDigit: '6',
      };

      expect(BankAccountSchema.safeParse(account).success).toBe(true);
    });

    it('should validate without optional digits', () => {
      const account = {
        bankCode: '237',
        branch: '5678',
        account: '98765',
      };

      expect(BankAccountSchema.safeParse(account).success).toBe(true);
    });

    it('should reject invalid bank code', () => {
      const account = {
        bankCode: '12', // Too short
        branch: '1234',
        account: '12345',
      };

      const result = BankAccountSchema.safeParse(account);
      expect(result.success).toBe(false);
    });
  });

  describe('BeneficiarySchema', () => {
    it('should validate complete beneficiary', () => {
      const beneficiary = {
        name: 'ACME Corp',
        taxId: {
          type: 'CNPJ' as const,
          number: '11222333000181',
        },
        bankAccount: {
          bankCode: '341',
          branch: '1234',
          account: '12345',
        },
        address: {
          street: 'Av Paulista',
          district: 'Bela Vista',
          city: 'São Paulo',
          state: 'SP',
          postalCode: '01310000',
        },
      };

      expect(BeneficiarySchema.safeParse(beneficiary).success).toBe(true);
    });

    it('should reject empty name', () => {
      const beneficiary = {
        name: '',
        taxId: { type: 'CPF' as const, number: '11144477735' },
      };

      const result = BeneficiarySchema.safeParse(beneficiary);
      expect(result.success).toBe(false);
    });
  });

  describe('PayerSchema', () => {
    it('should validate complete payer', () => {
      const payer = {
        name: 'John Doe',
        taxId: {
          type: 'CPF' as const,
          number: '11144477735',
        },
        address: {
          street: 'Rua A',
          district: 'Centro',
          city: 'Rio',
          state: 'RJ',
          postalCode: '20000000',
        },
        email: 'john@example.com',
        phone: '11987654321',
      };

      expect(PayerSchema.safeParse(payer).success).toBe(true);
    });

    it('should validate without optional fields', () => {
      const payer = {
        name: 'Jane Doe',
        taxId: {
          type: 'CPF' as const,
          number: '11144477735',
        },
      };

      expect(PayerSchema.safeParse(payer).success).toBe(true);
    });

    it('should reject invalid email', () => {
      const payer = {
        name: 'John',
        taxId: { type: 'CPF' as const, number: '11144477735' },
        email: 'invalid-email',
      };

      const result = PayerSchema.safeParse(payer);
      expect(result.success).toBe(false);
    });
  });

  describe('DiscountSchema', () => {
    it('should validate fixed discount', () => {
      const discount = {
        type: 'fixed' as const,
        value: 10.5,
        dueDate: new Date('2026-12-31'),
      };

      expect(DiscountSchema.safeParse(discount).success).toBe(true);
    });

    it('should validate percentage discount', () => {
      const discount = {
        type: 'percentage' as const,
        value: 5.5,
        dueDate: new Date('2026-12-31'),
      };

      expect(DiscountSchema.safeParse(discount).success).toBe(true);
    });

    it('should reject negative value', () => {
      const discount = {
        type: 'fixed' as const,
        value: -10,
        dueDate: new Date('2026-12-31'),
      };

      const result = DiscountSchema.safeParse(discount);
      expect(result.success).toBe(false);
    });
  });

  describe('FeeSchema', () => {
    it('should validate fee with start date', () => {
      const fee = {
        type: 'fixed' as const,
        value: 2.5,
        startDate: new Date('2026-01-01'),
      };

      expect(FeeSchema.safeParse(fee).success).toBe(true);
    });

    it('should validate fee without start date', () => {
      const fee = {
        type: 'percentage' as const,
        value: 1.5,
      };

      expect(FeeSchema.safeParse(fee).success).toBe(true);
    });
  });

  describe('FineSchema', () => {
    it('should validate fixed fine', () => {
      const fine = {
        type: 'fixed' as const,
        value: 5.0,
        startDate: new Date('2026-02-01'),
      };

      expect(FineSchema.safeParse(fine).success).toBe(true);
    });

    it('should validate percentage fine', () => {
      const fine = {
        type: 'percentage' as const,
        value: 2.0,
        startDate: new Date('2026-02-01'),
      };

      expect(FineSchema.safeParse(fine).success).toBe(true);
    });

    it('should reject percentage over 100', () => {
      const fine = {
        type: 'percentage' as const,
        value: 150,
        startDate: new Date('2026-02-01'),
      };

      const result = FineSchema.safeParse(fine);
      expect(result.success).toBe(false);
    });
  });

  describe('InterestSchema', () => {
    it('should validate monthly interest', () => {
      const interest = {
        type: 'monthly' as const,
        rate: 1.5,
        startDate: new Date('2026-02-01'),
      };

      expect(InterestSchema.safeParse(interest).success).toBe(true);
    });

    it('should validate daily interest', () => {
      const interest = {
        type: 'daily' as const,
        rate: 0.033,
        startDate: new Date('2026-02-01'),
      };

      expect(InterestSchema.safeParse(interest).success).toBe(true);
    });

    it('should validate without start date', () => {
      const interest = {
        type: 'monthly' as const,
        rate: 1.0,
      };

      expect(InterestSchema.safeParse(interest).success).toBe(true);
    });

    it('should reject negative rate', () => {
      const interest = {
        type: 'monthly' as const,
        rate: -1,
      };

      const result = InterestSchema.safeParse(interest);
      expect(result.success).toBe(false);
    });
  });
});
