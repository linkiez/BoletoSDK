/**
 * CNAB400 Generator - Integration Tests
 *
 * Tests round-trip conversion: Parse → Generate → Parse
 * Validates that generated CNAB400 files match the original format
 */

import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { generateCnab400 } from '../../src/generators/cnab400';
import { parseCnab400 } from '../../src/parsers/cnab400';
import type { Cnab400File } from '../../src/types/cnab400';

describe('CNAB400 Generator - Integration Tests', () => {
  describe('Round-Trip Conversion', () => {
    let originalContent: string;
    let parsedFile: Cnab400File;

    beforeAll(() => {
      // Load real fixture
      const fixturePath = join(__dirname, '../fixtures/cnab400/itau-retorno-sample1.ret');
      originalContent = readFileSync(fixturePath, 'utf-8');
      parsedFile = parseCnab400(originalContent);
    });

    it('should generate valid 400-character lines', () => {
      const generated = generateCnab400(parsedFile);
      const lines = generated.split('\n').filter((l: string) => l.length > 0);

      lines.forEach((line: string) => {
        expect(line.length).toBe(400);
      });
    });

    it('should generate same number of lines as original', () => {
      const generated = generateCnab400(parsedFile);
      const originalLines = originalContent.split('\n').filter((l: string) => l.length > 0);
      const generatedLines = generated.split('\n').filter((l: string) => l.length > 0);

      expect(generatedLines.length).toBe(originalLines.length);
    });

    it('should generate header with type 0', () => {
      const generated = generateCnab400(parsedFile);
      const firstLine = generated.split('\n')[0];

      expect(firstLine.charAt(0)).toBe('0');
    });

    it('should generate trailer with type 9', () => {
      const generated = generateCnab400(parsedFile);
      const lines = generated.split('\n').filter((l: string) => l.length > 0);
      const lastLine = lines[lines.length - 1];

      expect(lastLine.charAt(0)).toBe('9');
    });

    it('should generate detail records with type 1', () => {
      const generated = generateCnab400(parsedFile);
      const lines = generated.split('\n').filter((l: string) => l.length > 0);

      // Middle lines should be details (type 1)
      for (let i = 1; i < lines.length - 1; i++) {
        expect(lines[i].charAt(0)).toBe('1');
      }
    });

    it('should preserve header data after round-trip', () => {
      const generated = generateCnab400(parsedFile);
      const reparsed = parseCnab400(generated);

      expect(reparsed.header.bankCode).toBe(parsedFile.header.bankCode);
      expect(reparsed.header.companyName).toBe(parsedFile.header.companyName);
      expect(reparsed.header.agency).toBe(parsedFile.header.agency);
      expect(reparsed.header.account).toBe(parsedFile.header.account);
    });

    it('should preserve detail records after round-trip', () => {
      const generated = generateCnab400(parsedFile);
      const reparsed = parseCnab400(generated);

      expect(reparsed.details.length).toBe(parsedFile.details.length);

      // Check first detail
      expect(reparsed.details[0].ourNumber).toBe(parsedFile.details[0].ourNumber);
      expect(reparsed.details[0].amount).toBe(parsedFile.details[0].amount);
      expect(reparsed.details[0].payerName).toBe(parsedFile.details[0].payerName);
    });

    it('should preserve trailer data after round-trip', () => {
      const generated = generateCnab400(parsedFile);
      const reparsed = parseCnab400(generated);

      expect(reparsed.trailer.totalRecords).toBe(parsedFile.trailer.totalRecords);
    });
  });
});
