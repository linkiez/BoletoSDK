import {
  Batch,
  BatchHeader,
  BatchTrailer,
  Cnab240File,
  DetailRecord,
  FileHeader,
  FileTrailer,
  SegmentP,
  SegmentQ,
  SegmentR,
} from '../../../src/types';

describe('CNAB240 Types', () => {
  describe('FileHeader', () => {
    it('should define valid file header structure', () => {
      const fileHeader: FileHeader = {
        bankCode: '341',
        batchNumber: '0000',
        recordType: '0',
        companyRegistrationType: '1',
        companyRegistrationNumber: '12345678000195',
        agency: '4897',
        account: '17450',
        accountDigit: '6',
        companyName: 'JCM INDUSTRIA E COMERCIO LTDA',
        bankName: 'BANCO ITAU SA',
        fileCode: '1',
        generationDate: new Date('2026-01-21'),
        sequentialNumber: 1,
        layoutVersion: '103',
        currencyCode: '09',
      };

      expect(fileHeader.bankCode).toBe('341');
      expect(fileHeader.recordType).toBe('0');
      expect(fileHeader.fileCode).toBe('1');
    });
  });

  describe('FileTrailer', () => {
    it('should define valid file trailer structure', () => {
      const fileTrailer: FileTrailer = {
        bankCode: '341',
        batchNumber: '9999',
        recordType: '9',
        totalBatches: 1,
        totalRecords: 10,
      };

      expect(fileTrailer.recordType).toBe('9');
      expect(fileTrailer.batchNumber).toBe('9999');
    });
  });

  describe('BatchHeader', () => {
    it('should define valid batch header structure', () => {
      const batchHeader: BatchHeader = {
        bankCode: '341',
        batchNumber: 1,
        recordType: '1',
        operationType: 'C',
        serviceType: '01',
        companyRegistrationType: '1',
        companyRegistrationNumber: '12345678000195',
        agency: '4897',
        account: '17450',
        accountDigit: '6',
        companyName: 'JCM INDUSTRIA E COMERCIO LTDA',
      };

      expect(batchHeader.recordType).toBe('1');
      expect(batchHeader.operationType).toBe('C');
      expect(batchHeader.serviceType).toBe('01');
    });
  });

  describe('BatchTrailer', () => {
    it('should define valid batch trailer structure', () => {
      const batchTrailer: BatchTrailer = {
        bankCode: '341',
        batchNumber: 1,
        recordType: '5',
        totalRecords: 8,
        totalSimpleSlips: 2,
        totalSimpleAmount: 30000,
      };

      expect(batchTrailer.recordType).toBe('5');
      expect(batchTrailer.totalRecords).toBe(8);
    });
  });

  describe('SegmentP', () => {
    it('should define valid Segment P structure', () => {
      const segmentP: SegmentP = {
        bankCode: '341',
        batchNumber: 1,
        recordType: '3',
        sequentialNumber: 1,
        segmentCode: 'P',
        occurrenceCode: '01',
        agency: '4897',
        account: '17450',
        accountDigit: '6',
        ourNumber: '12345678',
        portfolioCode: '109',
        documentNumber: 'NF-001',
        dueDate: new Date('2026-02-28'),
        amount: 15000,
        speciesCode: '01',
        acceptance: 'N',
        issueDate: new Date('2026-01-21'),
        currencyCode: '09',
      };

      expect(segmentP.segmentCode).toBe('P');
      expect(segmentP.amount).toBe(15000);
    });
  });

  describe('SegmentQ', () => {
    it('should define valid Segment Q structure', () => {
      const segmentQ: SegmentQ = {
        bankCode: '341',
        batchNumber: 1,
        recordType: '3',
        sequentialNumber: 2,
        segmentCode: 'Q',
        occurrenceCode: '01',
        payerRegistrationType: '1',
        payerTaxId: '98765432000100',
        payerName: 'ACME CORPORATION LTDA',
        payerAddress: 'RUA EXEMPLO 123',
        payerNeighborhood: 'CENTRO',
        payerPostalCode: '01310100',
        payerCity: 'SAO PAULO',
        payerState: 'SP',
      };

      expect(segmentQ.segmentCode).toBe('Q');
      expect(segmentQ.payerTaxId).toBe('98765432000100');
    });
  });

  describe('SegmentR', () => {
    it('should define valid Segment R structure', () => {
      const segmentR: SegmentR = {
        bankCode: '341',
        batchNumber: 1,
        recordType: '3',
        sequentialNumber: 3,
        segmentCode: 'R',
        occurrenceCode: '01',
        discount2Code: '0',
        fineCode: '2',
        fineDate: new Date('2026-03-01'),
        fineAmount: 200,
      };

      expect(segmentR.segmentCode).toBe('R');
      expect(segmentR.fineCode).toBe('2');
    });
  });

  describe('DetailRecord', () => {
    it('should combine segments P and Q', () => {
      const detail: DetailRecord = {
        segmentP: {
          bankCode: '341',
          batchNumber: 1,
          recordType: '3',
          sequentialNumber: 1,
          segmentCode: 'P',
          occurrenceCode: '01',
          agency: '4897',
          account: '17450',
          accountDigit: '6',
          ourNumber: '12345678',
          portfolioCode: '109',
          documentNumber: 'NF-001',
          dueDate: new Date('2026-02-28'),
          amount: 15000,
          speciesCode: '01',
          acceptance: 'N',
          issueDate: new Date('2026-01-21'),
          currencyCode: '09',
        },
        segmentQ: {
          bankCode: '341',
          batchNumber: 1,
          recordType: '3',
          sequentialNumber: 2,
          segmentCode: 'Q',
          occurrenceCode: '01',
          payerRegistrationType: '1',
          payerTaxId: '98765432000100',
          payerName: 'ACME CORPORATION LTDA',
          payerAddress: 'RUA EXEMPLO 123',
          payerNeighborhood: 'CENTRO',
          payerPostalCode: '01310100',
          payerCity: 'SAO PAULO',
          payerState: 'SP',
        },
      };

      expect(detail.segmentP.segmentCode).toBe('P');
      expect(detail.segmentQ.segmentCode).toBe('Q');
      expect(detail.segmentR).toBeUndefined();
    });

    it('should include optional segment R', () => {
      const detail: DetailRecord = {
        segmentP: {
          bankCode: '341',
          batchNumber: 1,
          recordType: '3',
          sequentialNumber: 1,
          segmentCode: 'P',
          occurrenceCode: '01',
          agency: '4897',
          account: '17450',
          accountDigit: '6',
          ourNumber: '12345678',
          portfolioCode: '109',
          documentNumber: 'NF-001',
          dueDate: new Date('2026-02-28'),
          amount: 15000,
          speciesCode: '01',
          acceptance: 'N',
          issueDate: new Date('2026-01-21'),
          currencyCode: '09',
        },
        segmentQ: {
          bankCode: '341',
          batchNumber: 1,
          recordType: '3',
          sequentialNumber: 2,
          segmentCode: 'Q',
          occurrenceCode: '01',
          payerRegistrationType: '1',
          payerTaxId: '98765432000100',
          payerName: 'ACME CORPORATION LTDA',
          payerAddress: 'RUA EXEMPLO 123',
          payerNeighborhood: 'CENTRO',
          payerPostalCode: '01310100',
          payerCity: 'SAO PAULO',
          payerState: 'SP',
        },
        segmentR: {
          bankCode: '341',
          batchNumber: 1,
          recordType: '3',
          sequentialNumber: 3,
          segmentCode: 'R',
          occurrenceCode: '01',
          fineCode: '2',
          fineDate: new Date('2026-03-01'),
          fineAmount: 200,
        },
      };

      expect(detail.segmentR).toBeDefined();
      expect(detail.segmentR?.segmentCode).toBe('R');
    });
  });

  describe('Batch', () => {
    it('should define complete batch structure', () => {
      const batch: Batch = {
        header: {
          bankCode: '341',
          batchNumber: 1,
          recordType: '1',
          operationType: 'C',
          serviceType: '01',
          companyRegistrationType: '1',
          companyRegistrationNumber: '12345678000195',
          agency: '4897',
          account: '17450',
          accountDigit: '6',
          companyName: 'JCM INDUSTRIA E COMERCIO LTDA',
        },
        details: [
          {
            segmentP: {
              bankCode: '341',
              batchNumber: 1,
              recordType: '3',
              sequentialNumber: 1,
              segmentCode: 'P',
              occurrenceCode: '01',
              agency: '4897',
              account: '17450',
              accountDigit: '6',
              ourNumber: '12345678',
              portfolioCode: '109',
              documentNumber: 'NF-001',
              dueDate: new Date('2026-02-28'),
              amount: 15000,
              speciesCode: '01',
              acceptance: 'N',
              issueDate: new Date('2026-01-21'),
              currencyCode: '09',
            },
            segmentQ: {
              bankCode: '341',
              batchNumber: 1,
              recordType: '3',
              sequentialNumber: 2,
              segmentCode: 'Q',
              occurrenceCode: '01',
              payerRegistrationType: '1',
              payerTaxId: '98765432000100',
              payerName: 'ACME CORPORATION LTDA',
              payerAddress: 'RUA EXEMPLO 123',
              payerNeighborhood: 'CENTRO',
              payerPostalCode: '01310100',
              payerCity: 'SAO PAULO',
              payerState: 'SP',
            },
          },
        ],
        trailer: {
          bankCode: '341',
          batchNumber: 1,
          recordType: '5',
          totalRecords: 4,
          totalSimpleSlips: 1,
          totalSimpleAmount: 15000,
        },
      };

      expect(batch.header.batchNumber).toBe(1);
      expect(batch.details).toHaveLength(1);
      expect(batch.trailer.totalRecords).toBe(4);
    });
  });

  describe('Cnab240File', () => {
    it('should define complete CNAB240 file structure', () => {
      const file: Cnab240File = {
        fileHeader: {
          bankCode: '341',
          batchNumber: '0000',
          recordType: '0',
          companyRegistrationType: '1',
          companyRegistrationNumber: '12345678000195',
          agency: '4897',
          account: '17450',
          accountDigit: '6',
          companyName: 'JCM INDUSTRIA E COMERCIO LTDA',
          bankName: 'BANCO ITAU SA',
          fileCode: '1',
          generationDate: new Date('2026-01-21'),
          sequentialNumber: 1,
          layoutVersion: '103',
          currencyCode: '09',
        },
        batches: [
          {
            header: {
              bankCode: '341',
              batchNumber: 1,
              recordType: '1',
              operationType: 'C',
              serviceType: '01',
              companyRegistrationType: '1',
              companyRegistrationNumber: '12345678000195',
              agency: '4897',
              account: '17450',
              accountDigit: '6',
              companyName: 'JCM INDUSTRIA E COMERCIO LTDA',
            },
            details: [
              {
                segmentP: {
                  bankCode: '341',
                  batchNumber: 1,
                  recordType: '3',
                  sequentialNumber: 1,
                  segmentCode: 'P',
                  occurrenceCode: '01',
                  agency: '4897',
                  account: '17450',
                  accountDigit: '6',
                  ourNumber: '12345678',
                  portfolioCode: '109',
                  documentNumber: 'NF-001',
                  dueDate: new Date('2026-02-28'),
                  amount: 15000,
                  speciesCode: '01',
                  acceptance: 'N',
                  issueDate: new Date('2026-01-21'),
                  currencyCode: '09',
                },
                segmentQ: {
                  bankCode: '341',
                  batchNumber: 1,
                  recordType: '3',
                  sequentialNumber: 2,
                  segmentCode: 'Q',
                  occurrenceCode: '01',
                  payerRegistrationType: '1',
                  payerTaxId: '98765432000100',
                  payerName: 'ACME CORPORATION LTDA',
                  payerAddress: 'RUA EXEMPLO 123',
                  payerNeighborhood: 'CENTRO',
                  payerPostalCode: '01310100',
                  payerCity: 'SAO PAULO',
                  payerState: 'SP',
                },
              },
            ],
            trailer: {
              bankCode: '341',
              batchNumber: 1,
              recordType: '5',
              totalRecords: 4,
              totalSimpleSlips: 1,
              totalSimpleAmount: 15000,
            },
          },
        ],
        fileTrailer: {
          bankCode: '341',
          batchNumber: '9999',
          recordType: '9',
          totalBatches: 1,
          totalRecords: 6,
        },
      };

      expect(file.fileHeader.recordType).toBe('0');
      expect(file.batches).toHaveLength(1);
      expect(file.fileTrailer.recordType).toBe('9');
      expect(file.fileTrailer.totalBatches).toBe(1);
    });
  });
});
