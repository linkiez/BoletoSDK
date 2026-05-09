/**
 * CNAB400 Parser Integration Tests
 *
 * Tests parsing of real CNAB400 files using fixtures.
 * Follows TDD approach: write test, implement parser, verify.
 */

import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { parseCnab400 } from '../../src/parsers/cnab400';

describe('CNAB400 Parser - Integration Tests', () => {
  const fixturesPath = join(__dirname, '../fixtures/cnab400');

  describe('Itaú Return File', () => {
    const fixturePath = join(fixturesPath, 'itau-retorno-sample1.ret');
    let fileContent: string;

    beforeAll(() => {
      fileContent = readFileSync(fixturePath, 'utf-8').replaceAll('\r', '');
    });

    it('should have 400-character lines', () => {
      const lines = fileContent.split('\n').filter((line) => line.length > 0);
      lines.forEach((line) => {
        expect(line.length).toBe(400);
      });
    });

    it('should have header as first line (type 0)', () => {
      const firstLine = fileContent.split('\n')[0];
      expect(firstLine[0]).toBe('0');
    });

    it('should have trailer as last line (type 9)', () => {
      const lines = fileContent.trim().split('\n');
      const lastLine = lines.at(-1)!;
      expect(lastLine[0]).toBe('9');
    });

    it('should have detail records (type 1)', () => {
      const lines = fileContent.trim().split('\n');
      const detailLines = lines.filter((line) => line.startsWith('1'));
      expect(detailLines.length).toBeGreaterThan(0);
    });

    it('should parse complete return file', () => {
      const result = parseCnab400(fileContent);

      expect(result.header.recordType).toBe('0');
      expect(result.header.operationType).toBe('2'); // RETORNO
      expect(result.details.length).toBeGreaterThan(0);
      expect(result.trailer.recordType).toBe('9');
    });

    it('should parse header with correct bank code', () => {
      const result = parseCnab400(fileContent);

      expect(result.header.bankCode).toBe('341'); // Itaú
      expect(result.header.bankName).toContain('ITAU');
    });

    it('should parse detail records with occurrence codes', () => {
      const result = parseCnab400(fileContent);

      result.details.forEach((detail) => {
        expect(detail.recordType).toBe('1');
        expect(detail.ourNumber).toBeDefined();
        expect(detail.payerName).toBeDefined();
      });
    });

    it('should parse trailer with correct record count', () => {
      const result = parseCnab400(fileContent);

      expect(result.trailer.totalRecords).toBe(201341); // Total records from actual fixture
    });
  });
});
