/**
 * CNAB400 Type Tests
 *
 * Validates type definitions for CNAB400 file format.
 * Uses TypeScript compiler to ensure type correctness.
 */

import type {
  Cnab400File,
  Cnab400ReturnFile,
  DetailRecord,
  FileHeader,
  FileTrailer,
  GuarantorRecord,
  MessageBackRecord,
  MessageFrontRecord,
  ReturnDetailRecord,
} from '../../../src/types/cnab400';

describe('CNAB400 Types', () => {
  describe('FileHeader', () => {
    it('should accept valid header data', () => {
      const header: FileHeader = {
        recordType: '0',
        operationType: '1',
        operationLiteral: 'REMESSA',
        serviceCode: '01',
        serviceLiteral: 'COBRANCA',
        agency: '0001',
        zeros: '00',
        account: '12345',
        accountDigit: '6',
        companyName: 'ACME CORPORATION LTDA',
        bankCode: '341',
        bankName: 'BANCO ITAU SA',
        generationDate: new Date('2026-01-20'),
        sequenceNumber: 1,
      };

      expect(header.recordType).toBe('0');
      expect(header.operationType).toBe('1');
      expect(header.bankCode).toBe('341');
    });

    it('should accept return operation type', () => {
      const header: FileHeader = {
        recordType: '0',
        operationType: '2',
        operationLiteral: 'RETORNO',
        serviceCode: '01',
        serviceLiteral: 'COBRANCA',
        agency: '0001',
        zeros: '00',
        account: '12345',
        accountDigit: '6',
        companyName: 'ACME CORP',
        bankCode: '341',
        bankName: 'BANCO ITAU SA',
        generationDate: new Date(),
        sequenceNumber: 1,
      };

      expect(header.operationType).toBe('2');
    });

    it('should accept optional fields', () => {
      const header: FileHeader = {
        recordType: '0',
        operationType: '1',
        operationLiteral: 'REMESSA',
        serviceCode: '01',
        serviceLiteral: 'COBRANCA',
        agency: '0001',
        zeros: '00',
        account: '12345',
        accountDigit: '6',
        companyName: 'ACME CORP',
        bankCode: '341',
        bankName: 'BANCO ITAU SA',
        generationDate: new Date(),
        sequenceNumber: 1,
        layoutVersion: '400',
        creationDate: new Date('2026-01-20'),
      };

      expect(header.layoutVersion).toBe('400');
      expect(header.creationDate).toBeInstanceOf(Date);
    });
  });

  describe('DetailRecord', () => {
    it('should accept valid detail data', () => {
      const detail: DetailRecord = {
        recordType: '1',
        companyRegistrationType: '02',
        companyRegistrationNumber: '12345678000195',
        agency: '0001',
        account: '12345',
        accountDigit: '6',
        ourNumber: '12345678',
        amount: 150.0,
        dueDate: new Date('2026-03-01'),
        payerName: 'JOHN DOE',
        sequentialNumber: 2,
      };

      expect(detail.recordType).toBe('1');
      expect(detail.amount).toBe(150.0);
    });

    it('should accept CPF registration type', () => {
      const detail: DetailRecord = {
        recordType: '1',
        companyRegistrationType: '01',
        companyRegistrationNumber: '12345678901',
        agency: '0001',
        account: '12345',
        accountDigit: '6',
        ourNumber: '12345678',
        amount: 100.0,
        dueDate: new Date(),
        payerName: 'JOHN DOE',
        sequentialNumber: 2,
      };

      expect(detail.companyRegistrationType).toBe('01');
    });

    it('should accept optional fields', () => {
      const detail: DetailRecord = {
        recordType: '1',
        companyRegistrationType: '02',
        companyRegistrationNumber: '12345678000195',
        agency: '0001',
        account: '12345',
        accountDigit: '6',
        ourNumber: '12345678',
        amount: 150.0,
        dueDate: new Date('2026-03-01'),
        payerName: 'JOHN DOE',
        payerAddress: 'RUA EXEMPLO 100',
        payerCity: 'SAO PAULO',
        payerState: 'SP',
        payerZipCode: '01310100',
        documentNumber: 'DOC123',
        speciesCode: '01',
        acceptance: 'A',
        instructionCode1: '01',
        sequentialNumber: 2,
      };

      expect(detail.payerAddress).toBe('RUA EXEMPLO 100');
      expect(detail.acceptance).toBe('A');
    });
  });

  describe('GuarantorRecord', () => {
    it('should accept valid guarantor data', () => {
      const guarantor: GuarantorRecord = {
        recordType: '5',
        companyRegistrationType: '02',
        companyRegistrationNumber: '12345678000195',
        documentNumber: 'DOC123',
        guarantorName: 'GUARANTOR COMPANY LTDA',
        sequentialNumber: 3,
      };

      expect(guarantor.recordType).toBe('5');
      expect(guarantor.guarantorName).toBe('GUARANTOR COMPANY LTDA');
    });

    it('should accept optional address fields', () => {
      const guarantor: GuarantorRecord = {
        recordType: '5',
        companyRegistrationType: '02',
        companyRegistrationNumber: '12345678000195',
        documentNumber: 'DOC123',
        guarantorName: 'GUARANTOR COMPANY',
        guarantorAddress: 'AV EXAMPLE 500',
        guarantorCity: 'RIO DE JANEIRO',
        guarantorState: 'RJ',
        guarantorZipCode: '20000000',
        sequentialNumber: 3,
      };

      expect(guarantor.guarantorCity).toBe('RIO DE JANEIRO');
      expect(guarantor.guarantorState).toBe('RJ');
    });
  });

  describe('MessageFrontRecord', () => {
    it('should accept front message data', () => {
      const message: MessageFrontRecord = {
        recordType: '7',
        message1: 'PAYMENT FOR SERVICES',
        message2: 'INVOICE 12345',
        sequentialNumber: 4,
      };

      expect(message.recordType).toBe('7');
      expect(message.message1).toBe('PAYMENT FOR SERVICES');
    });

    it('should accept all four message lines', () => {
      const message: MessageFrontRecord = {
        recordType: '7',
        message1: 'LINE 1',
        message2: 'LINE 2',
        message3: 'LINE 3',
        message4: 'LINE 4',
        sequentialNumber: 4,
      };

      expect(message.message4).toBe('LINE 4');
    });
  });

  describe('MessageBackRecord', () => {
    it('should accept back message data', () => {
      const message: MessageBackRecord = {
        recordType: '8',
        message1: 'ADDITIONAL INFO',
        sequentialNumber: 5,
      };

      expect(message.recordType).toBe('8');
    });
  });

  describe('FileTrailer', () => {
    it('should accept valid trailer data', () => {
      const trailer: FileTrailer = {
        recordType: '9',
        totalRecords: 10,
        totalAmount: 1500.0,
        sequentialNumber: 11,
      };

      expect(trailer.recordType).toBe('9');
      expect(trailer.totalRecords).toBe(10);
      expect(trailer.totalAmount).toBe(1500.0);
    });

    it('should work without optional amount', () => {
      const trailer: FileTrailer = {
        recordType: '9',
        totalRecords: 5,
        sequentialNumber: 6,
      };

      expect(trailer.totalAmount).toBeUndefined();
    });
  });

  describe('Cnab400File', () => {
    it('should accept complete file structure', () => {
      const file: Cnab400File = {
        header: {
          recordType: '0',
          operationType: '1',
          operationLiteral: 'REMESSA',
          serviceCode: '01',
          serviceLiteral: 'COBRANCA',
          agency: '0001',
          zeros: '00',
          account: '12345',
          accountDigit: '6',
          companyName: 'ACME CORP',
          bankCode: '341',
          bankName: 'BANCO ITAU SA',
          generationDate: new Date(),
          sequenceNumber: 1,
        },
        details: [
          {
            recordType: '1',
            companyRegistrationType: '02',
            companyRegistrationNumber: '12345678000195',
            agency: '0001',
            account: '12345',
            accountDigit: '6',
            ourNumber: '12345678',
            amount: 150.0,
            dueDate: new Date('2026-03-01'),
            payerName: 'JOHN DOE',
            sequentialNumber: 2,
          },
        ],
        messageFrontRecords: [
          {
            recordType: '7',
            message1: 'PAYMENT INFO',
            sequentialNumber: 3,
          },
        ],
        trailer: {
          recordType: '9',
          totalRecords: 4,
          totalAmount: 150.0,
          sequentialNumber: 4,
        },
      };

      expect(file.header.recordType).toBe('0');
      expect(file.details).toHaveLength(1);
      expect(file.trailer.recordType).toBe('9');
    });

    it('should accept file with all optional records', () => {
      const file: Cnab400File = {
        header: {
          recordType: '0',
          operationType: '1',
          operationLiteral: 'REMESSA',
          serviceCode: '01',
          serviceLiteral: 'COBRANCA',
          agency: '0001',
          zeros: '00',
          account: '12345',
          accountDigit: '6',
          companyName: 'ACME CORP',
          bankCode: '341',
          bankName: 'BANCO ITAU SA',
          generationDate: new Date(),
          sequenceNumber: 1,
        },
        details: [
          {
            recordType: '1',
            companyRegistrationType: '02',
            companyRegistrationNumber: '12345678000195',
            agency: '0001',
            account: '12345',
            accountDigit: '6',
            ourNumber: '12345678',
            amount: 150.0,
            dueDate: new Date(),
            payerName: 'JOHN DOE',
            sequentialNumber: 2,
          },
        ],
        guarantorRecords: [
          {
            recordType: '5',
            companyRegistrationType: '02',
            companyRegistrationNumber: '12345678000195',
            documentNumber: 'DOC123',
            guarantorName: 'GUARANTOR',
            sequentialNumber: 3,
          },
        ],
        messageFrontRecords: [
          {
            recordType: '7',
            message1: 'FRONT',
            sequentialNumber: 4,
          },
        ],
        messageBackRecords: [
          {
            recordType: '8',
            message1: 'BACK',
            sequentialNumber: 5,
          },
        ],
        trailer: {
          recordType: '9',
          totalRecords: 6,
          sequentialNumber: 6,
        },
      };

      expect(file.guarantorRecords).toHaveLength(1);
      expect(file.messageBackRecords).toHaveLength(1);
    });
  });

  describe('ReturnDetailRecord', () => {
    it('should extend DetailRecord with return fields', () => {
      const returnDetail: ReturnDetailRecord = {
        recordType: '1',
        companyRegistrationType: '02',
        companyRegistrationNumber: '12345678000195',
        agency: '0001',
        account: '12345',
        accountDigit: '6',
        ourNumber: '12345678',
        amount: 150.0,
        dueDate: new Date('2026-03-01'),
        payerName: 'JOHN DOE',
        sequentialNumber: 2,
        occurrenceCode: '06',
        occurrenceDate: new Date('2026-02-01'),
        bankDocumentNumber: 'BANK123',
        creditDate: new Date('2026-02-03'),
        paymentAmount: 150.0,
        expensesAmount: 2.5,
        rejectionReasons: ['00'],
      };

      expect(returnDetail.occurrenceCode).toBe('06');
      expect(returnDetail.paymentAmount).toBe(150.0);
      expect(returnDetail.rejectionReasons).toEqual(['00']);
    });
  });

  describe('Cnab400ReturnFile', () => {
    it('should accept return file structure', () => {
      const returnFile: Cnab400ReturnFile = {
        header: {
          recordType: '0',
          operationType: '2',
          operationLiteral: 'RETORNO',
          serviceCode: '01',
          serviceLiteral: 'COBRANCA',
          agency: '0001',
          zeros: '00',
          account: '12345',
          accountDigit: '6',
          companyName: 'ACME CORP',
          bankCode: '341',
          bankName: 'BANCO ITAU SA',
          generationDate: new Date(),
          sequenceNumber: 1,
        },
        details: [
          {
            recordType: '1',
            companyRegistrationType: '02',
            companyRegistrationNumber: '12345678000195',
            agency: '0001',
            account: '12345',
            accountDigit: '6',
            ourNumber: '12345678',
            amount: 150.0,
            dueDate: new Date(),
            payerName: 'JOHN DOE',
            sequentialNumber: 2,
            occurrenceCode: '06',
            paymentAmount: 150.0,
          },
        ],
        trailer: {
          recordType: '9',
          totalRecords: 3,
          sequentialNumber: 3,
        },
      };

      expect(returnFile.header.operationType).toBe('2');
      expect(returnFile.details[0].occurrenceCode).toBe('06');
    });
  });
});
