import {
  BankInfo,
  BANKS,
  getBankCodeWithCheckDigit,
  getBankInfo,
  getBankName,
  ITAU_REJECTION_CODE_DESCRIPTION_MAP,
  isValidBankCode,
} from '@constants/bancos';
import { BankCode } from '@enums/common';

describe('Bank Constants', () => {
  describe('BANKS', () => {
    it('should have all bank codes', () => {
      expect(BANKS[BankCode.BANCO_DO_BRASIL]).toBeDefined();
      expect(BANKS[BankCode.SANTANDER]).toBeDefined();
      expect(BANKS[BankCode.CAIXA]).toBeDefined();
      expect(BANKS[BankCode.BRADESCO]).toBeDefined();
      expect(BANKS[BankCode.C6_BANK]).toBeDefined();
      expect(BANKS[BankCode.ITAU]).toBeDefined();
    });

    it('should have correct Itaú information', () => {
      const itau = BANKS[BankCode.ITAU];
      expect(itau.code).toBe('341');
      expect(itau.checkDigit).toBe('7');
      expect(itau.name).toBe('Itaú Unibanco S.A.');
      expect(itau.shortName).toBe('Itaú');
      expect(itau.ispb).toBe('60701190');
    });

    it('should have correct Bradesco information', () => {
      const bradesco = BANKS[BankCode.BRADESCO];
      expect(bradesco.code).toBe('237');
      expect(bradesco.checkDigit).toBe('2');
      expect(bradesco.name).toBe('Banco Bradesco S.A.');
      expect(bradesco.shortName).toBe('Bradesco');
      expect(bradesco.ispb).toBe('60746948');
    });

    it('should have all required fields for each bank', () => {
      Object.values(BANKS).forEach((bank: BankInfo) => {
        expect(bank.code).toBeDefined();
        expect(bank.checkDigit).toBeDefined();
        expect(bank.name).toBeDefined();
        expect(bank.shortName).toBeDefined();
        expect(bank.ispb).toBeDefined();
        expect(typeof bank.code).toBe('string');
        expect(typeof bank.checkDigit).toBe('string');
        expect(typeof bank.name).toBe('string');
        expect(typeof bank.shortName).toBe('string');
        expect(typeof bank.ispb).toBe('string');
      });
    });
  });

  describe('getBankInfo', () => {
    it('should return bank info for valid bank code', () => {
      const bank = getBankInfo(BankCode.ITAU);
      expect(bank).toBeDefined();
      expect(bank?.code).toBe('341');
      expect(bank?.name).toBe('Itaú Unibanco S.A.');
    });

    it('should return bank info for string bank code', () => {
      const bank = getBankInfo('341');
      expect(bank).toBeDefined();
      expect(bank?.code).toBe('341');
    });

    it('should return undefined for invalid bank code', () => {
      const bank = getBankInfo('999');
      expect(bank).toBeUndefined();
    });

    it('should work with all bank codes', () => {
      Object.values(BankCode).forEach((code) => {
        const bank = getBankInfo(code);
        expect(bank).toBeDefined();
        expect(bank?.code).toBe(code);
      });
    });
  });

  describe('getBankName', () => {
    it('should return bank name for valid code', () => {
      const name = getBankName(BankCode.ITAU);
      expect(name).toBe('Itaú Unibanco S.A.');
    });

    it('should return bank name for string code', () => {
      const name = getBankName('341');
      expect(name).toBe('Itaú Unibanco S.A.');
    });

    it('should return undefined for invalid code', () => {
      const name = getBankName('999');
      expect(name).toBeUndefined();
    });
  });

  describe('isValidBankCode', () => {
    it('should return true for valid bank codes', () => {
      expect(isValidBankCode('001')).toBe(true);
      expect(isValidBankCode('033')).toBe(true);
      expect(isValidBankCode('104')).toBe(true);
      expect(isValidBankCode('237')).toBe(true);
      expect(isValidBankCode('336')).toBe(true);
      expect(isValidBankCode('341')).toBe(true);
    });

    it('should return false for invalid bank codes', () => {
      expect(isValidBankCode('999')).toBe(false);
      expect(isValidBankCode('000')).toBe(false);
      expect(isValidBankCode('abc')).toBe(false);
      expect(isValidBankCode('')).toBe(false);
    });

    it('should validate all BankCode enum values', () => {
      Object.values(BankCode).forEach((code) => {
        expect(isValidBankCode(code)).toBe(true);
      });
    });
  });

  describe('getBankCodeWithCheckDigit', () => {
    it('should return configured check digit for known bank codes', () => {
      expect(getBankCodeWithCheckDigit('341')).toBe('341-7');
      expect(getBankCodeWithCheckDigit('237')).toBe('237-2');
      expect(getBankCodeWithCheckDigit('104')).toBe('104-0');
    });

    it('should use fallback check digit for unknown code', () => {
      expect(getBankCodeWithCheckDigit('999')).toBe('999-0');
      expect(getBankCodeWithCheckDigit('999', '8')).toBe('999-8');
    });
  });

  describe('ITAU_REJECTION_CODE_DESCRIPTION_MAP', () => {
    it('should expose known Itaú rejection descriptions', () => {
      expect(ITAU_REJECTION_CODE_DESCRIPTION_MAP['00000001']).toBe(
        'Rejected due to invalid wallet code',
      );
      expect(ITAU_REJECTION_CODE_DESCRIPTION_MAP['00000010']).toBe(
        'Rejected due to invalid beneficiary document',
      );
    });
  });
});
