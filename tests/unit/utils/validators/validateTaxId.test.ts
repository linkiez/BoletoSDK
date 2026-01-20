import { validateTaxId } from '@utils/validators';

describe('validateTaxId', () => {
  describe('CPF validation', () => {
    it('should validate correct CPF', () => {
      expect(validateTaxId('11144477735')).toBe(true);
    });

    it('should validate formatted CPF', () => {
      expect(validateTaxId('111.444.777-35')).toBe(true);
    });

    it('should reject invalid CPF checksum', () => {
      expect(validateTaxId('11144477736')).toBe(false);
    });

    it('should reject CPF with all same digits', () => {
      expect(validateTaxId('11111111111')).toBe(false);
      expect(validateTaxId('00000000000')).toBe(false);
    });
  });

  describe('CNPJ validation', () => {
    it('should validate correct CNPJ', () => {
      expect(validateTaxId('11222333000181')).toBe(true);
    });

    it('should validate formatted CNPJ', () => {
      expect(validateTaxId('11.222.333/0001-81')).toBe(true);
    });

    it('should reject invalid CNPJ checksum', () => {
      expect(validateTaxId('11222333000182')).toBe(false);
    });

    it('should reject CNPJ with all same digits', () => {
      expect(validateTaxId('11111111111111')).toBe(false);
    });
  });

  describe('edge cases', () => {
    it('should reject empty string', () => {
      expect(validateTaxId('')).toBe(false);
    });

    it('should reject invalid length', () => {
      expect(validateTaxId('123')).toBe(false);
      expect(validateTaxId('123456789012345')).toBe(false);
    });

    it('should reject non-numeric characters', () => {
      expect(validateTaxId('1234567890a')).toBe(false);
    });
  });
});
