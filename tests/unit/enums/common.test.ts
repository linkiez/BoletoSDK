import {
  BankCode,
  DocumentType,
  SpeciesCode,
  AcceptanceType,
  CurrencyCode,
  CnabType,
  MovementType,
  InstructionCode,
} from '@enums/common';

describe('Common Enums', () => {
  describe('BankCode', () => {
    it('should have correct bank codes', () => {
      expect(BankCode.BANCO_DO_BRASIL).toBe('001');
      expect(BankCode.SANTANDER).toBe('033');
      expect(BankCode.CAIXA).toBe('104');
      expect(BankCode.BRADESCO).toBe('237');
      expect(BankCode.C6_BANK).toBe('336');
      expect(BankCode.ITAU).toBe('341');
    });

    it('should have all major banks', () => {
      const bankCodes = Object.values(BankCode);
      expect(bankCodes).toHaveLength(6);
      expect(bankCodes).toContain('001'); // BB
      expect(bankCodes).toContain('341'); // Itaú
    });
  });

  describe('DocumentType', () => {
    it('should have CPF and CNPJ', () => {
      expect(DocumentType.CPF).toBe('CPF');
      expect(DocumentType.CNPJ).toBe('CNPJ');
    });

    it('should have exactly 2 document types', () => {
      const types = Object.values(DocumentType);
      expect(types).toHaveLength(2);
    });
  });

  describe('SpeciesCode', () => {
    it('should have common species codes', () => {
      expect(SpeciesCode.DM).toBe('DM');
      expect(SpeciesCode.DS).toBe('DS');
      expect(SpeciesCode.NP).toBe('NP');
      expect(SpeciesCode.RC).toBe('RC');
    });

    it('should have all species codes', () => {
      const codes = Object.values(SpeciesCode);
      expect(codes.length).toBeGreaterThan(5);
      expect(codes).toContain('DM');
      expect(codes).toContain('DIV');
    });
  });

  describe('AcceptanceType', () => {
    it('should have accepted and not accepted', () => {
      expect(AcceptanceType.ACCEPTED).toBe('A');
      expect(AcceptanceType.NOT_ACCEPTED).toBe('N');
    });
  });

  describe('CurrencyCode', () => {
    it('should have BRL and USD', () => {
      expect(CurrencyCode.BRL).toBe('BRL');
      expect(CurrencyCode.USD).toBe('USD');
    });
  });

  describe('CnabType', () => {
    it('should have CNAB 240 and 400', () => {
      expect(CnabType.CNAB240).toBe('240');
      expect(CnabType.CNAB400).toBe('400');
    });
  });

  describe('MovementType', () => {
    it('should have remittance and return', () => {
      expect(MovementType.REMESSA).toBe('REMESSA');
      expect(MovementType.RETORNO).toBe('RETORNO');
    });
  });

  describe('InstructionCode', () => {
    it('should have common instruction codes', () => {
      expect(InstructionCode.NONE).toBe('00');
      expect(InstructionCode.PROTEST).toBe('01');
      expect(InstructionCode.DO_NOT_PROTEST).toBe('02');
    });

    it('should have interest and fine codes', () => {
      expect(InstructionCode.NO_INTEREST).toBe('04');
      expect(InstructionCode.CHARGE_INTEREST).toBe('05');
      expect(InstructionCode.NO_FINE).toBe('06');
      expect(InstructionCode.CHARGE_FINE).toBe('07');
    });
  });
});
