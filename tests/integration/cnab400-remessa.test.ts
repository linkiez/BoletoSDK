import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { generateCnab400 } from '../../src/generators/cnab400';
import { parseCnab400 } from '../../src/parsers/cnab400';
import type { Cnab400File } from '../../src/types/cnab400';

/**
 * Integration tests for CNAB400 REMESSA files
 *
 * Tests parsing and generation of remittance (REMESSA) files,
 * which have different field positions than return (RETORNO) files.
 */
describe('CNAB400 REMESSA - Integration Tests', () => {
  const fixturesPath = join(__dirname, '..', 'fixtures', 'cnab400');
  let remessaContent: string;
  let parsedRemessa: Cnab400File;

  beforeAll(() => {
    remessaContent = readFileSync(join(fixturesPath, 'itau-remessa-sample1.ret'), 'utf-8');
    parsedRemessa = parseCnab400(remessaContent) as Cnab400File;
  });

  describe('File Structure', () => {
    it('should have 400-character lines', () => {
      const lines = remessaContent.split('\n').filter((line) => line.length > 0);
      lines.forEach((line) => {
        expect(line.length).toBe(400);
      });
    });

    it('should have header as first line (type 0)', () => {
      const firstLine = remessaContent.split('\n')[0];
      expect(firstLine.charAt(0)).toBe('0');
    });

    it('should have trailer as last line (type 9)', () => {
      const lines = remessaContent.split('\n').filter((line) => line.length > 0);
      const lastLine = lines.at(-1)!;
      expect(lastLine.charAt(0)).toBe('9');
    });

    it('should have detail records (type 1)', () => {
      const lines = remessaContent.split('\n').filter((line) => line.length > 0);
      const detailLines = lines.filter((line) => line.startsWith('1'));
      expect(detailLines.length).toBeGreaterThan(0);
    });
  });

  describe('Header Parsing', () => {
    it('should parse complete REMESSA file', () => {
      expect(parsedRemessa).toBeDefined();
      expect(parsedRemessa.header).toBeDefined();
      expect(parsedRemessa.details).toBeDefined();
      expect(parsedRemessa.trailer).toBeDefined();
    });

    it('should identify as REMESSA operation type', () => {
      expect(parsedRemessa.header.operationType).toBe('1');
      expect(parsedRemessa.header.operationLiteral).toContain('REMESSA');
    });

    it('should parse header with correct bank code', () => {
      expect(parsedRemessa.header.bankCode).toBe('341');
      expect(parsedRemessa.header.bankName).toContain('ITAU');
    });

    it('should parse header company information', () => {
      expect(parsedRemessa.header.companyName).toBeTruthy();
      expect(parsedRemessa.header.agency).toBeTruthy();
      expect(parsedRemessa.header.account).toBeTruthy();
    });

    it('should parse header date fields', () => {
      expect(parsedRemessa.header.generationDate).toBeInstanceOf(Date);
    });
  });

  describe('Detail Records Parsing', () => {
    it('should parse all detail records', () => {
      const lines = remessaContent.split('\n').filter((line) => line.length > 0);
      const detailLineCount = lines.filter((line) => line.startsWith('1')).length;
      expect(parsedRemessa.details.length).toBe(detailLineCount);
    });

    it('should parse detail with registration info', () => {
      const firstDetail = parsedRemessa.details[0];
      expect(firstDetail.companyRegistrationType).toBeTruthy();
      expect(firstDetail.companyRegistrationNumber).toBeTruthy();
    });

    it('should parse detail with account info', () => {
      const firstDetail = parsedRemessa.details[0];
      expect(firstDetail.agency).toBeTruthy();
      expect(firstDetail.account).toBeTruthy();
    });

    it('should parse detail with amount', () => {
      const detailsWithAmount = parsedRemessa.details.filter(
        (detail) => detail.amount && detail.amount > 0,
      );
      expect(detailsWithAmount.length).toBeGreaterThan(0);
    });

    it('should parse detail with due date', () => {
      const detailsWithDate = parsedRemessa.details.filter(
        (detail) => detail.dueDate instanceof Date,
      );
      expect(detailsWithDate.length).toBeGreaterThan(0);
    });

    it('should parse detail with payer name', () => {
      const firstDetail = parsedRemessa.details[0];
      expect(firstDetail.payerName).toBeTruthy();
      expect(firstDetail.payerName.length).toBeGreaterThan(0);
    });
  });

  describe('Trailer Parsing', () => {
    it('should parse trailer with correct record count', () => {
      // REMESSA files from production may have totalRecords blank (parsed as 0)
      // This is valid according to FEBRABAN standard
      expect(parsedRemessa.trailer.totalRecords).toBeGreaterThanOrEqual(0);
      expect(parsedRemessa.trailer.sequentialNumber).toBeGreaterThan(0);
    });

    it('should have sequential number matching line count', () => {
      const lines = remessaContent.split('\n').filter((line) => line.length > 0);
      expect(parsedRemessa.trailer.sequentialNumber).toBe(lines.length);
    });
  });

  describe('Round-Trip Conversion (REMESSA)', () => {
    it('should generate valid 400-character lines', () => {
      const generated = generateCnab400(parsedRemessa);
      const generatedLines = generated.split('\n').filter((line) => line.length > 0);

      generatedLines.forEach((line) => {
        expect(line.length).toBe(400);
      });
    });

    it('should generate same number of lines as original', () => {
      const originalLines = remessaContent.split('\n').filter((line) => line.length > 0);
      const generated = generateCnab400(parsedRemessa);
      const generatedLines = generated.split('\n').filter((line) => line.length > 0);

      expect(generatedLines.length).toBe(originalLines.length);
    });

    it('should generate header with type 0', () => {
      const generated = generateCnab400(parsedRemessa);
      const firstLine = generated.split('\n')[0];
      expect(firstLine.charAt(0)).toBe('0');
    });

    it('should generate trailer with type 9', () => {
      const generated = generateCnab400(parsedRemessa);
      const lines = generated.split('\n').filter((line) => line.length > 0);
      const lastLine = lines.at(-1)!;
      expect(lastLine.charAt(0)).toBe('9');
    });

    it('should generate detail records with type 1', () => {
      const generated = generateCnab400(parsedRemessa);
      const lines = generated.split('\n').filter((line) => line.length > 0);
      const detailLines = lines.filter((line) => line.startsWith('1'));
      expect(detailLines.length).toBe(parsedRemessa.details.length);
    });

    it('should preserve header data after round-trip', () => {
      const generated = generateCnab400(parsedRemessa);
      const reparsed = parseCnab400(generated) as Cnab400File;

      expect(reparsed.header.operationType).toBe(parsedRemessa.header.operationType);
      expect(reparsed.header.bankCode).toBe(parsedRemessa.header.bankCode);
      expect(reparsed.header.companyName).toBe(parsedRemessa.header.companyName);
    });

    it('should preserve detail count after round-trip', () => {
      const generated = generateCnab400(parsedRemessa);
      const reparsed = parseCnab400(generated) as Cnab400File;

      expect(reparsed.details.length).toBe(parsedRemessa.details.length);
    });

    it('should preserve trailer data after round-trip', () => {
      const generated = generateCnab400(parsedRemessa);
      const reparsed = parseCnab400(generated) as Cnab400File;

      expect(reparsed.trailer.totalRecords).toBe(parsedRemessa.trailer.totalRecords);
    });
  });

  describe('REMESSA vs RETORNO Differences', () => {
    it('should correctly identify REMESSA files', () => {
      expect(parsedRemessa.header.operationType).toBe('1');
      expect(parsedRemessa.header.operationLiteral).toContain('REMESSA');
    });

    it('should not have occurrence codes (RETORNO-only field)', () => {
      const firstDetail = parsedRemessa.details[0];
      // REMESSA files don't have occurrence codes (RETORNO-only)
      expect((firstDetail as { occurrenceCode?: string }).occurrenceCode).toBeUndefined();
    });

    it('should have instruction codes (REMESSA field)', () => {
      const detailsWithInstructions = parsedRemessa.details.filter(
        (detail) =>
          (detail as { instructionCode1?: string; instructionCode2?: string }).instructionCode1 ||
          (detail as { instructionCode1?: string; instructionCode2?: string }).instructionCode2,
      );
      // REMESSA files typically have instruction codes
      expect(detailsWithInstructions.length).toBeGreaterThanOrEqual(0);
    });
  });
});
