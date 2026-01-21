import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { ParseError } from '../../src/errors';
import { parseCnab400 } from '../../src/parsers/cnab400';

/**
 * Integration tests for CNAB400 error handling
 *
 * Tests various error scenarios:
 * - Invalid line lengths
 * - Invalid record types
 * - Malformed data
 * - Missing required records
 */
describe('CNAB400 Error Handling - Integration Tests', () => {
  const fixturesPath = join(__dirname, '..', 'fixtures', 'cnab400');

  describe('Line Length Validation', () => {
    it('should reject file with short lines', () => {
      const invalidContent = '0' + '1'.repeat(200) + '\n' + '9' + '2'.repeat(200); // Lines are 201 chars instead of 400

      expect(() => parseCnab400(invalidContent)).toThrow(ParseError);
      expect(() => parseCnab400(invalidContent)).toThrow('Invalid line length');
    });

    it('should reject file with long lines', () => {
      const invalidContent = '0' + '1'.repeat(500) + '\n' + '9' + '2'.repeat(500); // Lines are 501 chars instead of 400

      expect(() => parseCnab400(invalidContent)).toThrow(ParseError);
      expect(() => parseCnab400(invalidContent)).toThrow('Invalid line length');
    });

    it('should reject file with mixed line lengths', () => {
      const line1 = '0' + '1'.repeat(399); // Valid 400-char header
      const line2 = '1' + '2'.repeat(200); // Invalid 201-char detail
      const invalidContent = `${line1}\n${line2}`;

      expect(() => parseCnab400(invalidContent)).toThrow(ParseError);
    });
  });

  describe('Record Type Validation', () => {
    it('should reject file without header (type 0)', () => {
      const line1 = '1' + '2'.repeat(399); // Detail as first line instead of header
      const line2 = '9' + '3'.repeat(399); // Trailer
      const invalidContent = `${line1}\n${line2}`;

      expect(() => parseCnab400(invalidContent)).toThrow(ParseError);
      expect(() => parseCnab400(invalidContent)).toThrow('First record must be header');
    });

    it('should reject file without trailer (type 9)', () => {
      const line1 = '0' + '1'.repeat(399); // Header
      const line2 = '1' + '2'.repeat(399); // Detail
      const invalidContent = `${line1}\n${line2}`; // No trailer

      expect(() => parseCnab400(invalidContent)).toThrow(ParseError);
      expect(() => parseCnab400(invalidContent)).toThrow('Last record must be trailer');
    });

    it('should reject file with invalid record type', () => {
      const line1 = '0' + '1'.repeat(399); // Header
      const line2 = 'X' + '2'.repeat(399); // Invalid type 'X'
      const line3 = '9' + '3'.repeat(399); // Trailer
      const invalidContent = `${line1}\n${line2}\n${line3}`;

      expect(() => parseCnab400(invalidContent)).toThrow(ParseError);
      expect(() => parseCnab400(invalidContent)).toThrow('Invalid record type');
    });
  });

  describe('Date Format Validation', () => {
    it('should reject invalid date in header', () => {
      const validFile = readFileSync(join(fixturesPath, 'itau-retorno-sample1.ret'), 'utf-8');
      const lines = validFile.split('\n');

      // Corrupt date field in header (positions 95-100 for generation date)
      const corruptedHeader = lines[0].substring(0, 94) + '999999' + lines[0].substring(100);
      const corruptedContent = [corruptedHeader, ...lines.slice(1)].join('\n');

      expect(() => parseCnab400(corruptedContent)).toThrow();
    });
  });

  describe('Empty File Validation', () => {
    it('should reject empty file', () => {
      expect(() => parseCnab400('')).toThrow(ParseError);
    });

    it('should reject file with only whitespace', () => {
      expect(() => parseCnab400('   \n\n   ')).toThrow(ParseError);
    });

    it('should reject file with only header (no details)', () => {
      const headerOnly = '0' + '1'.repeat(399);

      expect(() => parseCnab400(headerOnly)).toThrow(ParseError);
    });
  });

  describe('Real-World Error Scenarios', () => {
    it('should provide helpful error message for truncated file', () => {
      const validFile = readFileSync(join(fixturesPath, 'itau-retorno-sample1.ret'), 'utf-8');
      const lines = validFile.split('\n');

      // Remove trailer (simulate incomplete download)
      const truncatedContent = lines.slice(0, -1).join('\n');

      expect(() => parseCnab400(truncatedContent)).toThrow(ParseError);
      expect(() => parseCnab400(truncatedContent)).toThrow('Last record must be trailer');
    });

    it('should handle file with extra newlines gracefully', () => {
      const validFile = readFileSync(join(fixturesPath, 'itau-retorno-sample1.ret'), 'utf-8');

      // Add extra newlines (simulate text editor modifications)
      const contentWithExtraNewlines = validFile + '\n\n\n';

      // Should still parse correctly by filtering empty lines
      expect(() => parseCnab400(contentWithExtraNewlines)).not.toThrow();
    });

    it('should reject file with corrupt record in middle', () => {
      const validFile = readFileSync(join(fixturesPath, 'itau-retorno-sample1.ret'), 'utf-8');
      const lines = validFile.split('\n');

      // Corrupt a middle detail record (make it shorter)
      if (lines.length > 2) {
        const corruptedLines = [...lines];
        corruptedLines[1] = lines[1].substring(0, 200); // Truncate detail record
        const corruptedContent = corruptedLines.join('\n');

        expect(() => parseCnab400(corruptedContent)).toThrow(ParseError);
      }
    });
  });

  describe('Encoding Issues', () => {
    it('should handle files with UTF-8 encoding', () => {
      const validFile = readFileSync(join(fixturesPath, 'itau-retorno-sample1.ret'), 'utf-8');

      // Should parse correctly with UTF-8
      expect(() => parseCnab400(validFile)).not.toThrow();
    });

    it('should reject file with binary characters', () => {
      const binaryContent = '\x00\x01\x02' + '0'.repeat(397);

      expect(() => parseCnab400(binaryContent)).toThrow();
    });
  });

  describe('Performance with Large Files', () => {
    it('should handle file with many detail records', () => {
      // Read a valid file and replicate detail records
      const validFile = readFileSync(join(fixturesPath, 'itau-retorno-sample1.ret'), 'utf-8');
      const validLines = validFile.split('\n').filter((line) => line.length > 0);

      // Extract header and trailer
      const header = validLines[0];
      const trailer = validLines.at(-1)!;

      // Use first detail record as template
      const detailTemplate = validLines.find((line) => line.startsWith('1'))!;

      // Create file with 100 copies of the detail record
      const manyDetails = new Array(100).fill(detailTemplate);
      const largeFile = [header, ...manyDetails, trailer].join('\n');

      // Should parse without throwing
      expect(() => parseCnab400(largeFile)).not.toThrow();

      const result = parseCnab400(largeFile);
      expect(result.details).toHaveLength(100);
    }, 10000); // 10 second timeout for performance test
  });

  describe('Error Context', () => {
    it('should include line number in error messages', () => {
      const line1 = '0' + '1'.repeat(399); // Header
      const line2 = '1' + '2'.repeat(200); // Invalid detail (too short) - line 2
      const line3 = '9' + '3'.repeat(399); // Trailer
      const invalidContent = `${line1}\n${line2}\n${line3}`;

      try {
        parseCnab400(invalidContent);
        fail('Should have thrown ParseError');
      } catch (error) {
        expect(error).toBeInstanceOf(ParseError);
        const parseError = error as ParseError;
        expect(parseError.line).toBe(2);
      }
    });

    it('should include helpful context in error message', () => {
      const invalidContent = '1' + '2'.repeat(399) + '\n' + '9' + '3'.repeat(399); // Detail as first line instead of header

      try {
        parseCnab400(invalidContent);
        fail('Should have thrown ParseError');
      } catch (error) {
        expect(error).toBeInstanceOf(ParseError);
        if (error instanceof Error) {
          expect(error.message).toContain('First record must be header');
        }
      }
    });
  });
});
