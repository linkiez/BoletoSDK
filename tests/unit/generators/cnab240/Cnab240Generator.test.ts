import { Cnab240Generator } from '../../../../src/generators/cnab240/Cnab240Generator';
import { Cnab240File } from '../../../../src/types';

describe('Cnab240Generator', () => {
  let generator: Cnab240Generator;

  beforeEach(() => {
    generator = new Cnab240Generator();
  });

  // Helper to create minimal valid CNAB240 file structure
  const createMinimalFile = (): Cnab240File => ({
    fileHeader: {
      bankCode: '341',
      batchNumber: '0000',
      recordType: '0',
      companyRegistrationType: '2',
      companyRegistrationNumber: '12345678000195',
      agency: '1234',
      agencyDigit: '5',
      account: '123456',
      accountDigit: '7',
      companyName: 'ACME Corp',
      bankName: 'BANCO ITAU SA',
      fileCode: '1',
      generationDate: new Date('2024-01-15'),
      sequentialNumber: 1,
      layoutVersion: '103',
    },
    batches: [
      {
        header: {
          bankCode: '341',
          batchNumber: 1,
          recordType: '1',
          operationType: 'C',
          serviceType: '01',
          companyRegistrationType: '2',
          companyRegistrationNumber: '12345678000195',
          agency: '1234',
          agencyDigit: '5',
          account: '123456',
          accountDigit: '7',
          companyName: 'ACME Corp',
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
              agency: '1234',
              agencyDigit: '5',
              account: '123456',
              accountDigit: '7',
              fullAccountDigit: '8',
              ourNumber: '12345678901234567890',
              portfolioCode: '109',
              documentNumber: 'DOC001',
              dueDate: new Date('2024-02-15'),
              amount: 100.5,
              collectionAgency: '0',
              collectionAgencyDigit: '',
              speciesCode: '01',
              acceptance: 'N',
              issueDate: new Date('2024-01-15'),
              interestCode: '0',
              interestDate: new Date('2024-02-16'),
              interestAmount: 0,
              discountCode: '0',
              discountDate: new Date('2024-02-10'),
              discountAmount: 0,
              iofAmount: 0,
              rebateAmount: 0,
              protestCode: '3',
              protestDays: 0,
              writeOffCode: '0',
              writeOffDays: 0,
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
              payerTaxId: '12345678901',
              payerName: 'John Doe',
              payerAddress: 'Street Test 123',
              payerNeighborhood: 'Centro',
              payerPostalCode: '12345678',
              payerCity: 'Sao Paulo',
              payerState: 'SP',
            },
          },
        ],
        trailer: {
          bankCode: '341',
          batchNumber: 1,
          recordType: '5',
          totalRecords: 4,
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
  });

  describe('Basic generation', () => {
    it('should generate complete CNAB240 file with all lines', () => {
      const file = createMinimalFile();
      const result = generator.generate(file);

      const lines = result.split('\n');
      expect(lines).toHaveLength(6); // Header + BatchHeader + P + Q + BatchTrailer + FileTrailer
    });

    it('should generate lines with exactly 240 characters each', () => {
      const file = createMinimalFile();
      const result = generator.generate(file);

      const lines = result.split('\n');
      lines.forEach((line: string) => {
        expect(line).toHaveLength(240);
      });
    });

    it('should start with file header (type 0)', () => {
      const file = createMinimalFile();
      const result = generator.generate(file);

      const firstLine = result.split('\n')[0];
      expect(firstLine.substring(7, 8)).toBe('0'); // Record type at position 8
    });

    it('should end with file trailer (type 9)', () => {
      const file = createMinimalFile();
      const result = generator.generate(file);

      const lines = result.split('\n');
      const lastLine = lines.at(-1);
      expect(lastLine?.substring(7, 8)).toBe('9'); // Record type at position 8
    });
  });

  describe('Batch structure', () => {
    it('should include batch header (type 1) after file header', () => {
      const file = createMinimalFile();
      const result = generator.generate(file);

      const lines = result.split('\n');
      expect(lines[1].substring(7, 8)).toBe('1'); // Batch header
    });

    it('should include batch trailer (type 5) before file trailer', () => {
      const file = createMinimalFile();
      const result = generator.generate(file);

      const lines = result.split('\n');
      expect(lines[4].substring(7, 8)).toBe('5'); // Batch trailer
    });

    it('should handle multiple batches', () => {
      const file = createMinimalFile();
      // Add second batch
      const secondBatch = {
        ...file.batches[0],
        header: { ...file.batches[0].header, batchNumber: 2 },
        details: [
          {
            segmentP: {
              ...file.batches[0].details[0].segmentP,
              batchNumber: 2,
              dueDate: new Date('2024-02-15'),
              issueDate: new Date('2024-01-15'),
              interestDate: new Date('2024-02-16'),
              discountDate: new Date('2024-02-10'),
            },
            segmentQ: { ...file.batches[0].details[0].segmentQ, batchNumber: 2 },
          },
        ],
        trailer: { ...file.batches[0].trailer, batchNumber: 2 },
      };

      file.batches.push(secondBatch);
      file.fileTrailer.totalBatches = 2;
      file.fileTrailer.totalRecords = 10;

      const result = generator.generate(file);
      const lines = result.split('\n');

      expect(lines).toHaveLength(10);
      // Check batch numbers in generated content
      expect(lines[1].substring(3, 7)).toBe('0001'); // Batch 1 header
      expect(lines[5].substring(3, 7)).toBe('0002'); // Batch 2 header
    });
  });

  describe('Detail records', () => {
    it('should include segment P (type 3, code P)', () => {
      const file = createMinimalFile();
      const result = generator.generate(file);

      const lines = result.split('\n');
      expect(lines[2].substring(7, 8)).toBe('3'); // Detail record type
      expect(lines[2].substring(13, 14)).toBe('P'); // Segment code
    });

    it('should include segment Q (type 3, code Q)', () => {
      const file = createMinimalFile();
      const result = generator.generate(file);

      const lines = result.split('\n');
      expect(lines[3].substring(7, 8)).toBe('3'); // Detail record type
      expect(lines[3].substring(13, 14)).toBe('Q'); // Segment code
    });

    it('should include segment R when present', () => {
      const file = createMinimalFile();
      file.batches[0].details[0].segmentR = {
        bankCode: '341',
        batchNumber: 1,
        recordType: '3',
        sequentialNumber: 3,
        segmentCode: 'R',
        occurrenceCode: '01',
        discount2Code: '1',
        discount2Date: new Date('2024-02-10'),
        discount2Amount: 5,
      };

      const result = generator.generate(file);
      const lines = result.split('\n');

      expect(lines).toHaveLength(7);
      expect(lines[4].substring(13, 14)).toBe('R'); // Segment R
    });

    it('should handle multiple details in a batch', () => {
      const file = createMinimalFile();
      const secondDetail = {
        segmentP: {
          ...file.batches[0].details[0].segmentP,
          sequentialNumber: 3,
          documentNumber: 'DOC002',
          dueDate: new Date('2024-02-15'),
          issueDate: new Date('2024-01-15'),
          interestDate: new Date('2024-02-16'),
          discountDate: new Date('2024-02-10'),
        },
        segmentQ: { ...file.batches[0].details[0].segmentQ, sequentialNumber: 4 },
      };

      file.batches[0].details.push(secondDetail);

      const result = generator.generate(file);
      const lines = result.split('\n');

      expect(lines).toHaveLength(8);
      // First detail P+Q
      expect(lines[2].substring(13, 14)).toBe('P');
      expect(lines[3].substring(13, 14)).toBe('Q');
      // Second detail P+Q
      expect(lines[4].substring(13, 14)).toBe('P');
      expect(lines[5].substring(13, 14)).toBe('Q');
    });
  });

  describe('Validation', () => {
    it('should throw error if fileHeader is missing', () => {
      const file: Partial<Cnab240File> = createMinimalFile();
      file.fileHeader = undefined;

      expect(() => generator.generate(file as Cnab240File)).toThrow('File header is required');
    });

    it('should throw error if batches array is empty', () => {
      const file = createMinimalFile();
      file.batches = [];

      expect(() => generator.generate(file)).toThrow('At least one batch is required');
    });

    it('should throw error if batch has no details', () => {
      const file = createMinimalFile();
      file.batches[0].details = [];

      expect(() => generator.generate(file)).toThrow('At least one detail is required in batch');
    });

    it('should throw error if detail has no segmentP', () => {
      const file = createMinimalFile();
      file.batches[0].details[0].segmentP =
        undefined as unknown as Cnab240File['batches'][0]['details'][0]['segmentP'];

      expect(() => generator.generate(file)).toThrow('Segment P is required in detail');
    });

    it('should throw error if detail has no segmentQ', () => {
      const file = createMinimalFile();
      file.batches[0].details[0].segmentQ =
        undefined as unknown as Cnab240File['batches'][0]['details'][0]['segmentQ'];

      expect(() => generator.generate(file)).toThrow('Segment Q is required in detail');
    });

    it('should throw error if fileTrailer is missing', () => {
      const file: Partial<Cnab240File> = createMinimalFile();
      file.fileTrailer = undefined;

      expect(() => generator.generate(file as Cnab240File)).toThrow('File trailer is required');
    });
  });

  describe('Integration with component generators', () => {
    it('should generate file that has correct structure', () => {
      const file = createMinimalFile();
      const generated = generator.generate(file);

      // Basic structural validation
      const lines = generated.split('\n');
      expect(lines.every((line: string) => line.length === 240)).toBe(true);
      expect(lines[0].substring(7, 8)).toBe('0'); // File header
      expect(lines.at(-1)?.substring(7, 8)).toBe('9'); // File trailer
    });

    it('should use all component generators correctly', () => {
      const file = createMinimalFile();
      const result = generator.generate(file);

      const lines = result.split('\n');
      // Verify structure: Header(0) + BatchHeader(1) + P(3) + Q(3) + BatchTrailer(5) + FileTrailer(9)
      expect(lines[0].substring(7, 8)).toBe('0');
      expect(lines[1].substring(7, 8)).toBe('1');
      expect(lines[2].substring(7, 8)).toBe('3');
      expect(lines[3].substring(7, 8)).toBe('3');
      expect(lines[4].substring(7, 8)).toBe('5');
      expect(lines[5].substring(7, 8)).toBe('9');
    });
  });
});
